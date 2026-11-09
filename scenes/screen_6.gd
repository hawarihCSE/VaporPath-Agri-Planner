extends Control

# Navigation scene paths
const SCREEN_5_PATH: String = "res://scenes/screen_5.tscn"
const SCREEN_7_PATH: String = "res://scenes/screen_7.tscn"

# Button style resources
const STYLE_BTN_NORMAL: StyleBox = preload("res://assests/ui/button_normal.tres")
const STYLE_BTN_HOVER: StyleBox = preload("res://button_normal1.tres")
const STYLE_BTN_PRESSED: StyleBox = preload("res://button_normal2.tres")

# Currently selected irrigation machine: "drip" | "sprinkler"
var selected_irrigation_id: String = "drip"

# Data passed from Screen 5 (automatically read from root metadata)
var selected_crop_id: String = "sorghum"
var selected_crop_name: String = "Grain Sorghum"
var crop_water_saving: String = "-45%"
var selected_country: String = "Brazil"

# Animation timer for live procedural simulation
var anim_time: float = 0.0

# Node references
@onready var crop_indicator_label: Label = get_node_or_null("CropIndicator/CropIndicatorLabel")
@onready var water_saving_label: Label = get_node_or_null("WaterSavingBadge/WaterSavingLabel")
@onready var close_up_canvas: Control = get_node_or_null("PlotFrame/CloseUpCanvas")
@onready var plot_tag: Label = get_node_or_null("PlotFrame/PlotTag")

# Machine Controllers
@onready var drip_machine_card: Button = get_node_or_null("MachinesRow/DripMachineCard")
@onready var sprinkler_machine_card: Button = get_node_or_null("MachinesRow/SprinklerMachineCard")
@onready var drip_machine_canvas: Control = get_node_or_null("MachinesRow/DripMachineCard/HBox/DripPicBox/DripMachineCanvas")
@onready var sprinkler_machine_canvas: Control = get_node_or_null("MachinesRow/SprinklerMachineCard/HBox/SprinklerPicBox/SprinklerMachineCanvas")
@onready var drip_pill: Label = get_node_or_null("MachinesRow/DripMachineCard/HBox/InfoVBox/StatusPill")
@onready var sprinkler_pill: Label = get_node_or_null("MachinesRow/SprinklerMachineCard/HBox/InfoVBox/StatusPill")

# Action buttons
@onready var back_button: Button = get_node_or_null("BackButton")
@onready var continue_button: Button = get_node_or_null("ContinueButton")

# Dynamic machine styleboxes
var style_machine_selected: StyleBoxFlat
var style_machine_normal: StyleBoxFlat
var style_machine_hover: StyleBoxFlat
var style_pill_selected: StyleBoxFlat
var style_pill_normal: StyleBoxFlat


func _ready() -> void:
	print("Screen 6 (Irrigation Gameplay - Close-up Farm Plot & Machine Controllers) loaded.")

	_init_styles()

	# Read actual crop selected on Screen 5
	if get_tree().root.has_meta("selected_crop"):
		var id_val: Variant = get_tree().root.get_meta("selected_crop")
		if id_val is String and not (id_val as String).is_empty():
			selected_crop_id = id_val as String

	if get_tree().root.has_meta("selected_crop_name"):
		var name_val: Variant = get_tree().root.get_meta("selected_crop_name")
		if name_val is String and not (name_val as String).is_empty():
			selected_crop_name = name_val as String

	if get_tree().root.has_meta("crop_water_saving"):
		var saving_val: Variant = get_tree().root.get_meta("crop_water_saving")
		if saving_val is String and not (saving_val as String).is_empty():
			crop_water_saving = saving_val as String

	if get_tree().root.has_meta("selected_country"):
		var country_val: Variant = get_tree().root.get_meta("selected_country")
		if country_val is String and not (country_val as String).is_empty():
			selected_country = country_val as String

	if crop_indicator_label != null:
		crop_indicator_label.text = "🌱 Plot Crop: %s" % selected_crop_name

	# Connect canvas drawing routines
	if close_up_canvas != null:
		close_up_canvas.draw.connect(_on_close_up_draw)
	if drip_machine_canvas != null:
		drip_machine_canvas.draw.connect(_on_drip_machine_draw)
	if sprinkler_machine_canvas != null:
		sprinkler_machine_canvas.draw.connect(_on_sprinkler_machine_draw)

	# Connect interactive machine choice cards
	if drip_machine_card != null:
		drip_machine_card.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not drip_machine_card.pressed.is_connected(_on_drip_machine_pressed):
			drip_machine_card.pressed.connect(_on_drip_machine_pressed)

	if sprinkler_machine_card != null:
		sprinkler_machine_card.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not sprinkler_machine_card.pressed.is_connected(_on_sprinkler_machine_pressed):
			sprinkler_machine_card.pressed.connect(_on_sprinkler_machine_pressed)

	# Connect navigation buttons
	if back_button != null:
		back_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not back_button.pressed.is_connected(_on_back_pressed):
			back_button.pressed.connect(_on_back_pressed)

	if continue_button != null:
		continue_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not continue_button.pressed.is_connected(_on_continue_pressed):
			continue_button.pressed.connect(_on_continue_pressed)

	# Initial activation: Smart Drip Irrigation
	_select_irrigation("drip")


