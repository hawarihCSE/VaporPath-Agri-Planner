extends Control

const SCREEN_2_PATH: String = "res://scenes/screen_2.tscn"

@onready var start_button: Button = get_node_or_null("StartButton")

func _ready() -> void:
	print("Screen 1 loaded")

	if start_button != null:
		if not start_button.pressed.is_connected(_on_start_button_pressed):
			start_button.pressed.connect(_on_start_button_pressed)
		print("StartButton connected successfully!")
	else:
		push_error("ERROR: StartButton node not found on Screen 1!")

func _on_start_button_pressed() -> void:
	print("Starting farm simulation -> Navigating to Screen 2...")
	var err = get_tree().change_scene_to_file(SCREEN_2_PATH)
	if err != OK:
		push_error("Failed to change scene to '%s'. Error code: %d" % [SCREEN_2_PATH, err])
