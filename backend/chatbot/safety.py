import re

# Runs BEFORE everything else. These rules are deliberately cautious.
EMERGENCY = re.compile(r"chest pain|can'?t breathe|cannot breathe|difficulty breathing|short of breath|fainted|passed out|blacked out|severe dizz|heart (is )?racing|numb(ness)? in (my )?(arm|face)", re.I)
SELF_HARM = re.compile(r"kill myself|suicid|end my life|want to die|hurt myself|self[- ]?harm", re.I)
UNSAFE_DIET = re.compile(r"starv|crash diet|stop eating|not eat (at all|anything)|skip all meals|make myself (throw up|vomit)|purge|laxatives? to lose", re.I)

SUGGESTIONS = ["What is my workout plan?", "What should I eat today?", "How many calories do I need?", "Why this plan?"]


def check_red_flags(message: str):
    """Returns (kind, reply) if the message needs a safety response, else None."""
    if SELF_HARM.search(message):
        return "self_harm", ("I'm really sorry you're feeling this way, and I'm glad you said it. You deserve support from a real person right now. "
                             "Please contact someone you trust, or call your local emergency number (112 in Nigeria) if you might act on these thoughts. "
                             "I'm an exercise and diet assistant, so I can't help with this safely, but you are not alone.")
    if EMERGENCY.search(message):
        return "emergency", ("Please stop exercising now. Chest pain, trouble breathing, fainting or severe dizziness can be serious. "
                             "Get medical help right away, or call your local emergency number (112 in Nigeria). Do not wait for this app to help.")
    if UNSAFE_DIET.search(message):
        return "unsafe_diet", ("I can't help with starving, skipping all meals, purging or crash diets, because they can seriously harm your health. "
                               "If food or weight feels hard to manage, please talk to a doctor or a registered dietitian. "
                               "I'm happy to explain your normal plan, which is built to be safe.")
    return None