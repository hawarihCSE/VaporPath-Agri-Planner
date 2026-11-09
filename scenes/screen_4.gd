extends Control

const SCREEN_5_PATH: String = "res://scenes/screen_5.tscn"

# Fallback default if not passed from previous screen
var selected_country: String = "Brazil"

# Animation State Machine
enum State { STAGE_1, STAGE_2, STAGE_3, STAGE_4, FINISHED }
var current_state: State = State.STAGE_1
var is_playing: bool = true
var stage_timer: float = 0.0
const STAGE_DURATION: float = 2.8 # Seconds spent highlighting and animating each stage
var anim_pulse: float = 0.0

# Optional custom image overrides (if placed in assests/icons/)
var custom_textures: Dictionary = {}

# Node References
@onready var top_continue_button: Button = get_node_or_null("TopContinueButton")
@onready var dialogue_text: Label = get_node_or_null("DialogueBox/DialogueText")

# Stage Card Panels
@onready var stage1_card: Panel = get_node_or_null("StagesContainer/Stage1")
@onready var stage2_card: Panel = get_node_or_null("StagesContainer/Stage2")
@onready var stage3_card: Panel = get_node_or_null("StagesContainer/Stage3")
@onready var stage4_card: Panel = get_node_or_null("StagesContainer/Stage4")
@onready var stage4_title: Label = get_node_or_null("StagesContainer/Stage4/StageTitle")
@onready var path_visualizer: Control = get_node_or_null("PathVisualizer")

# Illustration Canvases
@onready var illust_stage1: Control = get_node_or_null("StagesContainer/Stage1/IllustrationBox/Illustration")
@onready var illust_stage2: Control = get_node_or_null("StagesContainer/Stage2/IllustrationBox/Illustration")
@onready var illust_stage3: Control = get_node_or_null("StagesContainer/Stage3/IllustrationBox/Illustration")
@onready var illust_stage4: Control = get_node_or_null("StagesContainer/Stage4/IllustrationBox/Illustration")

# Control Buttons
@onready var play_button: Button = get_node_or_null("ControlsRow/PlayButton")
@onready var pause_button: Button = get_node_or_null("ControlsRow/PauseButton")
@onready var replay_button: Button = get_node_or_null("ControlsRow/ReplayButton")

# Result Panel
@onready var result_panel: Panel = get_node_or_null("ResultPanel")
@onready var result_replay_btn: Button = get_node_or_null("ResultPanel/ResultButtons/ReplayBtn")
@onready var result_continue_btn: Button = get_node_or_null("ResultPanel/ResultButtons/ContinueBtn")

# Dynamic Styleboxes matching Screen 1, 2, 3
var style_idle: StyleBoxFlat
var style_active: StyleBoxFlat
var style_done: StyleBoxFlat

# Stage Dialogues
const DIALOGUE_MAP = {
	State.STAGE_1: "Stage 1: Upwind Amazon forests release massive volumes of water vapor into the atmosphere.",
	State.STAGE_2: "Stage 2: High-altitude 'Flying Rivers' transport this vapor across thousands of kilometers.",
	State.STAGE_3: "Stage 3: As moisture moves into agricultural zones, it cools to trigger seasonal rainfall.",
	State.STAGE_4: "Stage 4: But when vapor transport weakens, regional rainfall drops and soil moisture dries up!",
	State.FINISHED: "Journey complete! Altered atmospheric vapor flows leave your farm facing water-stress risks."
}

