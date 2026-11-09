extends Control

# Navigation scene paths
const SCREEN_6_PATH: String = "res://scenes/screen_6.tscn"
const SCREEN_1_PATH: String = "res://scenes/Screen1.tscn.tscn"

# Player selections from previous screens
var selected_country: String = "Brazil"
var selected_crop_id: String = "sorghum"
var selected_crop_name: String = "Grain Sorghum"
var crop_water_saving: String = "-45%"
var crop_resilience: int = 92

var selected_irrigation_id: String = "drip"
var selected_irrigation_name: String = "Smart Drip Irrigation"
var irrigation_water_saving: String = "-50%"
var irrigation_water_saving_pct: int = 50

# Animation timer for cinematic farm simulation
var anim_time: float = 0.0

# Node references
@onready var panoramic_canvas: Control = get_node_or_null("PanoramicFrame/PanoramicCanvas")

# The three tiny result indicator labels
@onready var crop_label: Label = get_node_or_null("TinyResultsRow/CropIndicator/HBox/Label")
@onready var crop_icon: Label = get_node_or_null("TinyResultsRow/CropIndicator/HBox/Icon")

@onready var irrigation_label: Label = get_node_or_null("TinyResultsRow/IrrigationIndicator/HBox/Label")
@onready var irrigation_icon: Label = get_node_or_null("TinyResultsRow/IrrigationIndicator/HBox/Icon")

@onready var savings_label: Label = get_node_or_null("TinyResultsRow/SavingsIndicator/HBox/Label")

# Action buttons & modal
@onready var back_button: Button = get_node_or_null("BackButton")
@onready var finish_button: Button = get_node_or_null("FinishButton")

@onready var completion_modal: Control = get_node_or_null("CompletionModal")
@onready var modal_body: Label = get_node_or_null("CompletionModal/ModalPanel/ModalVBox/ModalBody")
@onready var review_report_btn: Button = get_node_or_null("CompletionModal/ModalPanel/ModalVBox/ModalButtons/ReviewReportBtn")
@onready var play_again_btn: Button = get_node_or_null("CompletionModal/ModalPanel/ModalVBox/ModalButtons/PlayAgainBtn")


func _ready() -> void:
	print("Screen 7 (My Smart Farm - Wide Panoramic Cinematic Farm Showcase) loaded.")

	_read_player_data()
	_update_tiny_indicators()

	# Connect canvas drawing routine
	if panoramic_canvas != null:
		panoramic_canvas.draw.connect(_on_panoramic_draw)

	# Connect action buttons
	if back_button != null:
		back_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not back_button.pressed.is_connected(_on_back_pressed):
			back_button.pressed.connect(_on_back_pressed)

	if finish_button != null:
		finish_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not finish_button.pressed.is_connected(_on_finish_pressed):
			finish_button.pressed.connect(_on_finish_pressed)

	# Connect modal buttons
	if review_report_btn != null:
		review_report_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not review_report_btn.pressed.is_connected(_on_review_report_pressed):
			review_report_btn.pressed.connect(_on_review_report_pressed)

	if play_again_btn != null:
		play_again_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		if not play_again_btn.pressed.is_connected(_on_play_again_pressed):
			play_again_btn.pressed.connect(_on_play_again_pressed)

	if completion_modal != null:
		completion_modal.visible = false


func _process(delta: float) -> void:
	anim_time += delta
	if panoramic_canvas != null:
		panoramic_canvas.queue_redraw()