func _process(delta: float) -> void:
	anim_time += delta
	if close_up_canvas != null:
		close_up_canvas.queue_redraw()
	if drip_machine_canvas != null:
		drip_machine_canvas.queue_redraw()
	if sprinkler_machine_canvas != null:
		sprinkler_machine_canvas.queue_redraw()


func _init_styles() -> void:
	style_machine_selected = StyleBoxFlat.new()
	style_machine_selected.bg_color = Color(0.88, 0.97, 0.94, 1.0)
	style_machine_selected.border_width_left = 3
	style_machine_selected.border_width_top = 3
	style_machine_selected.border_width_right = 3
	style_machine_selected.border_width_bottom = 3
	style_machine_selected.border_color = Color(0.12, 0.62, 0.52, 1.0)
	style_machine_selected.corner_radius_top_left = 16
	style_machine_selected.corner_radius_top_right = 16
	style_machine_selected.corner_radius_bottom_right = 16
	style_machine_selected.corner_radius_bottom_left = 16

	style_machine_normal = StyleBoxFlat.new()
	style_machine_normal.bg_color = Color(1.0, 1.0, 1.0, 0.95)
	style_machine_normal.border_width_left = 2
	style_machine_normal.border_width_top = 2
	style_machine_normal.border_width_right = 2
	style_machine_normal.border_width_bottom = 2
	style_machine_normal.border_color = Color(0.384, 0.851, 0.769, 0.6)
	style_machine_normal.corner_radius_top_left = 16
	style_machine_normal.corner_radius_top_right = 16
	style_machine_normal.corner_radius_bottom_right = 16
	style_machine_normal.corner_radius_bottom_left = 16

	style_machine_hover = StyleBoxFlat.new()
	style_machine_hover.bg_color = Color(0.94, 0.99, 0.97, 1.0)
	style_machine_hover.border_width_left = 2
	style_machine_hover.border_width_top = 2
	style_machine_hover.border_width_right = 2
	style_machine_hover.border_width_bottom = 2
	style_machine_hover.border_color = Color(0.16, 0.62, 0.53, 0.9)
	style_machine_hover.corner_radius_top_left = 16
	style_machine_hover.corner_radius_top_right = 16
	style_machine_hover.corner_radius_bottom_right = 16
	style_machine_hover.corner_radius_bottom_left = 16

	style_pill_selected = StyleBoxFlat.new()
	style_pill_selected.content_margin_top = 4.0
	style_pill_selected.content_margin_bottom = 4.0
	style_pill_selected.bg_color = Color(0.12, 0.62, 0.52, 1.0)
	style_pill_selected.corner_radius_top_left = 10
	style_pill_selected.corner_radius_top_right = 10
	style_pill_selected.corner_radius_bottom_right = 10
	style_pill_selected.corner_radius_bottom_left = 10

	style_pill_normal = StyleBoxFlat.new()
	style_pill_normal.content_margin_top = 4.0
	style_pill_normal.content_margin_bottom = 4.0
	style_pill_normal.bg_color = Color(0.90, 0.94, 0.93, 1.0)
	style_pill_normal.corner_radius_top_left = 10
	style_pill_normal.corner_radius_top_right = 10
	style_pill_normal.corner_radius_bottom_right = 10
	style_pill_normal.corner_radius_bottom_left = 10