func _ready() -> void:
	# Read country passed from previous screens
	if get_tree().root.has_meta("selected_country"):
		var meta_val = str(get_tree().root.get_meta("selected_country")).strip_edges()
		if not meta_val.is_empty():
			selected_country = meta_val

	print("Screen 4 (Moisture Journey) loaded. Active Country: %s" % selected_country)

	if stage4_title != null:
		stage4_title.text = "Your Farm (%s)" % selected_country

	_init_styles()
	_setup_signals()
	_load_optional_textures()

	# Hide result panel initially
	if result_panel != null:
		result_panel.visible = false
		result_panel.modulate.a = 0.0

	# Hide top continue until complete
	if top_continue_button != null:
		top_continue_button.visible = false

	# Connect drawing routines
	if path_visualizer != null:
		path_visualizer.draw.connect(_on_path_visualizer_draw)
	if illust_stage1 != null:
		illust_stage1.draw.connect(_draw_amazon)
	if illust_stage2 != null:
		illust_stage2.draw.connect(_draw_flying_rivers)
	if illust_stage3 != null:
		illust_stage3.draw.connect(_draw_rainfall)
	if illust_stage4 != null:
		illust_stage4.draw.connect(_draw_farm)

	_apply_stage(State.STAGE_1)


func _init_styles() -> void:
	# Idle stage style: clean white rounded card with subtle teal border
	style_idle = StyleBoxFlat.new()
	style_idle.bg_color = Color(1.0, 1.0, 1.0, 0.94)
	style_idle.border_color = Color(0.384, 0.851, 0.769, 0.5)
	style_idle.set_border_width_all(2)
	style_idle.set_corner_radius_all(16)

	# Active stage style: pale mint background with rich teal border
	style_active = StyleBoxFlat.new()
	style_active.bg_color = Color(0.866, 0.957, 0.925, 1.0)
	style_active.border_color = Color(0.161, 0.616, 0.529, 1.0)
	style_active.set_border_width_all(3)
	style_active.set_corner_radius_all(16)

	# Done stage style: confirmed soft white card
	style_done = StyleBoxFlat.new()
	style_done.bg_color = Color(1.0, 1.0, 1.0, 0.98)
	style_done.border_color = Color(0.243, 0.647, 0.584, 0.85)
	style_done.set_border_width_all(2)
	style_done.set_corner_radius_all(16)


const ICONS_DIR: String = "res://assests/icons"

func _load_optional_textures() -> void:
	# Optional user-provided custom PNG illustrations can be placed in assests/icons/
	var stage_files = {
		1: "stage_1_amazon.png",
		2: "stage_2_flying_river.png",
		3: "stage_3_rainfall.png",
		4: "stage_4_farm.png"
	}
	for stage_num in stage_files:
		var p = ICONS_DIR + "/" + stage_files[stage_num]
		if FileAccess.file_exists(p):
			custom_textures[stage_num] = load(p)
			print("Screen 4: Loaded custom PNG for Stage %d from %s" % [stage_num, p])


func _setup_signals() -> void:
	if play_button != null:
		play_button.pressed.connect(_on_play_pressed)
	if pause_button != null:
		pause_button.pressed.connect(_on_pause_pressed)
	if replay_button != null:
		replay_button.pressed.connect(_on_replay_pressed)

	if result_replay_btn != null:
		result_replay_btn.pressed.connect(_on_replay_pressed)
	if result_continue_btn != null:
		result_continue_btn.pressed.connect(_on_continue_button_pressed)
	if top_continue_button != null:
		top_continue_button.pressed.connect(_on_continue_button_pressed)


func _process(delta: float) -> void:
	anim_pulse += delta * 4.0

	if is_playing and current_state != State.FINISHED:
		stage_timer += delta
		if stage_timer >= STAGE_DURATION:
			stage_timer = 0.0
			_advance_stage()

	# Queue redraw for animations
	if path_visualizer != null:
		path_visualizer.queue_redraw()
	if illust_stage1 != null:
		illust_stage1.queue_redraw()
	if illust_stage2 != null:
		illust_stage2.queue_redraw()
	if illust_stage3 != null:
		illust_stage3.queue_redraw()
	if illust_stage4 != null:
		illust_stage4.queue_redraw()


func _advance_stage() -> void:
	match current_state:
		State.STAGE_1:
			_apply_stage(State.STAGE_2)
		State.STAGE_2:
			_apply_stage(State.STAGE_3)
		State.STAGE_3:
			_apply_stage(State.STAGE_4)
		State.STAGE_4:
			_apply_stage(State.FINISHED)
			_show_results()


