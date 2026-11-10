extends Control

const SCREEN_4_PATH: String = "res://scenes/screen_4.tscn"

# Fallback default if not passed from Screen 2
var selected_country: String = "Brazil"

@onready var continue_button: Button = get_node_or_null("ContinueButton")
@onready var scan_title: Label = get_node_or_null("InfoBox/ScanTitle")
@onready var item1_label: Label = get_node_or_null("InfoBox/Item1")
@onready var item2_label: Label = get_node_or_null("InfoBox/Item2")
@onready var item3_label: Label = get_node_or_null("InfoBox/Item3")
@onready var disclaimer_label: Label = get_node_or_null("InfoBox/Disclaimer")

# Illustrative offline fallback values per country.
# Used when the NASA POWER API is unavailable, timed out, or returns invalid data.
const COUNTRY_DATA: Dictionary = {
	"Brazil": {
		"soil_moisture": "38%",
		"rainfall_anomaly": "-14%",
		"vegetation_stress": "62%"
	},
	"Argentina": {
		"soil_moisture": "34%",
		"rainfall_anomaly": "-18%",
		"vegetation_stress": "68%"
	},
	"Bolivia": {
		"soil_moisture": "31%",
		"rainfall_anomaly": "-19%",
		"vegetation_stress": "71%"
	},
	"Paraguay": {
		"soil_moisture": "36%",
		"rainfall_anomaly": "-15%",
		"vegetation_stress": "65%"
	}
}

var _live_data_applied: bool = false

func _ready() -> void:
	# DIAGNOSTIC A: Entry point
	print("[Screen3-DIAG-A] _ready() START | Reading selected country from root metadata.")
	if get_tree().root.has_meta("selected_country"):
		var meta_val: Variant = get_tree().root.get_meta("selected_country")
		if meta_val is String and not (meta_val as String).is_empty():
			selected_country = meta_val as String
	print(selected_country)

	# DIAGNOSTIC B: Node resolution
	print("[Screen3-DIAG-B] Node resolution:")
	print("  item1_label  = %s" % ("OK" if item1_label != null else "NULL — path InfoBox/Item1 not found!"))
	print("  item2_label  = %s" % ("OK" if item2_label != null else "NULL — path InfoBox/Item2 not found!"))
	print("  item3_label  = %s" % ("OK" if item3_label != null else "NULL — path InfoBox/Item3 not found!"))
	print("  disclaimer   = %s" % ("OK" if disclaimer_label != null else "NULL — path InfoBox/Disclaimer not found!"))

	if scan_title != null:
		scan_title.text = "FARM SCAN: %s" % selected_country.to_upper()

	_apply_fallback_data()

	if continue_button != null:
		continue_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not continue_button.pressed.is_connected(_on_continue_button_pressed):
			continue_button.pressed.connect(_on_continue_button_pressed)
	else:
		push_error("[Screen3] ERROR: ContinueButton not found!")

	_request_live_data()

	# DIAGNOSTIC C: State after _ready completes
	print("[Screen3-DIAG-C] _ready() END | _live_data_applied = %s" % str(_live_data_applied))


func _apply_fallback_data() -> void:
	var data: Dictionary = COUNTRY_DATA.get(selected_country, COUNTRY_DATA["Brazil"])
	if item1_label != null:
		item1_label.text = "• Soil Moisture: %s (est.)" % data["soil_moisture"]
	if item2_label != null:
		item2_label.text = "• Rainfall Anomaly: %s (est.)" % data["rainfall_anomaly"]
	if item3_label != null:
		item3_label.text = "• Vegetation Stress: %s (est.)" % data["vegetation_stress"]
	if disclaimer_label != null:
		disclaimer_label.text = "* Illustrative reference values"
	print("[Screen3] Fallback applied (Soil: %s | Rain: %s)" % [data["soil_moisture"], data["rainfall_anomaly"]])


func _apply_live_data(live: Dictionary) -> void:
	# DIAGNOSTIC D: Live data dict contents before writing to labels
	print("[Screen3-DIAG-D] _apply_live_data() called. Dict keys: %s" % str(live.keys()))
	print("[Screen3-DIAG-D]   soil_moisture   = \"%s\"" % str(live.get("soil_moisture", "KEY_MISSING")))
	print("[Screen3-DIAG-D]   rainfall_anomaly= \"%s\"" % str(live.get("rainfall_anomaly", "KEY_MISSING")))
	print("[Screen3-DIAG-D]   item1_label null? %s" % str(item1_label == null))
	print("[Screen3-DIAG-D]   item2_label null? %s" % str(item2_label == null))

	if item1_label != null:
		item1_label.text = "• Root-Zone Soil Moisture: %s (NASA POWER)" % live.get("soil_moisture", "N/A")
		print("[Screen3-DIAG-D]   item1 SET to: %s" % item1_label.text)
	else:
		print("[Screen3-DIAG-D]   item1_label is NULL — label NOT updated!")

	if item2_label != null:
		item2_label.text = "• Rainfall Anomaly: %s (NASA POWER)" % live.get("rainfall_anomaly", "N/A")
		print("[Screen3-DIAG-D]   item2 SET to: %s" % item2_label.text)
	else:
		print("[Screen3-DIAG-D]   item2_label is NULL — label NOT updated!")

	var fallback: Dictionary = COUNTRY_DATA.get(selected_country, COUNTRY_DATA["Brazil"])
	if item3_label != null:
		item3_label.text = "• Vegetation Stress: %s (illustrative)" % fallback["vegetation_stress"]

	var region_name: String = live.get("region_name", "ag region")
	var date_range: String = live.get("date_range", "")
	if disclaimer_label != null:
		disclaimer_label.text = "* NASA POWER (MERRA-2) | %s | %s" % [region_name, date_range]

	print("[Screen3] ============================================================")
	print("[Screen3] LIVE NASA POWER DATA APPLIED")
	print("[Screen3]   Soil Moisture    : %s" % live.get("soil_moisture", "N/A"))
	print("[Screen3]   Rainfall Anomaly : %s" % live.get("rainfall_anomaly", "N/A"))
	print("[Screen3]   Source           : %s" % live.get("source", "NASA POWER"))
	print("[Screen3]   Region           : %s" % region_name)
	print("[Screen3]   Period           : %s" % date_range)
	print("[Screen3] ============================================================")