func _on_drip_machine_pressed() -> void:
	_select_irrigation("drip")


func _on_sprinkler_machine_pressed() -> void:
	_select_irrigation("sprinkler")


func _select_irrigation(machine_id: String) -> void:
	selected_irrigation_id = machine_id
	var is_drip: bool = (machine_id == "drip")
	print("Screen 6: Activated Machine -> %s" % ("Precision Drip Unit" if is_drip else "Rotary Sprinkler Rig"))

	# Highlight activated machine card
	if drip_machine_card != null and drip_pill != null:
		drip_machine_card.add_theme_stylebox_override("normal", style_machine_selected if is_drip else style_machine_normal)
		drip_machine_card.add_theme_stylebox_override("hover", style_machine_selected if is_drip else style_machine_hover)
		drip_pill.text = "✓ PUMP ACTIVE" if is_drip else "ACTIVATE PUMP"
		drip_pill.add_theme_stylebox_override("normal", style_pill_selected if is_drip else style_pill_normal)
		drip_pill.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0) if is_drip else Color(0.3, 0.45, 0.42, 1.0))

	if sprinkler_machine_card != null and sprinkler_pill != null:
		sprinkler_machine_card.add_theme_stylebox_override("normal", style_machine_selected if not is_drip else style_machine_normal)
		sprinkler_machine_card.add_theme_stylebox_override("hover", style_machine_selected if not is_drip else style_machine_hover)
		sprinkler_pill.text = "✓ RIG ACTIVE" if not is_drip else "ACTIVATE RIG"
		sprinkler_pill.add_theme_stylebox_override("normal", style_pill_selected if not is_drip else style_pill_normal)
		sprinkler_pill.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0) if not is_drip else Color(0.3, 0.45, 0.42, 1.0))

	# Update small water saving indicator
	if water_saving_label != null:
		water_saving_label.text = "💧 Water Saved: -50%" if is_drip else "💧 Water Saved: -30%"

	if plot_tag != null:
		plot_tag.text = "🔬 Farm Plot: %s • %s" % [
			selected_crop_name,
			"Smart Drip Infiltration (Subsoil Hydration)" if is_drip else "Micro-Sprinklers (Canopy Cooling Mist)"
		]


# ==============================================================================
# CLOSE-UP FARM PLOT & SUBTERRANEAN ROOT CROSS-SECTION DRAWING
# ==============================================================================
func _on_close_up_draw() -> void:
	if close_up_canvas == null:
		return

	var size: Vector2 = close_up_canvas.size
	var w: float = size.x
	var h: float = size.y
	var soil_surface_y: float = 175.0

	# 1. Above Ground Sky
	close_up_canvas.draw_rect(Rect2(0, 0, w, soil_surface_y), Color(0.76, 0.90, 0.98))

	# Soft sun halo & rays
	var sun_pos: Vector2 = Vector2(w - 70.0, 40.0)
	close_up_canvas.draw_circle(sun_pos, 22.0, Color(1.0, 0.88, 0.42))
	close_up_canvas.draw_arc(sun_pos, 32.0, 0.0, TAU, 16, Color(1.0, 0.88, 0.42, 0.35), 2.5)

	# 2. Subterranean Soil Cross-Section (Topsoil & Subsoil Layers)
	# Topsoil layer (warm humus rich brown)
	close_up_canvas.draw_rect(Rect2(0, soil_surface_y, w, 45.0), Color(0.46, 0.32, 0.20))
	close_up_canvas.draw_line(Vector2(0, soil_surface_y), Vector2(w, soil_surface_y), Color(0.36, 0.22, 0.12), 3.0)

	# Subsoil layer (dense clay loam)
	close_up_canvas.draw_rect(Rect2(0, soil_surface_y + 45.0, w, h - (soil_surface_y + 45.0)), Color(0.38, 0.24, 0.14))
	close_up_canvas.draw_line(Vector2(0, soil_surface_y + 45.0), Vector2(w, soil_surface_y + 45.0), Color(0.30, 0.18, 0.10, 0.6), 2.0)

	# 3. THREE LARGE CLOSE-UP PLANTS OF SELECTED CROP (Centered at X = 160, 430, 700)
	var plant_x: Array[float] = [160.0, 430.0, 700.0]

	for px: float in plant_x:
		# Draw subterranean root system in cross-section
		_draw_subsoil_roots(close_up_canvas, px, soil_surface_y, h)

		# Draw above-ground close-up crop
		_draw_close_up_crop(close_up_canvas, px, soil_surface_y)

	# 4. ACTIVE IRRIGATION DELIVERY ON THE PLOT
	_draw_plot_irrigation(close_up_canvas, plant_x, soil_surface_y, w, h)