func _apply_stage(new_state: State) -> void:
	current_state = new_state
	print("Moisture Journey: Active state -> ", State.keys()[current_state])

	# Update dialogue text
	if dialogue_text != null and DIALOGUE_MAP.has(current_state):
		dialogue_text.text = DIALOGUE_MAP[current_state]

	# Update stage cards styling
	var stages = [stage1_card, stage2_card, stage3_card, stage4_card]
	for i in range(stages.size()):
		var card = stages[i]
		if card == null:
			continue

		if current_state == State.FINISHED:
			card.add_theme_stylebox_override("panel", style_done)
		elif i == int(current_state):
			card.add_theme_stylebox_override("panel", style_active)
		elif i < int(current_state):
			card.add_theme_stylebox_override("panel", style_done)
		else:
			card.add_theme_stylebox_override("panel", style_idle)

	_update_control_buttons()


func _update_control_buttons() -> void:
	if play_button != null:
		play_button.modulate = Color(1, 1, 1, 0.5) if (is_playing and current_state != State.FINISHED) else Color(1, 1, 1, 1)
	if pause_button != null:
		pause_button.modulate = Color(1, 1, 1, 1) if is_playing else Color(1, 1, 1, 0.5)


func _show_results() -> void:
	is_playing = false
	_update_control_buttons()

	if result_panel != null:
		result_panel.visible = true
		var tw = create_tween()
		tw.tween_property(result_panel, "modulate:a", 1.0, 0.35)

	if top_continue_button != null:
		top_continue_button.visible = true


func _on_play_pressed() -> void:
	if current_state == State.FINISHED:
		_on_replay_pressed()
		return

	is_playing = true
	_update_control_buttons()
	print("Moisture Journey: Resumed playing")


func _on_pause_pressed() -> void:
	is_playing = false
	_update_control_buttons()
	print("Moisture Journey: Paused")


func _on_replay_pressed() -> void:
	print("Moisture Journey: Replaying from Stage 1")
	stage_timer = 0.0
	is_playing = true

	if result_panel != null:
		result_panel.visible = false
		result_panel.modulate.a = 0.0

	if top_continue_button != null:
		top_continue_button.visible = false

	_apply_stage(State.STAGE_1)


# ==============================================================================
# 2D CARTOON STAGE ILLUSTRATION DRAWING ROUTINES (90x90 px boxes)
# ==============================================================================

# STAGE 1: Amazon Rainforest (Trees, Canopy & Rising Evapotranspiration Vapor)
func _draw_amazon() -> void:
	if illust_stage1 == null:
		return
	if custom_textures.has(1):
		illust_stage1.draw_texture_rect(custom_textures[1], Rect2(0, 0, 90, 90), false)
		return

	# Soft misty forest backdrop
	illust_stage1.draw_rect(Rect2(0, 0, 90, 90), Color(0.89, 0.96, 0.91))

	# Jungle understory base
	illust_stage1.draw_rect(Rect2(0, 68, 90, 22), Color(0.22, 0.55, 0.28))

	# Tree Trunks
	illust_stage1.draw_rect(Rect2(25, 46, 8, 26), Color(0.46, 0.30, 0.18))
	illust_stage1.draw_rect(Rect2(55, 40, 9, 32), Color(0.40, 0.26, 0.16))

	# Deep Background Canopies
	illust_stage1.draw_circle(Vector2(29, 44), 18.0, Color(0.14, 0.48, 0.24))
	illust_stage1.draw_circle(Vector2(60, 38), 22.0, Color(0.12, 0.44, 0.20))

	# Vibrant Midground Canopies
	illust_stage1.draw_circle(Vector2(22, 38), 14.0, Color(0.26, 0.68, 0.34))
	illust_stage1.draw_circle(Vector2(40, 32), 16.0, Color(0.32, 0.76, 0.38))
	illust_stage1.draw_circle(Vector2(68, 34), 16.0, Color(0.28, 0.72, 0.35))

	# Sunny Foliage Highlights
	illust_stage1.draw_circle(Vector2(37, 28), 7.0, Color(0.52, 0.86, 0.44))
	illust_stage1.draw_circle(Vector2(64, 30), 8.0, Color(0.48, 0.82, 0.42))

	# Animated Rising Vapor Wisps (Evapotranspiration)
	var vapor_col = Color(0.35, 0.85, 0.75, 0.75)
	for i in range(3):
		var base_x = 26.0 + float(i) * 20.0
		var float_y = 20.0 - fmod(anim_pulse * 5.0 + float(i) * 7.0, 18.0)
		var sway = sin(anim_pulse + float(i) * 2.0) * 3.0
		illust_stage1.draw_circle(Vector2(base_x + sway, float_y), 3.0, vapor_col)
		illust_stage1.draw_arc(Vector2(base_x, float_y + 4), 4.0, -PI * 0.5, PI * 0.5, 8, vapor_col, 1.5)