func _read_player_data() -> void:
	if get_tree().root.has_meta("selected_country"):
		var country_val: Variant = get_tree().root.get_meta("selected_country")
		if country_val is String and not (country_val as String).is_empty():
			selected_country = country_val as String

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

	if get_tree().root.has_meta("crop_resilience"):
		var res_val: Variant = get_tree().root.get_meta("crop_resilience")
		if res_val is int:
			crop_resilience = res_val as int

	if get_tree().root.has_meta("selected_irrigation"):
		var irrig_id_val: Variant = get_tree().root.get_meta("selected_irrigation")
		if irrig_id_val is String and not (irrig_id_val as String).is_empty():
			selected_irrigation_id = irrig_id_val as String

	if get_tree().root.has_meta("selected_irrigation_name"):
		var irrig_name_val: Variant = get_tree().root.get_meta("selected_irrigation_name")
		if irrig_name_val is String and not (irrig_name_val as String).is_empty():
			selected_irrigation_name = irrig_name_val as String

	if get_tree().root.has_meta("irrigation_water_saving"):
		var irrig_save_val: Variant = get_tree().root.get_meta("irrigation_water_saving")
		if irrig_save_val is String and not (irrig_save_val as String).is_empty():
			irrigation_water_saving = irrig_save_val as String

	if get_tree().root.has_meta("irrigation_water_saving_pct"):
		var irrig_pct_val: Variant = get_tree().root.get_meta("irrigation_water_saving_pct")
		if irrig_pct_val is int:
			irrigation_water_saving_pct = irrig_pct_val as int

	print("Screen 7: Panoramic Farm Showcase -> Country: %s, Crop: %s, Irrigation: %s" % [
		selected_country,
		selected_crop_name,
		selected_irrigation_name
	])


func _update_tiny_indicators() -> void:
	# 1. Tiny Crop Indicator
	if crop_label != null:
		crop_label.text = "Crop: %s" % selected_crop_name
	if crop_icon != null:
		match selected_crop_id:
			"sorghum", "millet":
				crop_icon.text = "🌾"
			"cowpea":
				crop_icon.text = "🌱"
			"soybean":
				crop_icon.text = "🫘"

	# 2. Tiny Irrigation Indicator
	if irrigation_label != null:
		irrigation_label.text = "Irrigation: %s" % selected_irrigation_name
	if irrigation_icon != null:
		irrigation_icon.text = "💧" if selected_irrigation_id == "drip" else "💦"

	# 3. Tiny Savings Indicator
	var total_savings_pct: int = 50
	match selected_crop_id:
		"millet":
			total_savings_pct = 68 if selected_irrigation_id == "drip" else 55
		"sorghum":
			total_savings_pct = 60 if selected_irrigation_id == "drip" else 48
		"cowpea":
			total_savings_pct = 62 if selected_irrigation_id == "drip" else 50
		"soybean":
			total_savings_pct = 40 if selected_irrigation_id == "drip" else 25
		_:
			total_savings_pct = 55

	if savings_label != null:
		savings_label.text = "Water Saved: ~%d%%" % total_savings_pct

	# Update modal message
	if modal_body != null:
		modal_body.text = "You built a resilient, sustainable farm in %s!\n\nBy analyzing NASA satellite data for soil moisture, rainfall anomalies, and vegetation stress, you chose %s and %s.\n\nYour farm conserves ~%d%% water while protecting your harvest against changing climate conditions!" % [
			selected_country,
			selected_crop_name,
			selected_irrigation_name,
			total_savings_pct
		]


