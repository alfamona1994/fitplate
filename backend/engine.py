import math

from foods import DIET_BANS, FOODS
from guidelines import G

# Rule-based engine (version 1). The rules are the hard safety limits.
# A machine learning layer can later rank options that already pass the rules.

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
PATTERN = {
    "Lose weight": ["C", "S", "C", "S", "C"],
    "Build muscle": ["S", "S", "S", "S", "C"],
    "Stay fit": ["S", "C", "S", "C", "S"],
    "Improve endurance": ["C", "C", "S", "C", "C"],
}
CARDIO_TYPE = {"Beginner": "brisk walk", "Intermediate": "jog or cycle", "Advanced": "interval run"}
MOVES = {
    "No equipment": "squats, push-ups, lunges, planks",
    "Home basics": "dumbbell squats, rows, shoulder presses, planks",
    "Full gym": "barbell squat, bench press, lat pulldown, cable rows",
}
SETS = {"Beginner": "2 sets of 10–12", "Intermediate": "3 sets of 8–12", "Advanced": "4 sets of 6–10"}
BUDGET_CAP = {"Low": 1, "Medium": 2, "High": 3}


def rnd(x):
    return int(math.floor(x + 0.5))


def round10(x):
    return rnd(x / 10) * 10


def build_plan(p):
    weight = p.get("weight") or 70
    height = p.get("height") or 170
    age = p.get("age") or 30
    bmi = p.get("bmi") or 22
    goal = p.get("goal") or "Stay fit"
    exp = p.get("experience") or "Beginner"
    gender = p.get("gender") or "Other"
    conditions = [c for c in p.get("conditions", []) if c != "None"]
    meds = [m for m in p.get("medications", []) if m != "None"]
    allergies = [a for a in p.get("allergies", []) if a != "None"]
    pregnant = "Pregnancy or breastfeeding" in conditions

    # ---- Safety rules (each has an id you can cite in your methodology) ----
    flags = []
    no_deficit = False

    def flag(fid, level, message):
        flags.append({"id": fid, "level": level, "message": message})

    if age < G["age_min_deficit"]:
        no_deficit = True
        flag("S1", "consult", "You are under 18, so we do not set a calorie deficit. Speak to a doctor or dietitian about healthy weight goals.")
    if bmi < G["bmi_underweight"] and goal == "Lose weight":
        no_deficit = True
        flag("S2", "consult", "Your BMI is in the underweight range, so weight loss is not recommended. Please speak to a doctor.")
    if pregnant:
        no_deficit = True
        flag("S3", "consult", "Pregnancy and breastfeeding change your energy needs. Please follow your doctor's or dietitian's advice for calories and exercise.")
    if conditions:
        flag("S4", "consult", f"You told us about: {', '.join(conditions)}. See a doctor before starting. Your plan is kept low-impact.")
    if meds:
        if any(m.startswith("Diabetes") for m in meds):
            flag("S5", "consult", "Diet and exercise can change blood sugar when you take diabetes medication. Ask your doctor before changing anything.")
        else:
            flag("S5", "consult", f"You take regular medication ({', '.join(meds)}). Ask your doctor or pharmacist whether exercise or diet changes affect it.")
    if age >= G["age_consult_vigorous"]:
        flag("S6", "consult", "At your age, check with a doctor before starting vigorous exercise. Your plan is kept gentle.")
    if bmi >= G["bmi_consult"]:
        flag("S7", "consult", "At your BMI, a doctor should check you before you start a new exercise programme. Your plan is kept gentle.")
    if (p.get("sleepHours") or 7) < G["sleep_flag_below"]:
        flag("S8", "info", "You sleep under 6 hours. Aim for 7–9 hours, since poor sleep affects appetite and recovery.")
    gentle = bool(conditions or meds) or age >= G["age_consult_vigorous"] or bmi >= G["bmi_consult"]

    # ---- Energy and macros ----
    bmr = 10 * weight + 6.25 * height - 5 * age + G["bmr_offset"].get(gender, G["bmr_offset"]["Other"])
    tdee = bmr * G["activity_factor"].get(p.get("activityLevel") or "Moderate", 1.55)
    adjust = 0
    if goal == "Lose weight" and not no_deficit:
        adjust = -min(G["loss_deficit"], tdee * G["max_deficit_pct"])
    if goal == "Build muscle" and not pregnant:
        adjust = G["gain_surplus"]
    calories = round10(max(tdee + adjust, G["min_kcal"].get(gender, 1200)))
    protein = rnd(weight * G["protein_per_kg"].get(goal, G["protein_default"]))
    fat = rnd(calories * G["fat_share"] / 9)
    carbs = rnd((calories - protein * 4 - fat * 9) / 4)

    # ---- Exercise (FITT) ----
    d = p.get("daysPerWeek") or "3"
    count = 2 if d.startswith("1") else 3 if d.startswith("3") else 5
    if gentle:
        count = min(count, G["gentle_sessions_max"])
    base = G["gentle_cardio_min"] if gentle else G["cardio_base_min"][exp]
    cap = G["cardio_cap_min"][exp]
    rpe = G["rpe"]["gentle"] if gentle else G["rpe"][exp]
    cardio_type = "gentle walk" if gentle else CARDIO_TYPE[exp]
    moves = MOVES.get(p.get("equipment") or "No equipment", MOVES["No equipment"])
    slots = [0, 3] if count == 2 else [0, 2, 4] if count == 3 else [0, 1, 2, 3, 4]

    sessions = []
    for i, kind in enumerate(PATTERN.get(goal, PATTERN["Stay fit"])[:count]):
        if kind == "C":
            why = ("Burns calories to support fat loss." if goal == "Lose weight"
                   else "Builds heart and lung fitness." if goal == "Improve endurance"
                   else "Keeps your heart healthy.")
            sessions.append({"day": DAYS[slots[i]], "title": "Cardio", "details": f"{base} min {cardio_type}", "intensity": rpe, "why": why})
        else:
            why = ("Resistance training is the main driver of muscle growth." if goal == "Build muscle"
                   else "Protects muscle and improves strength.")
            details = "Light bodyweight moves, 1–2 sets of 8–10" if gentle else f"{moves}: {SETS[exp]}"
            sessions.append({"day": DAYS[slots[i]], "title": "Strength", "details": details, "intensity": rpe, "why": why})

    # Progression inside fixed bounds: about +10% a week, capped, lighter week every 4th week
    weeks = []
    for w in range(1, 5):
        if w == 1:
            weeks.append(base)
        elif w % G["deload_every"] == 0:
            weeks.append(rnd(weeks[-1] * G["deload_factor"]))
        else:
            weeks.append(min(cap, rnd(weeks[-1] * (1 + G["weekly_increase_pct"] / 100))))
    progression = [
        f"Week {i + 1}: {m} min per cardio session" + (" (lighter recovery week)" if (i + 1) % G["deload_every"] == 0 else "")
        for i, m in enumerate(weeks)
    ] + [
        f"Cardio time rises about {G['weekly_increase_pct']}% a week, never above {cap} min per session.",
        "Strength: when you finish every set with 2 reps to spare, add 1 rep per set. At the top of the range, add a little weight (2–5%).",
        G["who_2020"],
    ]

    # ---- Meals ----
    banned = set(DIET_BANS.get(p.get("dietType") or "", [])) | set(allergies)
    budget_cap = BUDGET_CAP.get(p.get("budget") or "Medium", 2)
    n = p.get("mealsPerDay")
    meal_slots = ([("Lunch", 0.45), ("Dinner", 0.55)] if n == "2"
                  else [("Breakfast", 0.25), ("Lunch", 0.4), ("Dinner", 0.35)] if n == "3"
                  else [("Breakfast", 0.25), ("Lunch", 0.35), ("Dinner", 0.3), ("Snack", 0.1)])
    meals = []
    for slot, share in meal_slots:
        food = next((f for f in FOODS if f["slot"] == slot and f["cost"] <= budget_cap and not (set(f["contains"]) & banned)), None)
        meals.append({
            "slot": slot,
            "kcal": round10(calories * share),
            "name": food["name"] if food else "No safe match in our list yet. Ask a dietitian.",
            "why": (f"{food['note']} Fits your {(p.get('dietType') or '').lower()} diet and {(p.get('budget') or '').lower()} budget."
                    if food else "Your allergies and diet leave no match in our small food list."),
        })

    return {"targets": {"calories": calories, "protein": protein, "carbs": carbs, "fat": fat},
            "sessions": sessions, "progression": progression, "meals": meals, "flags": flags}