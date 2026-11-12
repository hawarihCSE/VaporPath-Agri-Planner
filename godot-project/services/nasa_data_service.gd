extends Node

## NASA POWER API Data Service for VaporPath - Agri Planner
## Connects asynchronously to NASA's Prediction of Worldwide Energy Resources (POWER) API
## Fetches daily agroclimatology (community=AG) parameters:
## - GWETROOT: Root-zone soil wetness (0.0 to 1.0 fraction -> converted to %)
## - PRECTOTCORR: Corrected precipitation (mm/day -> compared with climatological baseline to compute anomaly %)
##
## Note: This service runs non-blocking. If offline, timed out, or unavailable,
## callers fall back safely to existing illustrative constants without UI disruption.

signal data_loaded(country: String, data: Dictionary)
signal data_failed(country: String, error_message: String)

# NASA POWER API Base Endpoint
const BASE_URL: String = "https://power.larc.nasa.gov/api/temporal/daily/point"
const COMMUNITY: String = "AG" # Agroclimatology community
const PARAMETERS: String = "GWETROOT,PRECTOTCORR"

# Representative Agricultural Locations
# Note: Specific agricultural production regions are used rather than misrepresenting
# a single point coordinate as a country-wide average.
const AG_LOCATIONS: Dictionary = {
	"Brazil": {
		"region_name": "Cerrado Ag Hub (Mato Grosso)",
		"lat": -12.55,
		"lon": -55.72,
		"baseline_precip_mm": 7.0 # Climatological wet season reference (mm/day)
	},
	"Argentina": {
		"region_name": "Pampas Ag Region (Rosario)",
		"lat": -32.95,
		"lon": -60.65,
		"baseline_precip_mm": 3.8
	},
	"Bolivia": {
		"region_name": "Santa Cruz Ag Basin",
		"lat": -17.78,
		"lon": -63.18,
		"baseline_precip_mm": 4.5
	},
	"Paraguay": {
		"region_name": "Alto Paraná Ag Basin",
		"lat": -25.51,
		"lon": -54.61,
		"baseline_precip_mm": 5.2
	}
}

# Reference date range for NASA POWER Daily MERRA-2 data
# (MERRA-2 daily assimilation operates with a 1-3 month operational latency)
const DEFAULT_START_DATE: String = "20240101"
const DEFAULT_END_DATE: String = "20240131"

# Internal HTTP Request node
var http_request: HTTPRequest = null

# In-memory live data cache: country_name -> Dictionary
var cached_live_data: Dictionary = {}

# Request tracking
var is_request_in_progress: bool = false
var active_request_country: String = ""
var active_request_url: String = ""


func _ready() -> void:
	print("[NasaDataService] Initializing NASA POWER API Service...")
	print("[NasaDataService] Instance ID: %d" % get_instance_id())
	
	http_request = HTTPRequest.new()
	http_request.timeout = 5.0 # 5-second non-blocking timeout
	add_child(http_request)
	http_request.request_completed.connect(_on_request_completed)
	
	# Pre-fetch Brazil data asynchronously so it's ready when the player progresses
	print("[NasaDataService] Pre-fetching Brazil data at startup...")
	fetch_country_data("Brazil")


