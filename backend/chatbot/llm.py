import os

SYSTEM = (
    "You are FitPlate Assistant, a friendly exercise and nutrition helper inside a student research app in Nigeria. "
    "Give short, practical, general wellness information only. Never diagnose, never recommend medication or supplements, "
    "never suggest extreme diets, and never replace a doctor. If the question involves illness, injury, pregnancy, medication "
    "or mental health, tell the user to speak to a qualified professional. Keep answers under 120 words."
)


def ask_llm(message: str, ctx: dict):
    """Optional. Returns None when no API key is set or anything goes wrong."""
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    try:
        import anthropic

        prof = ctx.get("profile") or {}
        flags = (ctx.get("plan") or {}).get("flags") or []
        # Send only coarse, non-identifying context (no name, email, conditions or medication)
        context = (f"User goal: {prof.get('goal', 'unknown')}. Diet: {prof.get('dietType', 'unknown')}. "
                   f"Experience: {prof.get('experience', 'unknown')}. Has safety flags: {'yes' if flags else 'no'}.")
        client = anthropic.Anthropic(api_key=key)
        resp = client.messages.create(
            model=os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5-5"),
            max_tokens=300,
            system=SYSTEM + " " + context,
            messages=[{"role": "user", "content": message}],
        )
        return "".join(b.text for b in resp.content if getattr(b, "type", "") == "text").strip() or None
    except Exception:
        return None