func _draw_subsoil_roots(canvas: Control, px: float, ground_y: float, max_h: float) -> void:
	var root_col: Color = Color(0.85, 0.78, 0.65, 0.9)
	var root_reach_y: float = max_h - 15.0

	# Taproot branching down into subsoil
	canvas.draw_line(Vector2(px, ground_y), Vector2(px, root_reach_y), root_col, 3.5)
	canvas.draw_line(Vector2(px, ground_y + 20), Vector2(px - 32, ground_y + 55), root_col, 2.2)
	canvas.draw_line(Vector2(px, ground_y + 20), Vector2(px + 32, ground_y + 55), root_col, 2.2)
	canvas.draw_line(Vector2(px, ground_y + 50), Vector2(px - 45, ground_y + 90), root_col, 1.8)
	canvas.draw_line(Vector2(px, ground_y + 50), Vector2(px + 45, ground_y + 90), root_col, 1.8)

	# Fine capillary root hairs
	for r in range(5):
		var ry: float = ground_y + 25.0 + float(r) * 16.0
		canvas.draw_line(Vector2(px - 15, ry), Vector2(px - 26, ry + 6), Color(0.9, 0.85, 0.75, 0.6), 1.2)
		canvas.draw_line(Vector2(px + 15, ry), Vector2(px + 26, ry + 6), Color(0.9, 0.85, 0.75, 0.6), 1.2)

	# If Drip is active: subsoil moisture saturation halo
	if selected_irrigation_id == "drip":
		var pulse: float = sin(anim_time * 2.5 + px * 0.01) * 0.15 + 0.85
		canvas.draw_circle(Vector2(px, ground_y + 50), 44.0 * pulse, Color(0.18, 0.55, 0.85, 0.28))
		canvas.draw_circle(Vector2(px, ground_y + 50), 28.0 * pulse, Color(0.22, 0.65, 0.95, 0.35))