## Fetch NASA POWER daily agroclimatology data for the specified country's ag hub
func fetch_country_data(country_name: String) -> void:
	if not AG_LOCATIONS.has(country_name):
		push_warning("[NasaDataService] Country '%s' not configured in AG_LOCATIONS" % country_name)
		return
	
	# Return cached data if already fetched
	if cached_live_data.has(country_name):
		print("[NasaDataService] CACHE HIT for '%s' — emitting data_loaded. Listener count: %d" % [
			country_name, data_loaded.get_connections().size()
		])
		data_loaded.emit(country_name, cached_live_data[country_name])
		return
	
	# Avoid duplicate overlapping requests
	if is_request_in_progress:
		if active_request_country == country_name:
			print("[NasaDataService] DEDUP: Request already in progress for '%s'. Listener count: %d" % [
				country_name, data_loaded.get_connections().size()
			])
			return
		else:
			print("[NasaDataService] DEDUP: Different request in progress (%s); skipping '%s'." % [active_request_country, country_name])
			return
	
	var loc: Dictionary = AG_LOCATIONS[country_name]
	var url: String = "%s?parameters=%s&community=%s&longitude=%.2f&latitude=%.2f&start=%s&end=%s&format=JSON" % [
		BASE_URL,
		PARAMETERS,
		COMMUNITY,
		loc["lon"],
		loc["lat"],
		DEFAULT_START_DATE,
		DEFAULT_END_DATE
	]
	
	active_request_country = country_name
	active_request_url = url
	is_request_in_progress = true
	
	print("[NasaDataService] --------------------------------------------------")
	print("[NasaDataService] Dispatching NASA POWER API Request:")
	print("[NasaDataService] Country: %s (%s)" % [country_name, loc["region_name"]])
	print("[NasaDataService] Coordinates: Lat %.2f, Lon %.2f" % [loc["lat"], loc["lon"]])
	print("[NasaDataService] Community: %s | Parameters: %s" % [COMMUNITY, PARAMETERS])
	print("[NasaDataService] Date Range: %s to %s" % [DEFAULT_START_DATE, DEFAULT_END_DATE])
	print("[NasaDataService] URL: %s" % url)
	print("[NasaDataService] --------------------------------------------------")
	
	var headers: PackedStringArray = PackedStringArray([
		"User-Agent: VaporPath-AgriPlanner/1.0 (Godot 4.x)"
	])
	
	var err: Error = http_request.request(url, headers, HTTPClient.METHOD_GET)
	if err != OK:
		is_request_in_progress = false
		push_error("[NasaDataService] Failed to initiate HTTP request to NASA POWER. Error code: %d" % err)
		data_failed.emit(country_name, "HTTP request initiation failed")