# STAGE 2: Atmospheric Flying Rivers (Sky, Wind Ribbons & Fluffy Clouds)
func _draw_flying_rivers() -> void:
	if illust_stage2 == null:
		return
	if custom_textures.has(2):
		illust_stage2.draw_texture_rect(custom_textures[2], Rect2(0, 0, 90, 90), false)
		return

	# Sky blue backdrop
	illust_stage2.draw_rect(Rect2(0, 0, 90, 90), Color(0.86, 0.94, 0.99))

	# Flying River Corridor (Broad sweeping aerial ribbon)
	var river_points = PackedVector2Array([
		Vector2(6, 26),
		Vector2(30, 36),
		Vector2(55, 52),
		Vector2(84, 68)
	])
	illust_stage2.draw_polyline(river_points, Color(0.26, 0.74, 0.88, 0.55), 16.0)
	illust_stage2.draw_polyline(river_points, Color(0.85, 0.96, 1.0, 0.9), 5.0)

	# Animated moving wind velocity streaks
	for i in range(3):
		var t_stream = fmod((anim_pulse * 0.25) + float(i) * 0.33, 1.0)
		var p_stream = Vector2(8, 26).lerp(Vector2(82, 68), t_stream)
		illust_stage2.draw_circle(p_stream, 3.5, Color(0.12, 0.62, 0.82, 0.95))
		illust_stage2.draw_line(p_stream - Vector2(8, 4), p_stream, Color(0.12, 0.62, 0.82, 0.6), 2.5)

	# Fluffy White Cartoon Clouds
	# Top-left cloud
	illust_stage2.draw_circle(Vector2(16, 28), 11.0, Color(1, 1, 1))
	illust_stage2.draw_circle(Vector2(28, 24), 14.0, Color(1, 1, 1))
	illust_stage2.draw_circle(Vector2(38, 30), 10.0, Color(1, 1, 1))
	# Bottom-right cloud
	illust_stage2.draw_circle(Vector2(58, 64), 9.0, Color(1, 1, 1))
	illust_stage2.draw_circle(Vector2(68, 58), 13.0, Color(1, 1, 1))
	illust_stage2.draw_circle(Vector2(78, 64), 8.0, Color(1, 1, 1))