# ==============================================================================
# WIDE PANORAMIC CINEMATIC FARM LANDSCAPE DRAWING
# ==============================================================================
func _on_panoramic_draw() -> void:
	if panoramic_canvas == null:
		return

	var size: Vector2 = panoramic_canvas.size
	var w: float = size.x
	var h: float = size.y

	# 1. Radiant Morning Sky Gradient
	panoramic_canvas.draw_rect(Rect2(0, 0, w, 180), Color(0.72, 0.88, 0.98))
	panoramic_canvas.draw_rect(Rect2(0, 100, w, 80), Color(0.95, 0.96, 0.88, 0.6))

	# 2. Golden Sunbeams (God-Rays streaming down across the fields)
	var sun_pos: Vector2 = Vector2(w - 90.0, 52.0)
	var ray_pulse: float = 1.0 + sin(anim_time * 2.0) * 0.05
	for r in range(5):
		var ray_angle: float = float(r) * 0.18 + 0.65
		var ray_pts: PackedVector2Array = PackedVector2Array([
			sun_pos,
			sun_pos + Vector2(cos(ray_angle - 0.06), sin(ray_angle - 0.06)) * 420.0,
			sun_pos + Vector2(cos(ray_angle + 0.06), sin(ray_angle + 0.06)) * 420.0
		])
		panoramic_canvas.draw_colored_polygon(ray_pts, Color(1.0, 0.92, 0.60, 0.12 * ray_pulse))

	# Glowing Sun with animated halo
	panoramic_canvas.draw_circle(sun_pos, 30.0 * ray_pulse, Color(1.0, 0.88, 0.38))
	panoramic_canvas.draw_arc(sun_pos, 44.0 * ray_pulse, 0.0, TAU, 24, Color(1.0, 0.88, 0.38, 0.35), 3.5)

	# Gentle Drifting Fluffy Clouds
	var cloud1_x: float = fmod(anim_time * 10.0, w + 140.0) - 70.0
	var cloud2_x: float = fmod(anim_time * 7.0 + 380.0, w + 140.0) - 70.0
	_draw_cloud(panoramic_canvas, Vector2(cloud1_x, 48.0), 1.0)
	_draw_cloud(panoramic_canvas, Vector2(cloud2_x, 82.0), 0.75)

	# 3. Distant Rolling Green Pasture & Rustic Farm Fences
	var pasture_pts: PackedVector2Array = PackedVector2Array([
		Vector2(0, 180),
		Vector2(140, 160),
		Vector2(340, 172),
		Vector2(530, 154),
		Vector2(720, 166),
		Vector2(w, 156),
		Vector2(w, 180)
	])
	panoramic_canvas.draw_colored_polygon(pasture_pts, Color(0.65, 0.82, 0.62))

	# Distant Trees on Horizon
	var tree_x_pos: Array[float] = [75.0, 220.0, 460.0, 640.0, w - 120.0]
	for tx: float in tree_x_pos:
		panoramic_canvas.draw_line(Vector2(tx, 172), Vector2(tx, 152), Color(0.42, 0.28, 0.16), 3.0)
		panoramic_canvas.draw_circle(Vector2(tx, 145), 14.0, Color(0.24, 0.58, 0.26))
		panoramic_canvas.draw_circle(Vector2(tx - 4, 142), 11.0, Color(0.30, 0.65, 0.32))

	# Wooden Farm Post Fence along Horizon
	for fx in range(13):
		var post_x: float = float(fx) * 70.0 + 10.0
		panoramic_canvas.draw_line(Vector2(post_x, 180), Vector2(post_x, 162), Color(0.55, 0.42, 0.28), 2.5)
	panoramic_canvas.draw_line(Vector2(0, 168), Vector2(w, 168), Color(0.58, 0.45, 0.30, 0.8), 1.8)

	# Traditional Farm Windmill in distance
	var wm_x: float = w - 190.0
	var wm_y: float = 145.0
	panoramic_canvas.draw_line(Vector2(wm_x, 172), Vector2(wm_x, wm_y), Color(0.30, 0.36, 0.40), 3.0)
	panoramic_canvas.draw_circle(Vector2(wm_x, wm_y), 3.5, Color(0.85, 0.85, 0.88))
	for b in range(4):
		var ba: float = anim_time * 2.0 + float(b) * (PI * 0.5)
		panoramic_canvas.draw_line(Vector2(wm_x, wm_y), Vector2(wm_x + cos(ba) * 14.0, wm_y + sin(ba) * 14.0), Color(0.88, 0.88, 0.90), 1.8)

	# 4. Rich Farm Soil Ground (Spanning across full panorama)
	panoramic_canvas.draw_rect(Rect2(0, 180, w, h - 180), Color(0.42, 0.28, 0.16))

	# Soil furrows and depth lines
	panoramic_canvas.draw_line(Vector2(0, 225), Vector2(w, 225), Color(0.34, 0.22, 0.12), 4.5)
	panoramic_canvas.draw_line(Vector2(0, 310), Vector2(w, 310), Color(0.30, 0.18, 0.10), 6.0)

	# 5. ROW 1: DISTANT HORIZON ROW (Y = 225, scale = 0.55)
	var row1_x: Array[float] = [40.0, 130.0, 220.0, 310.0, 400.0, 490.0, 580.0, 670.0, 760.0, 850.0]
	for rx: float in row1_x:
		_draw_crop_plant(panoramic_canvas, rx, 225.0, 0.55, anim_time + rx * 0.12)

	# 6. ROW 2: MIDGROUND ROW (Y = 310, scale = 0.82)
	var row2_x: Array[float] = [60.0, 175.0, 290.0, 405.0, 520.0, 635.0, 750.0, 865.0]
	for rx: float in row2_x:
		_draw_crop_plant(panoramic_canvas, rx, 310.0, 0.82, anim_time + rx * 0.12)

	# 7. ROW 3: VIBRANT FOREGROUND ROW (Y = 405, scale = 1.15)
	var row3_x: Array[float] = [75.0, 210.0, 345.0, 480.0, 615.0, 750.0, 885.0]
	for rx: float in row3_x:
		_draw_crop_plant(panoramic_canvas, rx, 405.0, 1.15, anim_time + rx * 0.12)

	# 8. ACTIVE OPERATING IRRIGATION RUNNING ACROSS THE ENTIRE FIELD
	_draw_panoramic_irrigation(panoramic_canvas, row3_x, 405.0, w)

	# 9. HARVEST BASKETS OVERFLOWING WITH HARVEST (Left & Right Field Edges)
	_draw_harvest_basket(panoramic_canvas, Vector2(35.0, 405.0))
	_draw_harvest_basket(panoramic_canvas, Vector2(w - 45.0, 405.0))

	# 10. Golden Harvest Life Sparkles / Drifting Butterflies
	for spk in range(8):
		var st: float = fmod(anim_time * 1.5 + float(spk) * 0.6, 3.0) / 3.0
		var sx: float = fmod(float(spk) * 115.0 + anim_time * 15.0, w - 80.0) + 40.0
		var sy: float = 260.0 + sin(anim_time * 2.5 + float(spk)) * 45.0
		var salpha: float = sin(st * PI) * 0.85
		panoramic_canvas.draw_circle(Vector2(sx, sy), 3.0, Color(1.0, 0.92, 0.45, salpha))


