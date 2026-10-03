# VaporPath-Agri-Planner
A data-driven climate decision-support system that links large-scale atmospheric moisture dynamics with ground-level soil hydrology to forecast agricultural water deficits and suggest adaptive crop rotations.
**What it does**
•	Ingests NASA Earth observations (SMAP, GPM IMERG, ECOSTRESS, Landsat) and NASA POWER data.
•	Produces 3–4 week early warnings of drought risk at field scale.
•	Recommends adaptive crop rotations to preserve yields and water resources.
**Key datasets and roles**
•	SMAP (Soil moisture) for root-zone moisture
•	GPM IMERG for precipitation anomalies
•	ECOSTRESS Evaporative Stress Index for canopy water loss
•	Landsat NDVI/LST for crop health validation
•	NASA POWER for solar radiation, humidity, and temperature
**Target users**
•	Commercial farms, smallholders, and agricultural cooperatives seeking proactive irrigation and rotation planning.
Architecture at a glance
•	Data Ingestion: Automated fetch and clip of NASA data
•	Analytics: Python-based moisture anomaly modeling against 30-year baselines
•	User Interface: GIS dashboard for boundary input, vulnerability scores, and rotation recommendations
**Impact**
•	Enables proactive adaptation, water conservation, and informed regional planning for food security and policy.
Future directions
•	Soil texture-aware recommendations via SoilGrids
•	Multilingual alerting (SMS/WhatsApp) for areas with limited broadband
**NASA Space Apps Challenge alignment**
•	Challenge Track: Field Shift — Adapting Farms with NASA Data
•	Project Title: VaporPath Agri-Planner
•	Team Name: The_Alchemist
•	Core Tagline: Connecting Continental Moisture Dynamics to Ground-Level Crop Resilience
