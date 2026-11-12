extends Control

# Preloaded existing button styles
const STYLE_NORMAL: StyleBox = preload("res://assests/ui/button_normal.tres")
const STYLE_HIGHLIGHT: StyleBox = preload("res://button_normal1.tres")
const STYLE_PRESSED: StyleBox = preload("res://button_normal2.tres")

# Stored country selection
var selected_country: String = ""

# Safe node references
@onready var brazil_button: Button = get_node_or_null("BrazilButton")
@onready var argentina_button: Button = get_node_or_null("ArgentinaButton")
@onready var bolivia_button: Button = get_node_or_null("BoliviaButton")
@onready var paraguay_button: Button = get_node_or_null("ParaguayButton")
@onready var continue_button: Button = get_node_or_null("ContinueButton")
@onready var dialogue_text: Label = get_node_or_null("DialogueBox/DialogueText")

var country_buttons: Dictionary = {}

func _ready() -> void:
	print("Screen 2 loaded")

	country_buttons = {
		"Brazil": brazil_button,
		"Argentina": argentina_button,
		"Bolivia": bolivia_button,
		"Paraguay": paraguay_button
	}

	# Setup country buttons
	for country_name in country_buttons:
		var btn: Button = country_buttons[country_name]
		if btn != null:
			# Apply consistent hover and pressed styles from existing assets
			btn.add_theme_stylebox_override("hover", STYLE_HIGHLIGHT)
			btn.add_theme_stylebox_override("pressed", STYLE_PRESSED)
			btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND

			# Connect pressed signal with country argument
			if not btn.pressed.is_connected(_on_country_button_pressed):
				btn.pressed.connect(_on_country_button_pressed.bind(country_name))
		else:
			push_warning("Screen 2: %sButton not found!" % country_name)

	# Setup ContinueButton: disabled initially until a country is selected
	if continue_button != null:
		continue_button.disabled = true
		continue_button.modulate = Color(1.0, 1.0, 1.0, 0.5)
		continue_button.mouse_default_cursor_shape = Control.CURSOR_ARROW
		if not continue_button.pressed.is_connected(_on_continue_button_pressed):
			continue_button.pressed.connect(_on_continue_button_pressed)
	else:
		push_error("ERROR: ContinueButton not found on Screen 2!")

	_update_button_selection()


func _on_country_button_pressed(country_name: String) -> void:
	selected_country = country_name
	print("Selected farm country: %s" % selected_country)

	_update_button_selection()

	# Enable ContinueButton
	if continue_button != null:
		continue_button.disabled = false
		continue_button.modulate = Color(1.0, 1.0, 1.0, 1.0)
		continue_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND

	# Update dialogue text for user feedback
	if dialogue_text != null:
		dialogue_text.text = "You selected %s! Click Continue when ready." % selected_country


func _update_button_selection() -> void:
	for country_name in country_buttons:
		var btn: Button = country_buttons[country_name]
		if btn == null:
			continue

		if country_name == selected_country:
			# Highlight the selected button using existing STYLE_HIGHLIGHT
			btn.add_theme_stylebox_override("normal", STYLE_HIGHLIGHT)
		else:
			# Reset unselected buttons to standard STYLE_NORMAL
			btn.add_theme_stylebox_override("normal", STYLE_NORMAL)


const SCREEN_3_PATH: String = "res://scenes/screen_3.tscn"

func _on_continue_button_pressed() -> void:
	if selected_country.is_empty():
		print("Cannot continue: No country selected yet.")
		return

	print("Continue pressed! Selected Country: %s -> Navigating to Screen 3..." % selected_country)
	get_tree().root.set_meta("selected_country", selected_country)
	var err = get_tree().change_scene_to_file(SCREEN_3_PATH)
	if err != OK:
		push_error("Failed to load scene at '%s'. Error code: %d" % [SCREEN_3_PATH, err])