# ==============================================================================
# PROCEDURAL MATURE CROP DRAWING
# ==============================================================================
func _draw_crop_plant(canvas: Control, px: float, base_y: float, scale_factor: float, local_t: float) -> void:
	var wind_sway: float = sin(local_t * 2.2) * (3.5 * scale_factor)

	match selected_crop_id:
		"sorghum":
			# --- TALL GRAIN SORGHUM (Heavy Nodding Golden-Amber Panicles) ---
			var stalk_top: Vector2 = Vector2(px + wind_sway, base_y - 96.0 * scale_factor)
			canvas.draw_line(Vector2(px, base_y), stalk_top, Color(0.28, 0.58, 0.25), 4.2 * scale_factor)

			var leaf_col: Color = Color(0.24, 0.66, 0.28)
			canvas.draw_line(Vector2(px, base_y - 28.0 * scale_factor), Vector2(px - 32.0 * scale_factor + wind_sway * 0.5, base_y - 46.0 * scale_factor), leaf_col, 3.8 * scale_factor)
			canvas.draw_line(Vector2(px, base_y - 48.0 * scale_factor), Vector2(px + 34.0 * scale_factor + wind_sway * 0.5, base_y - 66.0 * scale_factor), leaf_col, 3.8 * scale_factor)
			canvas.draw_line(Vector2(px, base_y - 68.0 * scale_factor), Vector2(px - 26.0 * scale_factor + wind_sway * 0.8, base_y - 82.0 * scale_factor), leaf_col, 3.2 * scale_factor)

			var head_pos: Vector2 = stalk_top + Vector2(2.0, -8.0 * scale_factor)
			canvas.draw_circle(head_pos, 11.0 * scale_factor, Color(0.92, 0.62, 0.20))
			canvas.draw_circle(head_pos + Vector2(0, -10.0 * scale_factor), 9.0 * scale_factor, Color(0.96, 0.75, 0.26))
			canvas.draw_circle(head_pos + Vector2(0, -19.0 * scale_factor), 7.0 * scale_factor, Color(0.98, 0.84, 0.35))

			for g in range(6):
				var ga: float = float(g) * 1.15
				var gp: Vector2 = head_pos + Vector2(cos(ga) * 6.5, sin(ga) * 11.0 - 6.0) * scale_factor
				canvas.draw_circle(gp, 2.6 * scale_factor, Color(1.0, 0.90, 0.45))

		"millet":
			# --- PEARL MILLET (Stately Reeds with Long Fuzzy Cattail Spikes & Fine Awns) ---
			var stalk_top: Vector2 = Vector2(px + wind_sway * 1.2, base_y - 92.0 * scale_factor)
			canvas.draw_line(Vector2(px, base_y), stalk_top, Color(0.26, 0.62, 0.28), 3.4 * scale_factor)

			canvas.draw_line(Vector2(px, base_y - 32.0 * scale_factor), Vector2(px - 24.0 * scale_factor, base_y - 52.0 * scale_factor), Color(0.28, 0.68, 0.32), 2.6 * scale_factor)
			canvas.draw_line(Vector2(px, base_y - 52.0 * scale_factor), Vector2(px + 24.0 * scale_factor, base_y - 72.0 * scale_factor), Color(0.28, 0.68, 0.32), 2.6 * scale_factor)

			var spike_bottom: Vector2 = stalk_top
			var spike_top: Vector2 = stalk_top + Vector2(0, -34.0 * scale_factor)
			canvas.draw_line(spike_bottom, spike_top, Color(0.86, 0.70, 0.28), 11.0 * scale_factor)
			canvas.draw_circle(spike_top, 5.5 * scale_factor, Color(0.90, 0.76, 0.34))

			for a in range(7):
				var ay: float = spike_bottom.y - float(a) * 5.0 * scale_factor
				canvas.draw_line(Vector2(stalk_top.x - 7.5 * scale_factor, ay), Vector2(stalk_top.x - 13.0 * scale_factor, ay - 2.0 * scale_factor), Color(0.95, 0.85, 0.45), 1.2 * scale_factor)
				canvas.draw_line(Vector2(stalk_top.x + 7.5 * scale_factor, ay), Vector2(stalk_top.x + 13.0 * scale_factor, ay - 2.0 * scale_factor), Color(0.95, 0.85, 0.45), 1.2 * scale_factor)

		"cowpea":
			# --- COWPEA (Lush Bush Heavy with Purple-Green Pods) ---
			var center_pos: Vector2 = Vector2(px, base_y - 22.0 * scale_factor)
			canvas.draw_circle(center_pos + Vector2(-20.0 * scale_factor, 0), 18.0 * scale_factor, Color(0.20, 0.58, 0.26))
			canvas.draw_circle(center_pos + Vector2(20.0 * scale_factor, 0), 18.0 * scale_factor, Color(0.20, 0.58, 0.26))
			canvas.draw_circle(center_pos + Vector2(0, -16.0 * scale_factor + wind_sway * 0.4), 20.0 * scale_factor, Color(0.24, 0.65, 0.30))
			canvas.draw_circle(center_pos + Vector2(0, -6.0 * scale_factor), 15.0 * scale_factor, Color(0.32, 0.74, 0.36))

			var pod_col: Color = Color(0.55, 0.24, 0.40)
			canvas.draw_line(center_pos + Vector2(-14.0 * scale_factor, 4.0), center_pos + Vector2(-24.0 * scale_factor, 24.0 * scale_factor), pod_col, 3.4 * scale_factor)
			canvas.draw_line(center_pos + Vector2(14.0 * scale_factor, 4.0), center_pos + Vector2(24.0 * scale_factor, 24.0 * scale_factor), pod_col, 3.4 * scale_factor)
			canvas.draw_line(center_pos + Vector2(0, 6.0), center_pos + Vector2(5.0 * scale_factor, 28.0 * scale_factor), Color(0.35, 0.65, 0.28), 3.2 * scale_factor)

		"soybean":
			# --- SOYBEAN (Lush Emerald Foliage Laden with Pod Clusters) ---
			var center_pos: Vector2 = Vector2(px, base_y - 26.0 * scale_factor)
			canvas.draw_circle(center_pos + Vector2(-16.0 * scale_factor, 4.0), 16.0 * scale_factor, Color(0.26, 0.62, 0.28))
			canvas.draw_circle(center_pos + Vector2(16.0 * scale_factor, 4.0), 16.0 * scale_factor, Color(0.26, 0.62, 0.28))
			canvas.draw_circle(center_pos + Vector2(0, -16.0 * scale_factor + wind_sway * 0.5), 19.0 * scale_factor, Color(0.30, 0.72, 0.34))
			canvas.draw_circle(center_pos, 13.0 * scale_factor, Color(0.38, 0.78, 0.40))

			var pod_col: Color = Color(0.76, 0.74, 0.36)
			canvas.draw_circle(center_pos + Vector2(-9.0 * scale_factor, 6.0), 4.8 * scale_factor, pod_col)
			canvas.draw_circle(center_pos + Vector2(-4.0 * scale_factor, 13.0 * scale_factor), 4.8 * scale_factor, pod_col)
			canvas.draw_circle(center_pos + Vector2(9.0 * scale_factor, 6.0), 4.8 * scale_factor, pod_col)
			canvas.draw_circle(center_pos + Vector2(13.0 * scale_factor, 13.0 * scale_factor), 4.8 * scale_factor, pod_col)