func _draw_close_up_crop(canvas: Control, px: float, ground_y: float) -> void:
	var sway: float = sin(anim_time * 2.2 + px * 0.02) * 4.0

	match selected_crop_id:
		"sorghum":
			# --- TALL GRAIN SORGHUM (Close-up Stalk with Node Joints & Drooping Grain Panicle) ---
			var stalk_top: Vector2 = Vector2(px + sway, ground_y - 120.0)
			# Thick jointed bamboo-like stalk
			canvas.draw_line(Vector2(px, ground_y), stalk_top, Color(0.26, 0.60, 0.28), 5.5)

			# Node rings
			canvas.draw_line(Vector2(px - 4, ground_y - 35), Vector2(px + 4, ground_y - 35), Color(0.85, 0.75, 0.45), 2.0)
			canvas.draw_line(Vector2(px - 4, ground_y - 70), Vector2(px + 4, ground_y - 70), Color(0.85, 0.75, 0.45), 2.0)

			# Large broad arching strap leaves with pale central vein
			var leaf_col: Color = Color(0.24, 0.68, 0.30)
			var vein_col: Color = Color(0.60, 0.88, 0.60)
			canvas.draw_line(Vector2(px, ground_y - 35), Vector2(px - 55 + sway * 0.4, ground_y - 65), leaf_col, 5.0)
			canvas.draw_line(Vector2(px, ground_y - 35), Vector2(px - 55 + sway * 0.4, ground_y - 65), vein_col, 1.8)

			canvas.draw_line(Vector2(px, ground_y - 70), Vector2(px + 60 + sway * 0.4, ground_y - 100), leaf_col, 5.0)
			canvas.draw_line(Vector2(px, ground_y - 70), Vector2(px + 60 + sway * 0.4, ground_y - 100), vein_col, 1.8)

			canvas.draw_line(Vector2(px, ground_y - 95), Vector2(px - 45 + sway * 0.8, ground_y - 118), leaf_col, 4.0)

			# Heavy golden-amber grain panicle nodding in the breeze
			var head_pos: Vector2 = stalk_top + Vector2(4.0, -12.0)
			canvas.draw_circle(head_pos, 15.0, Color(0.92, 0.60, 0.18))
			canvas.draw_circle(head_pos + Vector2(0, -12.0), 12.0, Color(0.96, 0.74, 0.24))
			canvas.draw_circle(head_pos + Vector2(0, -23.0), 9.0, Color(0.98, 0.84, 0.32))

			# Grain bead highlights
			for g in range(8):
				var ga: float = float(g) * 0.9
				var gp: Vector2 = head_pos + Vector2(cos(ga) * 9.0, sin(ga) * 14.0 - 8.0)
				canvas.draw_circle(gp, 3.2, Color(1.0, 0.90, 0.45))

		"millet":
			# --- PEARL MILLET (Stately Reeds with Long Fuzzy Cylindrical Spikes & Fine Awns) ---
			var stalk_top: Vector2 = Vector2(px + sway * 1.2, ground_y - 110.0)
			canvas.draw_line(Vector2(px, ground_y), stalk_top, Color(0.28, 0.65, 0.30), 4.5)

			# Slender graceful leaves
			canvas.draw_line(Vector2(px, ground_y - 35), Vector2(px - 45, ground_y - 70), Color(0.30, 0.70, 0.34), 3.5)
			canvas.draw_line(Vector2(px, ground_y - 65), Vector2(px + 48, ground_y - 98), Color(0.30, 0.70, 0.34), 3.5)

			# Long fuzzy cattail spike (42px tall cylinder)
			var spike_bottom: Vector2 = stalk_top
			var spike_top: Vector2 = stalk_top + Vector2(0, -42.0)
			canvas.draw_line(spike_bottom, spike_top, Color(0.86, 0.70, 0.28), 14.0)
			canvas.draw_circle(spike_top, 7.0, Color(0.90, 0.76, 0.34))

			# Micro-awns / bristles poking out
			for a in range(9):
				var ay: float = spike_bottom.y - float(a) * 5.0
				canvas.draw_line(Vector2(stalk_top.x - 10, ay), Vector2(stalk_top.x - 18, ay - 3.0), Color(0.96, 0.88, 0.48), 1.5)
				canvas.draw_line(Vector2(stalk_top.x + 10, ay), Vector2(stalk_top.x + 18, ay - 3.0), Color(0.96, 0.88, 0.48), 1.5)

		"cowpea":
			# --- COWPEA (Sprawling Lush Bush with Hanging Purple/Green Pods) ---
			var center_pos: Vector2 = Vector2(px, ground_y - 32.0)
			canvas.draw_circle(center_pos + Vector2(-32.0, 0), 26.0, Color(0.20, 0.58, 0.26))
			canvas.draw_circle(center_pos + Vector2(32.0, 0), 26.0, Color(0.20, 0.58, 0.26))
			canvas.draw_circle(center_pos + Vector2(0, -24.0 + sway * 0.4), 30.0, Color(0.24, 0.66, 0.30))
			canvas.draw_circle(center_pos + Vector2(0, -8.0), 24.0, Color(0.32, 0.74, 0.36))

			# Long hanging cowpea bean pods (purple/green striped)
			var pod_col: Color = Color(0.56, 0.22, 0.42)
			canvas.draw_line(center_pos + Vector2(-20.0, 6.0), center_pos + Vector2(-36.0, 38.0), pod_col, 4.5)
			canvas.draw_line(center_pos + Vector2(20.0, 6.0), center_pos + Vector2(36.0, 38.0), pod_col, 4.5)
			canvas.draw_line(center_pos + Vector2(0, 10.0), center_pos + Vector2(8.0, 42.0), Color(0.35, 0.65, 0.28), 4.0)

			# Violet flower blossoms
			canvas.draw_circle(center_pos + Vector2(-15.0, -18.0), 5.0, Color(0.72, 0.45, 0.78))
			canvas.draw_circle(center_pos + Vector2(18.0, -14.0), 5.0, Color(0.72, 0.45, 0.78))

		"soybean":
			# --- SOYBEAN (Dense Emerald Canopy Laden with Fuzzy Bean Pods) ---
			var center_pos: Vector2 = Vector2(px, ground_y - 36.0)
			canvas.draw_circle(center_pos + Vector2(-26.0, 5.0), 24.0, Color(0.24, 0.60, 0.28))
			canvas.draw_circle(center_pos + Vector2(26.0, 5.0), 24.0, Color(0.24, 0.60, 0.28))
			canvas.draw_circle(center_pos + Vector2(0, -25.0 + sway * 0.5), 28.0, Color(0.28, 0.68, 0.32))
			canvas.draw_circle(center_pos, 20.0, Color(0.36, 0.76, 0.38))

			# Fuzzy golden-green soybean pod clusters along nodes
			var pod_col: Color = Color(0.76, 0.74, 0.36)
			canvas.draw_circle(center_pos + Vector2(-12.0, 8.0), 6.5, pod_col)
			canvas.draw_circle(center_pos + Vector2(-6.0, 18.0), 6.5, pod_col)
			canvas.draw_circle(center_pos + Vector2(12.0, 8.0), 6.5, pod_col)
			canvas.draw_circle(center_pos + Vector2(18.0, 18.0), 6.5, pod_col)