# STAGE 3: Regional Precipitation (Storm Cloud & Falling Raindrops)
func _draw_rainfall() -> void:
	if illust_stage3 == null:
		return
	if custom_textures.has(3):
		illust_stage3.draw_texture_rect(custom_textures[3], Rect2(0, 0, 90, 90), false)
		return

	# Overcast sky backdrop
	illust_stage3.draw_rect(Rect2(0, 0, 90, 90), Color(0.88, 0.92, 0.96))

	# Billowy Storm Cloud
	# Darker underside shading
	illust_stage3.draw_circle(Vector2(45, 34), 22.0, Color(0.40, 0.52, 0.66))
	# Cloud Body
	illust_stage3.draw_circle(Vector2(24, 30), 14.0, Color(0.50, 0.62, 0.74))
	illust_stage3.draw_circle(Vector2(45, 22), 17.0, Color(0.66, 0.76, 0.86))
	illust_stage3.draw_circle(Vector2(66, 30), 13.0, Color(0.55, 0.66, 0.78))
	# Silver Lining Top Highlights
	illust_stage3.draw_circle(Vector2(40, 18), 10.0, Color(0.88, 0.93, 0.98))

	# Animated Falling Raindrops
	var rain_color = Color(0.12, 0.58, 0.90, 0.9)
	for i in range(7):
		var drop_x = 18.0 + float(i) * 9.0
		var fall_dist = fmod((anim_pulse * 25.0) + float(i) * 11.0, 36.0)
		var drop_y = 48.0 + fall_dist
		illust_stage3.draw_line(Vector2(drop_x, drop_y), Vector2(drop_x - 3, drop_y + 7), rain_color, 2.0)

	# Ground Splash Ripples
	illust_stage3.draw_arc(Vector2(32, 85), 5.0, 0, PI, 6, Color(0.12, 0.58, 0.90, 0.5), 1.5)
	illust_stage3.draw_arc(Vector2(58, 85), 6.0, 0, PI, 6, Color(0.12, 0.58, 0.90, 0.5), 1.5)


# STAGE 4: Your Farm (Agricultural Soil Rows, Growing Crops & Sun)
func _draw_farm() -> void:
	if illust_stage4 == null:
		return
	if custom_textures.has(4):
		illust_stage4.draw_texture_rect(custom_textures[4], Rect2(0, 0, 90, 90), false)
		return

	# Sunny Farmland Sky
	illust_stage4.draw_rect(Rect2(0, 0, 90, 48), Color(0.97, 0.94, 0.86))

	# Warm Morning Sun
	illust_stage4.draw_circle(Vector2(75, 18), 11.0, Color(1.0, 0.82, 0.32))
	illust_stage4.draw_arc(Vector2(75, 18), 16.0, 0, TAU, 16, Color(1.0, 0.82, 0.32, 0.3), 1.5)

	# Tilled Soil Layers
	illust_stage4.draw_rect(Rect2(0, 48, 90, 42), Color(0.52, 0.36, 0.24))
	# Soil Ridge Furrows
	illust_stage4.draw_line(Vector2(0, 62), Vector2(90, 62), Color(0.42, 0.28, 0.18), 3.0)
	illust_stage4.draw_line(Vector2(0, 76), Vector2(90, 76), Color(0.36, 0.24, 0.15), 3.0)

	# Sprouting Crop Plants
	var crop_color = Color(0.32, 0.74, 0.30)
	var plant_x_positions = [20.0, 45.0, 70.0]
	for px in plant_x_positions:
		# Stem
		illust_stage4.draw_line(Vector2(px, 58), Vector2(px, 48), crop_color, 2.5)
		# Left Leaf
		illust_stage4.draw_circle(Vector2(px - 5, 49), 4.5, crop_color)
		# Right Leaf
		illust_stage4.draw_circle(Vector2(px + 5, 47), 4.5, crop_color)
		# Top Bud
		illust_stage4.draw_circle(Vector2(px, 44), 3.0, Color(0.50, 0.85, 0.40))