func _draw_panoramic_irrigation(canvas: Control, positions: Array[float], base_y: float, width: float) -> void:
	if selected_irrigation_id == "drip":
		# Full field drip poly tubing
		var pipe_y: float = base_y + 4.0
		canvas.draw_line(Vector2(20, pipe_y), Vector2(width - 20, pipe_y), Color(0.18, 0.24, 0.26), 7.0)
		canvas.draw_line(Vector2(20, pipe_y - 1.5), Vector2(width - 20, pipe_y - 1.5), Color(0.42, 0.55, 0.60, 0.8), 2.0)

		# Cyan water flow pulses along pipe
		for p in range(7):
			var flow_x: float = fmod(anim_time * 95.0 + float(p) * 125.0, width - 40.0) + 20.0
			canvas.draw_circle(Vector2(flow_x, pipe_y), 2.6, Color(0.4, 0.92, 1.0, 0.95))

		# Dripping water droplets and expanding soil saturation ripples
		for i in range(positions.size()):
			var px: float = positions[i]
			canvas.draw_rect(Rect2(px - 5, pipe_y - 1, 10, 8), Color(0.12, 0.16, 0.18))
			canvas.draw_circle(Vector2(px, pipe_y + 16.0), 22.0, Color(0.28, 0.18, 0.10, 0.75))

			var fall: float = fmod(anim_time * 2.4 + float(i) * 0.35, 1.0)
			var drop_y: float = lerp(pipe_y + 8.0, pipe_y + 24.0, fall)
			canvas.draw_circle(Vector2(px, drop_y), 3.4, Color(0.18, 0.68, 0.98, 0.95))
			canvas.draw_circle(Vector2(px, drop_y - 1.5), 1.8, Color(0.70, 0.92, 1.0, 0.9))

			if fall > 0.70:
				var rt: float = (fall - 0.70) / 0.30
				var rr: float = rt * 18.0
				var ra: float = (1.0 - rt) * 0.9
				canvas.draw_arc(Vector2(px, pipe_y + 24.0), rr, 0.0, TAU, 14, Color(0.22, 0.74, 1.0, ra), 1.8)

	else:
		# Micro-sprinklers
		var pipe_y: float = base_y + 4.0
		canvas.draw_line(Vector2(20, pipe_y), Vector2(width - 20, pipe_y), Color(0.18, 0.24, 0.26), 6.0)

		# 3 field sprinkler risers
		var sprinkler_x_positions: Array[float] = [210.0, 480.0, 750.0]
		for sx: float in sprinkler_x_positions:
			var riser_top: float = pipe_y - 36.0
			canvas.draw_line(Vector2(sx, pipe_y), Vector2(sx, riser_top), Color(0.22, 0.30, 0.32), 4.5)
			canvas.draw_circle(Vector2(sx, riser_top), 6.5, Color(0.85, 0.72, 0.28))

			# Shimmering cooling mist fan
			var spray_fan_angles: Array[float] = [-0.95, -0.65, -0.35, 0.0, 0.35, 0.65, 0.95]
			for sa: float in spray_fan_angles:
				var sp: float = fmod(anim_time * 3.8 + sx * 0.01 + sa, 1.0)
				var dist: float = sp * 55.0
				var dir: Vector2 = Vector2(sin(sa), -cos(sa) * 0.55)
				var mist_pos: Vector2 = Vector2(sx, riser_top) + dir * dist
				var ma: float = (1.0 - sp) * 0.85
				canvas.draw_circle(mist_pos, 2.8, Color(0.38, 0.85, 1.0, ma))
				canvas.draw_circle(mist_pos, 1.4, Color(0.85, 0.96, 1.0, ma))