func _draw_plot_irrigation(canvas: Control, positions: Array[float], ground_y: float, width: float, height: float) -> void:
	if selected_irrigation_id == "drip":
		# Poly pipe running along ground
		var pipe_y: float = ground_y - 2.0
		canvas.draw_line(Vector2(20, pipe_y), Vector2(width - 20, pipe_y), Color(0.18, 0.24, 0.26), 7.5)
		canvas.draw_line(Vector2(20, pipe_y - 2.0), Vector2(width - 20, pipe_y - 2.0), Color(0.42, 0.55, 0.60, 0.8), 2.2)

		# Water pulses inside pipe
		for p in range(5):
			var flow_x: float = fmod(anim_time * 95.0 + float(p) * 170.0, width - 40.0) + 20.0
			canvas.draw_circle(Vector2(flow_x, pipe_y), 2.6, Color(0.4, 0.92, 1.0, 0.95))

		# Dripping water droplets percolating directly down to roots
		for px: float in positions:
			# Brass emitter fitting
			canvas.draw_rect(Rect2(px - 6, pipe_y - 1, 12, 9), Color(0.12, 0.16, 0.18))
			canvas.draw_circle(Vector2(px, pipe_y + 8), 3.5, Color(0.85, 0.72, 0.28))

			var fall: float = fmod(anim_time * 2.3 + px * 0.01, 1.0)
			var drop_y: float = lerp(pipe_y + 8.0, ground_y + 24.0, fall)
			canvas.draw_circle(Vector2(px, drop_y), 3.5, Color(0.18, 0.68, 0.98, 0.95))

			# Percolating blue droplets moving deep through soil cross-section
			var sub_fall: float = fmod(anim_time * 1.5 + px * 0.02, 1.0)
			var sub_y: float = lerp(ground_y + 25.0, height - 20.0, sub_fall)
			canvas.draw_circle(Vector2(px - 10.0, sub_y), 2.4, Color(0.24, 0.72, 1.0, 0.85))
			canvas.draw_circle(Vector2(px + 10.0, sub_y + 8.0), 2.4, Color(0.24, 0.72, 1.0, 0.85))

	else:
		# Micro-sprinklers
		var pipe_y: float = ground_y - 2.0
		canvas.draw_line(Vector2(20, pipe_y), Vector2(width - 20, pipe_y), Color(0.18, 0.24, 0.26), 6.0)

		# Sprinkler risers between plants
		var riser_x_positions: Array[float] = [295.0, 565.0]
		for rx: float in riser_x_positions:
			var riser_top: float = ground_y - 45.0
			canvas.draw_line(Vector2(rx, pipe_y), Vector2(rx, riser_top), Color(0.22, 0.30, 0.32), 4.5)
			canvas.draw_circle(Vector2(rx, riser_top), 6.5, Color(0.85, 0.72, 0.28))

			# Wide 360-degree mist spray fan
			var spray_angles: Array[float] = [-0.95, -0.65, -0.35, 0.0, 0.35, 0.65, 0.95]
			for sa: float in spray_angles:
				var sp: float = fmod(anim_time * 3.6 + rx * 0.01 + sa, 1.0)
				var dist: float = sp * 58.0
				var dir: Vector2 = Vector2(sin(sa), -cos(sa) * 0.55)
				var mist_pos: Vector2 = Vector2(rx, riser_top) + dir * dist
				var ma: float = (1.0 - sp) * 0.85
				canvas.draw_circle(mist_pos, 2.8, Color(0.38, 0.85, 1.0, ma))


