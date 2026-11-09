extends Control

# Navigation scene paths
const SCREEN_4_PATH: String = "res://scenes/screen_4.tscn"
const SCREEN_6_PATH: String = "res://scenes/screen_6.tscn"

# Button style resources
const STYLE_BTN_NORMAL: StyleBox = preload("res://assests/ui/button_normal.tres")
const STYLE_BTN_HOVER: StyleBox = preload("res://button_normal1.tres")
const STYLE_BTN_PRESSED: StyleBox = preload("res://button_normal2.tres")

# Currently selected crop ID: "sorghum" | "millet" | "cowpea" | "soybean"
var selected_crop_id: String = "sorghum"

# Active farm country passed from previous screens
var selected_country: String = "Brazil"

# Simplified 4-crop options with clear stats and cheerful vegetable basket recommendations
const CROPS: Dictionary = {
	"sorghum": {
		"id": "sorghum",
		"name": "Sorghum",
		"full_name": "Grain Sorghum",
		"water": "💧 -45% Water",
		"water_saving": "-45%",
		"resilience": "🛡️ 92% Resilience",
		"resilience_score": 92,
		"tag": "RECOMMENDED",
		"advice": "Grain Sorghum is a great choice! Its deep roots tap into underground moisture, saving 45% water while keeping your harvest strong."
	},
	"millet": {
		"id": "millet",
		"name": "Millet",
		"full_name": "Pearl Millet",
		"water": "💧 -60% Water",
		"water_saving": "-60%",
		"resilience": "🛡️ 95% Resilience",
		"resilience_score": 95,
		"tag": "TOP WATER SAVER",
		"advice": "Pearl Millet is our top water saver! It cuts water use by 60% and easily withstands severe heat and dry conditions."
	},
	"cowpea": {
		"id": "cowpea",
		"name": "Cowpea",
		"full_name": "Cowpea",
		"water": "💧 -50% Water",
		"water_saving": "-50%",
		"resilience": "🛡️ 88% Resilience",
		"resilience_score": 88,
		"tag": "SOIL BOOSTER",
		"advice": "Cowpea is fantastic! It reduces water use by 50% and naturally enriches your soil, protecting your land for the next harvest."
	},
	"soybean": {
		"id": "soybean",
		"name": "Soybean",
		"full_name": "Soybean",
		"water": "💧 High Water",
		"water_saving": "0%",
		"resilience": "⚠️ 32% Resilience",
		"resilience_score": 32,
		"tag": "HIGH RISK",
		"advice": "Warning: Soybeans require regular, heavy watering. Planting soybeans during a drought year carries a high risk of crop stress."
	}
}

# Node references
@onready var warning_label: Label = get_node_or_null("DroughtWarning/WarningLabel")
@onready var rec_title: Label = get_node_or_null("RecommendationBox/RecTitle")
@onready var rec_text: Label = get_node_or_null("RecommendationBox/RecText")
@onready var back_button: Button = get_node_or_null("BackButton")
@onready var apply_button: Button = get_node_or_null("ApplyButton")

# Crop card button references
@onready var cards: Dictionary = {
	"sorghum": get_node_or_null("CardsContainer/SorghumCard"),
	"millet": get_node_or_null("CardsContainer/MilletCard"),
	"cowpea": get_node_or_null("CardsContainer/CowpeaCard"),
	"soybean": get_node_or_null("CardsContainer/SoybeanCard")
}

# Crop card status pill label references
@onready var pills: Dictionary = {
	"sorghum": get_node_or_null("CardsContainer/SorghumCard/VBox/StatusPill"),
	"millet": get_node_or_null("CardsContainer/MilletCard/VBox/StatusPill"),
	"cowpea": get_node_or_null("CardsContainer/CowpeaCard/VBox/StatusPill"),
	"soybean": get_node_or_null("CardsContainer/SoybeanCard/VBox/StatusPill")
}

# Card styles for selected and unselected states
var style_card_selected: StyleBoxFlat
var style_card_normal: StyleBoxFlat
var style_card_hover: StyleBoxFlat
var style_pill_selected: StyleBoxFlat
var style_pill_normal: StyleBoxFlat


func _ready() -> void:
	print("Screen 5 (Adaptive Crop Planner) loaded.")

	_init_styles()

	# Retrieve selected country from previous screens if available
	if get_tree().root.has_meta("selected_country"):
		var meta_val: Variant = get_tree().root.get_meta("selected_country")
		if meta_val is String and not (meta_val as String).is_empty():
			selected_country = meta_val as String
	
	if warning_label != null:
		warning_label.text = "⚠️ Drought Warning: Low rainfall forecast in %s. Choose crops that need less water." % selected_country

	# Configure crop cards
	for crop_id: String in cards:
		var btn: Button = cards[crop_id]
		if btn != null:
			btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
			if not btn.pressed.is_connected(_on_crop_button_pressed):
				btn.pressed.connect(_on_crop_button_pressed.bind(crop_id))

	# Configure BACK button
	if back_button != null:
		back_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not back_button.pressed.is_connected(_on_back_pressed):
			back_button.pressed.connect(_on_back_pressed)

	# Configure APPLY PLAN button
	if apply_button != null:
		apply_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not apply_button.pressed.is_connected(_on_apply_plan_pressed):
			apply_button.pressed.connect(_on_apply_plan_pressed)

	# Apply initial selection
	_select_crop(selected_crop_id)