func _draw_harvest_basket(canvas: Control, pos: Vector2) -> void:
	# Woven wooden harvest basket
	canvas.draw_rect(Rect2(pos.x - 18, pos.y - 14, 36, 20), Color(0.58, 0.42, 0.26))
	canvas.draw_line(Vector2(pos.x - 18, pos.y - 14), Vector2(pos.x + 18, pos.y - 14), Color(0.48, 0.34, 0.20), 2.5)
	# Basket handle
	canvas.draw_arc(pos + Vector2(0, -14), 16.0, PI, TAU, 16, Color(0.48, 0.34, 0.20), 2.5)
	# Fresh vegetables & grains overflowing
	canvas.draw_circle(pos + Vector2(-8, -16), 7.0, Color(0.92, 0.35, 0.25)) # Tomato
	canvas.draw_circle(pos + Vector2(6, -18), 7.5, Color(0.95, 0.75, 0.25))  # Corn/Grain
	canvas.draw_circle(pos + Vector2(0, -14), 6.0, Color(0.32, 0.75, 0.35))  # Greens


func _draw_cloud(canvas: Control, pos: Vector2, scale_factor: float) -> void:
	var col: Color = Color(1.0, 1.0, 1.0, 0.82)
	canvas.draw_circle(pos, 16.0 * scale_factor, col)
	canvas.draw_circle(pos + Vector2(16.0 * scale_factor, -4.0 * scale_factor), 14.0 * scale_factor, col)
	canvas.draw_circle(pos + Vector2(30.0 * scale_factor, 0), 12.0 * scale_factor, col)
	canvas.draw_circle(pos + Vector2(-14.0 * scale_factor, 2.0 * scale_factor), 11.0 * scale_factor, col)


# ==============================================================================
# BUTTON INTERACTIONS
# ==============================================================================
func _on_back_pressed() -> void:
	print("Screen 7: Back button pressed -> Returning to Screen 6 (%s)..." % SCREEN_6_PATH)
	var err: Error = get_tree().change_scene_to_file(SCREEN_6_PATH)
	if err != OK:
		push_error("Failed to load Screen 6 at '%s'. Error code: %d" % [SCREEN_6_PATH, err])


func _on_finish_pressed() -> void:
	print("Screen 7: FINISH pressed! Completing VaporPath Agri Planner simulation.")
	if finish_button != null:
		finish_button.text = "✓ COMPLETED!"

	if completion_modal != null:
		completion_modal.visible = true


func _on_review_report_pressed() -> void:
	if completion_modal != null:
		completion_modal.visible = false


func _on_play_again_pressed() -> void:
	print("Screen 7: Replaying simulation -> Returning to Screen 1 (%s)..." % SCREEN_1_PATH)
	var err: Error = get_tree().change_scene_to_file(SCREEN_1_PATH)
	if err != OK:
		push_error("Failed to load Screen 1 at '%s'. Error code: %d" % [SCREEN_1_PATH, err])