func _on_request_completed(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	var country: String = active_request_country
	var url: String = active_request_url
	is_request_in_progress = false
	active_request_country = ""
	active_request_url = ""
	
	print("[NasaDataService] HTTP Response received:")
	print("[NasaDataService]   Target Country  : %s" % country)
	print("[NasaDataService]   Result Code     : %d (0=SUCCESS)" % result)
	print("[NasaDataService]   HTTP Status     : %d" % response_code)
	print("[NasaDataService]   data_loaded listeners: %d" % data_loaded.get_connections().size())
	
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		var err_msg: String = "HTTP error (Result: %d, HTTP Code: %d)" % [result, response_code]
		push_warning("[NasaDataService] %s. Preserving fallback values." % err_msg)
		data_failed.emit(country, err_msg)
		return
	
	var response_text: String = body.get_string_from_utf8()
	var json: JSON = JSON.new()
	var parse_err: Error = json.parse(response_text)
	if parse_err != OK:
		var err_msg: String = "JSON parse failed: %s at line %d" % [json.get_error_message(), json.get_error_line()]
		push_warning("[NasaDataService] %s" % err_msg)
		data_failed.emit(country, err_msg)
		return
	
	var json_data: Variant = json.data
	if typeof(json_data) != TYPE_DICTIONARY:
		data_failed.emit(country, "Response root is not a dictionary")
		return
	
	var root_dict: Dictionary = json_data as Dictionary
	if not root_dict.has("properties") or not (root_dict["properties"] is Dictionary):
		data_failed.emit(country, "Missing 'properties' in NASA POWER response")
		return
	
	var properties: Dictionary = root_dict["properties"] as Dictionary
	if not properties.has("parameter") or not (properties["parameter"] is Dictionary):
		data_failed.emit(country, "Missing 'parameter' block in NASA POWER response")
		return
	
	var param_dict: Dictionary = properties["parameter"] as Dictionary
	_process_nasa_parameters(country, param_dict)


func _process_nasa_parameters(country: String, param_dict: Dictionary) -> void:
	var loc: Dictionary = AG_LOCATIONS.get(country, AG_LOCATIONS["Brazil"])
	
	# 1. Parse Root-Zone Soil Wetness (GWETROOT)
	# Valid values are dimensionless fractions [0.0, 1.0]. Reject -999 and negative values.
	var valid_soil_samples: Array[float] = []
	if param_dict.has("GWETROOT") and param_dict["GWETROOT"] is Dictionary:
		var gwet_dict: Dictionary = param_dict["GWETROOT"] as Dictionary
		for date_key: String in gwet_dict:
			var val: float = float(gwet_dict[date_key])
			if val >= 0.0 and val <= 1.0 and val != -999.0:
				valid_soil_samples.append(val)
	
	# 2. Parse Corrected Precipitation (PRECTOTCORR)
	# Values in mm/day. Reject -999 and negative values.
	var valid_precip_samples: Array[float] = []
	if param_dict.has("PRECTOTCORR") and param_dict["PRECTOTCORR"] is Dictionary:
		var precip_dict: Dictionary = param_dict["PRECTOTCORR"] as Dictionary
		for date_key: String in precip_dict:
			var val: float = float(precip_dict[date_key])
			if val >= 0.0 and val != -999.0:
				valid_precip_samples.append(val)
	
	print("[NasaDataService] Processed samples:")
	print("[NasaDataService]   Valid GWETROOT samples   : %d" % valid_soil_samples.size())
	print("[NasaDataService]   Valid PRECTOTCORR samples: %d" % valid_precip_samples.size())
	
	# If no valid data points found (e.g. fill values returned), preserve fallback
	if valid_soil_samples.is_empty() and valid_precip_samples.is_empty():
		push_warning("[NasaDataService] No valid non-fill measurements returned by NASA POWER. Using fallback.")
		data_failed.emit(country, "No valid measurements in response")
		return
	
	# Calculate Mean Soil Moisture Percentage
	var soil_moisture_str: String = "38%" # default fallback if soil samples empty
	var raw_soil_mean: float = 0.38
	if not valid_soil_samples.is_empty():
		var soil_sum: float = 0.0
		for s: float in valid_soil_samples:
			soil_sum += s
		raw_soil_mean = soil_sum / float(valid_soil_samples.size())
		var soil_pct: int = int(round(raw_soil_mean * 100.0))
		soil_moisture_str = "%d%%" % soil_pct
	
	# Calculate Rainfall Anomaly against historical agroclimatic baseline
	var rainfall_anomaly_str: String = "-14%" # default fallback if precip samples empty
	var raw_precip_mean: float = 0.0
	if not valid_precip_samples.is_empty():
		var precip_sum: float = 0.0
		for p: float in valid_precip_samples:
			precip_sum += p
		raw_precip_mean = precip_sum / float(valid_precip_samples.size())
		var baseline_precip: float = float(loc.get("baseline_precip_mm", 7.0))
		
		# Anomaly (%) = ((Observed - Baseline) / Baseline) * 100
		var anomaly_pct: float = ((raw_precip_mean - baseline_precip) / baseline_precip) * 100.0
		var rounded_anomaly: int = int(round(anomaly_pct))
		if rounded_anomaly >= 0:
			rainfall_anomaly_str = "+%d%%" % rounded_anomaly
		else:
			rainfall_anomaly_str = "%d%%" % rounded_anomaly
	
	# Store parsed and verified metrics in cache
	var result_data: Dictionary = {
		"country": country,
		"region_name": loc["region_name"],
		"coordinates": Vector2(loc["lon"], loc["lat"]),
		"soil_moisture": soil_moisture_str,
		"soil_moisture_raw": raw_soil_mean,
		"rainfall_anomaly": rainfall_anomaly_str,
		"mean_precip_mm_day": raw_precip_mean,
		"baseline_precip_mm_day": loc.get("baseline_precip_mm", 7.0),
		"date_range": "%s to %s" % [DEFAULT_START_DATE, DEFAULT_END_DATE],
		"is_live": true,
		"source": "NASA POWER (MERRA-2)"
	}
	
	cached_live_data[country] = result_data
	
	print("[NasaDataService] ==================================================")
	print("[NasaDataService] Live NASA POWER Data Successfully Extracted:")
	print("[NasaDataService]   Country           : %s" % country)
	print("[NasaDataService]   Location          : %s" % loc["region_name"])
	print("[NasaDataService]   Date Window       : %s" % result_data["date_range"])
	print("[NasaDataService]   Soil Moisture     : %s (Raw fraction: %.3f)" % [soil_moisture_str, raw_soil_mean])
	print("[NasaDataService]   Rainfall Anomaly  : %s (Obs: %.2f mm/day, Baseline: %.2f mm/day)" % [
		rainfall_anomaly_str,
		raw_precip_mean,
		loc.get("baseline_precip_mm", 7.0)
	])
	print("[NasaDataService]   Vegetation Stress : Kept as Model Fallback (EVPTRNS not equated to stress)")
	print("[NasaDataService] ==================================================")
	
	data_loaded.emit(country, result_data)


## Check if live data is cached and available for a country
func has_live_data(country_name: String) -> bool:
	return cached_live_data.has(country_name)


## Retrieve cached live data for a country (or empty Dictionary if not ready)
func get_live_data(country_name: String) -> Dictionary:
	return cached_live_data.get(country_name, {})