func _init_styles() -> void:
	# Selected card style: soft mint background with bold teal border
	style_card_selected = StyleBoxFlat.new()
	style_card_selected.bg_color = Color(0.88, 0.97, 0.94, 1.0)
	style_card_selected.border_width_left = 3
	style_card_selected.border_width_top = 3
	style_card_selected.border_width_right = 3
	style_card_selected.border_width_bottom = 3
	style_card_selected.border_color = Color(0.12, 0.62, 0.52, 1.0)
	style_card_selected.corner_radius_top_left = 16
	style_card_selected.corner_radius_top_right = 16
	style_card_selected.corner_radius_bottom_right = 16
	style_card_selected.corner_radius_bottom_left = 16

	# Normal card style: clean white with subtle mint border
	style_card_normal = StyleBoxFlat.new()
	style_card_normal.bg_color = Color(1.0, 1.0, 1.0, 0.95)
	style_card_normal.border_width_left = 2
	style_card_normal.border_width_top = 2
	style_card_normal.border_width_right = 2
	style_card_normal.border_width_bottom = 2
	style_card_normal.border_color = Color(0.384, 0.851, 0.769, 0.6)
	style_card_normal.corner_radius_top_left = 16
	style_card_normal.corner_radius_top_right = 16
	style_card_normal.corner_radius_bottom_right = 16
	style_card_normal.corner_radius_bottom_left = 16

	# Hover card style
	style_card_hover = StyleBoxFlat.new()
	style_card_hover.bg_color = Color(0.94, 0.99, 0.97, 1.0)
	style_card_hover.border_width_left = 2
	style_card_hover.border_width_top = 2
	style_card_hover.border_width_right = 2
	style_card_hover.border_width_bottom = 2
	style_card_hover.border_color = Color(0.16, 0.62, 0.53, 0.9)
	style_card_hover.corner_radius_top_left = 16
	style_card_hover.corner_radius_top_right = 16
	style_card_hover.corner_radius_bottom_right = 16
	style_card_hover.corner_radius_bottom_left = 16

	# Selected pill style: teal pill
	style_pill_selected = StyleBoxFlat.new()
	style_pill_selected.content_margin_top = 4.0
	style_pill_selected.content_margin_bottom = 4.0
	style_pill_selected.bg_color = Color(0.12, 0.62, 0.52, 1.0)
	style_pill_selected.corner_radius_top_left = 10
	style_pill_selected.corner_radius_top_right = 10
	style_pill_selected.corner_radius_bottom_right = 10
	style_pill_selected.corner_radius_bottom_left = 10

	# Normal pill style: muted gray-mint pill
	style_pill_normal = StyleBoxFlat.new()
	style_pill_normal.content_margin_top = 4.0
	style_pill_normal.content_margin_bottom = 4.0
	style_pill_normal.bg_color = Color(0.90, 0.94, 0.93, 1.0)
	style_pill_normal.corner_radius_top_left = 10
	style_pill_normal.corner_radius_top_right = 10
	style_pill_normal.corner_radius_bottom_right = 10
	style_pill_normal.corner_radius_bottom_left = 10


func _on_crop_button_pressed(crop_id: String) -> void:
	_select_crop(crop_id)


func _select_crop(crop_id: String) -> void:
	if not CROPS.has(crop_id):
		return

	selected_crop_id = crop_id
	var crop_data: Dictionary = CROPS[crop_id]
	print("Screen 5: Selected crop -> %s" % crop_data["name"])

	# Update visual highlight on each card
	for id: String in cards:
		var btn: Button = cards[id]
		var pill: Label = pills[id]
		var is_selected: bool = (id == selected_crop_id)

		if btn != null:
			if is_selected:
				btn.add_theme_stylebox_override("normal", style_card_selected)
				btn.add_theme_stylebox_override("hover", style_card_selected)
			else:
				btn.add_theme_stylebox_override("normal", style_card_normal)
				btn.add_theme_stylebox_override("hover", style_card_hover)

		if pill != null:
			if is_selected:
				pill.text = "✓ SELECTED"
				pill.add_theme_stylebox_override("normal", style_pill_selected)
				pill.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0))
			else:
				pill.text = "SELECT"
				pill.add_theme_stylebox_override("normal", style_pill_normal)
				pill.add_theme_color_override("font_color", Color(0.3, 0.45, 0.42, 1.0))

	# Update recommendation text dynamically
	if rec_text != null:
		rec_text.text = crop_data["advice"]

	# Reset apply button label in case it previously showed "PLAN SAVED"
	if apply_button != null:
		apply_button.text = "APPLY PLAN ➔"


func _on_back_pressed() -> void:
	print("Screen 5: Back button pressed -> Returning to Screen 4 (%s)..." % SCREEN_4_PATH)
	var err: Error = get_tree().change_scene_to_file(SCREEN_4_PATH)
	if err != OK:
		push_error("Failed to load Screen 4 at '%s'. Error code: %d" % [SCREEN_4_PATH, err])


func _on_apply_plan_pressed() -> void:
	if not CROPS.has(selected_crop_id):
		return

	var crop_data: Dictionary = CROPS[selected_crop_id]

	# Save selected crop metadata to root for use in upcoming screens
	get_tree().root.set_meta("selected_crop", selected_crop_id)
	get_tree().root.set_meta("selected_crop_name", crop_data["name"])
	get_tree().root.set_meta("crop_water_saving", crop_data["water_saving"])
	get_tree().root.set_meta("crop_resilience", crop_data["resilience_score"])

	print("Screen 5: Applied crop plan -> Crop: %s, Water Saving: %s, Resilience: %d%%" % [
		crop_data["name"],
		crop_data["water_saving"],
		crop_data["resilience_score"]
	])

	# Navigate directly to Screen 6
	print("Screen 5: Navigating to Screen 6 (%s)..." % SCREEN_6_PATH)
	var err: Error = get_tree().change_scene_to_file(SCREEN_6_PATH)
	if err != OK:
		push_error("Failed to load Screen 6 at '%s'. Error code: %d" % [SCREEN_6_PATH, err])
