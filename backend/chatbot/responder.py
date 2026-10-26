PLAN_INTENTS = {"today_workout", "meals", "calories", "why", "progression", "bmi"}
NO_PLAN = "I need your profile first. Please finish onboarding, then ask me again."


def _bmi_category(b):
    return "underweight" if b < 18.5 else "in the healthy range" if b < 25 else "overweight" if b < 30 else "in the obese range"


def respond(intent: str, ctx: dict) -> str:
    plan, prof = ctx.get("plan"), ctx.get("profile") or {}
    first = (ctx.get("name") or "there").split()[0]
    if intent in PLAN_INTENTS and not plan:
        return NO_PLAN

    if intent == "greeting":
        return f"Hi {first}! I can explain your workouts, meals and targets, or answer general fitness questions. What would you like to know?"
    if intent == "thanks":
        return "You're welcome! Ask me anything else about your plan."
    if intent == "goodbye":
        return f"Goodbye {first}. Keep going, one session at a time."

    if intent == "today_workout":
        lines = [f"{s['day']} · {s['title']}: {s['details']} (effort {s['intensity']}). Why: {s['why']}" for s in plan["sessions"]]
        return "Here is your week:\n" + "\n".join(lines)
    if intent == "meals":
        lines = [f"{m['slot']} · {m['name']} (about {m['kcal']} kcal). Why: {m['why']}" for m in plan["meals"]]
        return "Here are your meals:\n" + "\n".join(lines)
    if intent == "calories":
        t = plan["targets"]
        return (f"Your daily target is {t['calories']} kcal, with about {t['protein']} g protein, {t['carbs']} g carbs and {t['fat']} g fat. "
                f"It comes from the Mifflin-St Jeor equation, your activity level and your goal ({prof.get('goal', 'stay fit').lower()}).")
    if intent == "why":
        return ("Your plan comes from your answers: your body measurements and activity set your calories, your goal decides whether we add or remove a small amount, "
                "and your diet type, allergies and budget filter the meals. Workouts follow your goal, experience, days per week and equipment. "
                "Health conditions or medication make the plan gentler. Every item on your dashboard has a 'Why' line.")
    if intent == "progression":
        return "Here is how your plan progresses:\n" + "\n".join(plan["progression"])
    if intent == "bmi":
        b = prof.get("bmi")
        if not b:
            return NO_PLAN
        return (f"Your BMI is {b}, which is {_bmi_category(b)}. BMI is a rough screening number, not a diagnosis. "
                "It can't tell muscle from fat, so talk to a health professional if you're concerned.")
    if intent == "safety":
        text = ("I can't give medical advice. If you have a health condition, take medication, are pregnant or have an injury, "
                "please talk to a doctor before changing your exercise or diet. Your plan is kept gentler when you tell us about these.")
        flags = (plan or {}).get("flags") or []
        return text + ("\n\nYour current safety notes:\n" + "\n".join(f["message"] for f in flags) if flags else "")
    if intent == "soreness":
        return ("Mild muscle soreness for a day or two after a new workout is common. Sharp pain, swelling or joint pain is not normal, so stop and see a professional. "
                "Rest days are when your body adapts, so keep them.")
    if intent == "hydration_sleep":
        return "Drink water through the day and sip during exercise. Pale yellow urine is a rough sign you are hydrated. Most adults need 7–9 hours of sleep."
    if intent == "log_progress":
        return "Progress logging for weight and workouts is coming soon in the app."
    if intent == "swap_food":
        return ("Your meals already avoid the allergies you listed. A profile edit page is coming soon; until then you can repeat onboarding "
                "to change your diet type, allergies or budget.")
    return FALLBACK


FALLBACK = ("I'm not sure about that one. I can help with your workouts, meals, calories and general fitness basics. "
            "For anything medical, please speak to a doctor.")