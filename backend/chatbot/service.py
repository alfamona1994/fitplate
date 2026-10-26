from .classifier import classify
from .knowledge import ANSWERS
from .llm import ask_llm
from .responder import FALLBACK, respond
from .safety import SUGGESTIONS, check_red_flags


def generate_response(message: str, ctx: dict) -> dict:
    """ctx = {"name": str, "profile": dict | None, "plan": dict | None}"""
    message = message.strip()[:500]

    flagged = check_red_flags(message)
    if flagged:
        kind, reply = flagged
        return {"reply": reply, "source": "safety", "intent": kind, "suggestions": SUGGESTIONS}

    intent, confidence = classify(message)
    if intent.startswith("kb:"):
        return {"reply": ANSWERS[intent[3:]], "source": "knowledge", "intent": intent[3:], "confidence": round(confidence, 2), "suggestions": SUGGESTIONS}
    if intent != "unknown":
        return {"reply": respond(intent, ctx), "source": "rules", "intent": intent, "confidence": round(confidence, 2), "suggestions": SUGGESTIONS}

    answer = ask_llm(message, ctx)
    if answer:
        return {"reply": answer, "source": "llm", "intent": "unknown", "suggestions": SUGGESTIONS}
    return {"reply": FALLBACK, "source": "fallback", "intent": "unknown", "suggestions": SUGGESTIONS}