func _request_live_data() -> void:
	# DIAGNOSTIC E: Singleton availability
	# Autoloads are nodes under /root; Engine.has_singleton() is for native
	# engine singletons and does not detect project Autoloads.
	var svc: Variant = get_node_or_null("/root/NasaDataService")
	print("[Screen3-DIAG-E] NasaDataService Autoload found = %s" % str(svc != null))
	if svc == null:
		push_warning("[Screen3] NasaDataService Autoload not found at /root/NasaDataService. Fallback values remain.")
		return

	print("[Screen3-DIAG-E] NasaDataService instance ID: %s" % str(svc.get_instance_id()))

	# STEP 1: Connect signals FIRST — before any cache check or fetch call.
	# This ensures we receive the signal even if the in-flight request completes
	# during the deduplication check inside fetch_country_data().
	var was_already_connected: bool = svc.data_loaded.is_connected(_on_nasa_data_loaded)
	if not was_already_connected:
		svc.data_loaded.connect(_on_nasa_data_loaded)
	if not svc.data_failed.is_connected(_on_nasa_data_failed):
		svc.data_failed.connect(_on_nasa_data_failed)
	print("[Screen3-DIAG-E] data_loaded signal connected (was_already=%s)" % str(was_already_connected))

	# STEP 2: Check if data is already cached
	var is_cached: bool = svc.has_live_data(selected_country)
	var is_in_progress: bool = svc.is_request_in_progress
	print("[Screen3-DIAG-E] has_live_data(\"%s\") = %s" % [selected_country, str(is_cached)])
	print("[Screen3-DIAG-E] is_request_in_progress = %s" % str(is_in_progress))

	if is_cached:
		var cached: Dictionary = svc.get_live_data(selected_country)
		print("[Screen3-DIAG-E] Cache hit — keys: %s" % str(cached.keys()))
		if not _live_data_applied:
			_live_data_applied = true
			_apply_live_data(cached)
		else:
			print("[Screen3-DIAG-E] _live_data_applied already true — skipping re-apply.")
		return

	# STEP 3: Data not yet cached. fetch_country_data will start or deduplicate.
	print("[Screen3-DIAG-E] No cache — calling fetch_country_data(\"%s\")" % selected_country)
	svc.fetch_country_data(selected_country)
	print("[Screen3-DIAG-E] fetch_country_data() returned. Waiting for signal...")


func _on_nasa_data_loaded(country: String, live_data: Dictionary) -> void:
	# DIAGNOSTIC F: Signal received
	print("[Screen3-DIAG-F] data_loaded signal received | country='%s' | my_country='%s' | _live_data_applied=%s" % [
		country, selected_country, str(_live_data_applied)
	])
	if country != selected_country:
		print("[Screen3-DIAG-F] Country mismatch — ignoring signal.")
		return
	if _live_data_applied:
		print("[Screen3-DIAG-F] Already applied — ignoring duplicate signal.")
		return
	_live_data_applied = true
	print("[Screen3-DIAG-F] Calling _apply_live_data() now...")
	_apply_live_data(live_data)


func _on_nasa_data_failed(country: String, error_message: String) -> void:
	# DIAGNOSTIC G: Failure signal received
	print("[Screen3-DIAG-G] data_failed signal received | country='%s' | error='%s'" % [country, error_message])
	if country != selected_country:
		return
	push_warning("[Screen3] NASA POWER fetch failed: %s. Fallback remains." % error_message)
	if disclaimer_label != null:
		disclaimer_label.text = "* Offline mode — illustrative reference values"


func _on_continue_button_pressed() -> void:
	print("[Screen3] Continue pressed → Navigating to Screen 4...")
	if ResourceLoader.exists(SCREEN_4_PATH):
		var err: Error = get_tree().change_scene_to_file(SCREEN_4_PATH)
		if err != OK:
			push_error("[Screen3] Failed to load scene '%s'. Error code: %d" % [SCREEN_4_PATH, err])
	else:
		push_error("[Screen3] Screen 4 scene not found at: %s" % SCREEN_4_PATH)