# ==============================================================================
# MACHINE UNIT 1: PRECISION DRIP PUMP UNIT DRAWING
# ==============================================================================
func _on_drip_machine_draw() -> void:
	if drip_machine_canvas == null:
		return

	var size: Vector2 = drip_machine_canvas.size
	var w: float = size.x
	var h: float = size.y

	drip_machine_canvas.draw_rect(Rect2(0, 0, w, h), Color(0.90, 0.95, 0.98))

	# Heavy industrial pump casing
	drip_machine_canvas.draw_rect(Rect2(15, 30, 65, 95), Color(0.16, 0.38, 0.40))
	drip_machine_canvas.draw_rect(Rect2(20, 35, 55, 85), Color(0.20, 0.48, 0.50))

	# Pressure dial gauge
	drip_machine_canvas.draw_circle(Vector2(48, 58), 18.0, Color(0.95, 0.95, 0.96))
	drip_machine_canvas.draw_arc(Vector2(48, 58), 18.0, 0, TAU, 16, Color(0.12, 0.25, 0.28), 2.0)
	# Needle pointing to optimal green zone
	var needle_angle: float = -PI * 0.25 + sin(anim_time * 4.0) * 0.08
	drip_machine_canvas.draw_line(Vector2(48, 58), Vector2(48 + cos(needle_angle) * 14.0, 58 + sin(needle_angle) * 14.0), Color(0.85, 0.22, 0.22), 2.0)

	# Status power LED
	drip_machine_canvas.draw_circle(Vector2(48, 95), 5.0, Color(0.20, 0.85, 0.45))

	# Coiled black drip tubing reel on right side
	drip_machine_canvas.draw_circle(Vector2(115, 75), 32.0, Color(0.18, 0.24, 0.26))
	drip_machine_canvas.draw_circle(Vector2(115, 75), 18.0, Color(0.90, 0.95, 0.98))

	# Dripping emitter nozzle emerging from reel
	drip_machine_canvas.draw_line(Vector2(115, 107), Vector2(115, 130), Color(0.18, 0.24, 0.26), 4.5)
	drip_machine_canvas.draw_rect(Rect2(110, 130, 10, 8), Color(0.85, 0.72, 0.28))

	# Falling water drop
	var fall: float = fmod(anim_time * 2.5, 1.0)
	var drop_y: float = lerp(138.0, 158.0, fall)
	drip_machine_canvas.draw_circle(Vector2(115, drop_y), 3.6, Color(0.18, 0.68, 0.98, 0.95))


