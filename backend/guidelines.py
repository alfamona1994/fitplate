# Every number the engine uses lives here, with its source.
# "proposed" = starting value, to be validated with your supervisor and the professionals you interview.

G = {
    "bmr_offset": {"Male": 5, "Female": -161, "Other": -78},  # Mifflin-St Jeor (1990)
    "activity_factor": {"Low": 1.4, "Moderate": 1.55, "High": 1.7},  # adapted from FAO/WHO/UNU 2001 (proposed)
    "loss_deficit": 500,          # about 0.5 kg per week
    "max_deficit_pct": 0.25,      # never cut more than 25% of daily energy (proposed)
    "gain_surplus": 300,          # modest surplus for muscle gain (proposed)
    "min_kcal": {"Male": 1500, "Female": 1200, "Other": 1200},  # commonly used minimums (proposed)
    "protein_per_kg": {"Lose weight": 1.8, "Build muscle": 2.0},  # ISSN range 1.4-2.0 g/kg
    "protein_default": 1.4,
    "fat_share": 0.25,            # within the WHO 15-30% range
    "bmi_underweight": 18.5,      # WHO
    "bmi_consult": 35,            # proposed
    "age_min_deficit": 18,        # proposed
    "age_consult_vigorous": 60,   # proposed
    "sleep_flag_below": 6,        # 7-9 h recommended (AASM/SRS 2015)
    # FITT: Frequency, Intensity (effort out of 10), Time, Type
    "gentle_sessions_max": 3,
    "gentle_cardio_min": 15,
    "cardio_base_min": {"Beginner": 20, "Intermediate": 30, "Advanced": 35},
    "cardio_cap_min": {"Beginner": 40, "Intermediate": 50, "Advanced": 60},
    "rpe": {
        "Beginner": "4–5 out of 10",
        "Intermediate": "5–6 out of 10",
        "Advanced": "6–7 out of 10",
        "gentle": "3–4 out of 10 (you can talk easily)",
    },
    "weekly_increase_pct": 10,    # common rule of thumb (proposed)
    "deload_every": 4,
    "deload_factor": 0.8,
    "who_2020": "Adults: build towards 150–300 min of moderate activity a week plus strength work on 2 or more days (WHO 2020).",
}