# ==============================================================================
# CONNECTING CONDUIT PATHS & TRAVELING MOISTURE PARTICLES
# ==============================================================================
func _on_path_visualizer_draw() -> void:
	if path_visualizer == null:
		return

	# Stage 1 Card: (0, 0) to (330, 115) -> Mid-right edge: (330, 57)
	# Stage 2 Card: (360, 0) to (690, 115) -> Mid-left edge: (360, 57), Mid-bottom edge: (525, 115)
	# Stage 3 Card: (360, 140) to (690, 255) -> Mid-top edge: (525, 140), Mid-left edge: (360, 197)
	# Stage 4 Card: (0, 140) to (330, 255) -> Mid-right edge: (330, 197)

	var p1_start = Vector2(330, 57)
	var p1_end = Vector2(360, 57)

	var p2_start = Vector2(525, 115)
	var p2_end = Vector2(525, 140)

	var p3_start = Vector2(360, 197)
	var p3_end = Vector2(330, 197)

	var conduit_color = Color(0.384, 0.851, 0.769, 0.45)

	# 1. Base connecting lines
	path_visualizer.draw_line(p1_start, p1_end, conduit_color, 4.0)
	path_visualizer.draw_line(p2_start, p2_end, conduit_color, 4.0)
	path_visualizer.draw_line(p3_start, p3_end, conduit_color, 4.0)

	# 2. Draw Arrowheads
	_draw_arrow(path_visualizer, Vector2(356, 57), Vector2.RIGHT, conduit_color)
	_draw_arrow(path_visualizer, Vector2(525, 136), Vector2.DOWN, conduit_color)
	_draw_arrow(path_visualizer, Vector2(334, 197), Vector2.LEFT, conduit_color)

	# 3. Animate Flowing Moisture Droplets/Particles
	var t = stage_timer / STAGE_DURATION
	var particle_color_glow = Color(0.2, 0.88, 0.78, 0.95)
	var particle_color_core = Color(1.0, 1.0, 1.0, 0.95)

	if current_state == State.STAGE_1:
		_draw_flowing_particles(path_visualizer, p1_start, p1_end, t, particle_color_glow, particle_color_core)
	elif current_state == State.STAGE_2:
		_draw_flowing_particles(path_visualizer, p2_start, p2_end, t, particle_color_glow, particle_color_core)
	elif current_state == State.STAGE_3:
		_draw_flowing_particles(path_visualizer, p3_start, p3_end, t, particle_color_glow, particle_color_core)
	elif current_state == State.STAGE_4:
		# Draw moisture vapor pulsing around the farm card (Stage 4)
		var center_farm = Vector2(165, 197)
		var radius = 45.0 + sin(anim_pulse) * 6.0
		path_visualizer.draw_arc(center_farm, radius, 0, TAU, 32, Color(0.161, 0.616, 0.529, 0.4), 2.0)


func _draw_flowing_particles(canvas: Control, start_pos: Vector2, end_pos: Vector2, progress: float, glow_col: Color, core_col: Color) -> void:
	for i in range(4):
		var offset = (progress + float(i) * 0.25)
		while offset > 1.0:
			offset -= 1.0
		var pos = start_pos.lerp(end_pos, offset)
		var r = 4.0 + sin(anim_pulse + float(i)) * 1.5
		canvas.draw_circle(pos, r + 2.0, glow_col)
		canvas.draw_circle(pos, r, core_col)


func _draw_arrow(canvas: Control, tip: Vector2, direction: Vector2, col: Color) -> void:
	var normal = Vector2(-direction.y, direction.x)
	var arrow_size = 7.0
	var p1 = tip
	var p2 = tip - direction * arrow_size + normal * (arrow_size * 0.7)
	var p3 = tip - direction * arrow_size - normal * (arrow_size * 0.7)
	canvas.draw_colored_polygon(PackedVector2Array([p1, p2, p3]), col)


func _on_continue_button_pressed() -> void:
	print("Screen 4: Continue pressed -> Navigating to Screen 5 (%s)..." % SCREEN_5_PATH)
	if ResourceLoader.exists(SCREEN_5_PATH):
		var err = get_tree().change_scene_to_file(SCREEN_5_PATH)
		if err != OK:
			push_error("Failed to load scene at '%s'. Error code: %d" % [SCREEN_5_PATH, err])
	else:
		print("Screen 5 scene ('%s') does not exist yet. Ready for next task." % SCREEN_5_PATH)