# ==============================================================================
# MACHINE UNIT 2: ROTARY SPRINKLER RIG DRAWING
# ==============================================================================
func _on_sprinkler_machine_draw() -> void:
	if sprinkler_machine_canvas == null:
		return

	var size: Vector2 = sprinkler_machine_canvas.size
	var w: float = size.x
	var h: float = size.y

	sprinkler_machine_canvas.draw_rect(Rect2(0, 0, w, h), Color(0.92, 0.96, 0.98))

	var center_x: float = w * 0.5

	# Heavy triangular field tripod base
	sprinkler_machine_canvas.draw_line(Vector2(center_x, 65), Vector2(25, 145), Color(0.24, 0.32, 0.35), 5.5)
	sprinkler_machine_canvas.draw_line(Vector2(center_x, 65), Vector2(center_x, 148), Color(0.24, 0.32, 0.35), 5.5)
	sprinkler_machine_canvas.draw_line(Vector2(center_x, 65), Vector2(w - 25, 145), Color(0.24, 0.32, 0.35), 5.5)
	sprinkler_machine_canvas.draw_line(Vector2(32, 120), Vector2(w - 32, 120), Color(0.28, 0.36, 0.40), 3.0)

	# High pressure blue water hose connection
	sprinkler_machine_canvas.draw_line(Vector2(15, 150), Vector2(center_x, 80), Color(0.18, 0.55, 0.85), 6.0)

	# Brass impact sprinkler rotor assembly
	sprinkler_machine_canvas.draw_circle(Vector2(center_x, 50), 9.0, Color(0.85, 0.72, 0.28))
	sprinkler_machine_canvas.draw_rect(Rect2(center_x - 8, 44, 16, 12), Color(0.92, 0.80, 0.35))

	# Rotating counterweight hammer arm
	var arm_angle: float = anim_time * 6.0
	var arm_end: Vector2 = Vector2(center_x, 50) + Vector2(cos(arm_angle) * 16.0, sin(arm_angle) * 8.0)
	sprinkler_machine_canvas.draw_line(Vector2(center_x, 50), arm_end, Color(0.4, 0.4, 0.45), 3.5)
	sprinkler_machine_canvas.draw_circle(arm_end, 4.0, Color(0.25, 0.25, 0.30))

	# Spray fan mist particles
	var spray_angles: Array[float] = [-0.8, -0.4, 0.0, 0.4, 0.8]
	for a: float in spray_angles:
		var sp: float = fmod(anim_time * 3.5 + a * 0.4, 1.0)
		var dist: float = sp * 48.0
		var dir: Vector2 = Vector2(sin(a), -cos(a) * 0.6)
		var mist_pos: Vector2 = Vector2(center_x, 46) + dir * dist
		var ma: float = (1.0 - sp) * 0.9
		sprinkler_machine_canvas.draw_circle(mist_pos, 2.8, Color(0.35, 0.82, 1.0, ma))


# ==============================================================================
# BUTTON INTERACTIONS & SCENE NAVIGATION
# ==============================================================================
func _on_back_pressed() -> void:
	print("Screen 6: Back button pressed -> Returning to Screen 5 (%s)..." % SCREEN_5_PATH)
	var err: Error = get_tree().change_scene_to_file(SCREEN_5_PATH)
	if err != OK:
		push_error("Failed to load Screen 5 at '%s'. Error code: %d" % [SCREEN_5_PATH, err])


func _on_continue_pressed() -> void:
	var is_drip: bool = (selected_irrigation_id == "drip")
	var irrig_name: String = "Smart Drip Irrigation" if is_drip else "Micro-Sprinklers"
	var irrig_save: String = "-50%" if is_drip else "-30%"
	var irrig_pct: int = 50 if is_drip else 30

	# Save irrigation plan metadata for Screen 7
	get_tree().root.set_meta("selected_irrigation", selected_irrigation_id)
	get_tree().root.set_meta("selected_irrigation_name", irrig_name)
	get_tree().root.set_meta("irrigation_water_saving", irrig_save)
	get_tree().root.set_meta("irrigation_water_saving_pct", irrig_pct)

	print("Screen 6: Saved Irrigation Plan -> %s (Water Saving: %s)" % [irrig_name, irrig_save])

	# Navigate directly to Screen 7 (The Final Panoramic Farm Showcase)
	print("Screen 6: Navigating to Screen 7 (%s)..." % SCREEN_7_PATH)
	var err: Error = get_tree().change_scene_to_file(SCREEN_7_PATH)
	if err != OK:
		push_error("Failed to load Screen 7 at '%s'. Error code: %d" % [SCREEN_7_PATH, err])
