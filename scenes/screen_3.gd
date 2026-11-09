extends Control

const SCREEN_4_PATH: String = "res://scenes/screen_4.tscn"

# Fallback default if not passed from Screen 2
var selected_country: String = "Brazil"

@onready var continue_button: Button = get_node_or_null("ContinueButton")
@onready var scan_title: Label = get_node_or_null("InfoBox/ScanTitle")
@onready var item1_label: Label = get_node_or_null("InfoBox/Item1")
@onready var item2_label: Label = get_node_or_null("InfoBox/Item2")
@onready var item3_label: Label = get_node_or_null("InfoBox/Item3")

# Illustrative NASA data per country (Brazil uses the exact required values)
const COUNTRY_DATA = {
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

func _ready() -> void:
	# Read country passed from Screen 2 via root metadata
	if get_tree().root.has_meta("selected_country"):
		var meta_val = str(get_tree().root.get_meta("selected_country")).strip_edges()
		if not meta_val.is_empty():
			selected_country = meta_val

	print("Screen 3 (NASA Farm Scan) loaded. Active Country: %s" % selected_country)

	# Update scan title with the selected farm country
	if scan_title != null:
		scan_title.text = "FARM SCAN: %s" % selected_country.to_upper()

	# Update environmental metric items based on country
	var data = COUNTRY_DATA.get(selected_country, COUNTRY_DATA["Brazil"])
	if item1_label != null:
		item1_label.text = "• Soil Moisture: %s (SMAP)" % data["soil_moisture"]
	if item2_label != null:
		item2_label.text = "• Rainfall Anomaly: %s (GPM)" % data["rainfall_anomaly"]
	if item3_label != null:
		item3_label.text = "• Vegetation Stress: %s (ECOSTRESS)" % data["vegetation_stress"]

	# Setup ContinueButton
	if continue_button != null:
		continue_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not continue_button.pressed.is_connected(_on_continue_button_pressed):
			continue_button.pressed.connect(_on_continue_button_pressed)
	else:
		push_error("ERROR: ContinueButton not found on Screen 3!")


func _on_continue_button_pressed() -> void:
	print("Screen 3: Continue pressed -> Navigating to Screen 4 (%s)..." % SCREEN_4_PATH)
	if ResourceLoader.exists(SCREEN_4_PATH):
		var err = get_tree().change_scene_to_file(SCREEN_4_PATH)
		if err != OK:
			push_error("Failed to load scene at '%s'. Error code: %d" % [SCREEN_4_PATH, err])
	else:
		print("Screen 4 scene ('%s') does not exist yet. Ready for next task." % SCREEN_4_PATH)
