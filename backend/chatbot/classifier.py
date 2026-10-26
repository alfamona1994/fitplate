from .intents import INTENTS
from .knowledge import KNOWLEDGE

THRESHOLD = 0.3  # below this the message is treated as "unknown"
_model = None


def _train():
    groups = {**INTENTS, **{"kb:" + e["id"]: e["questions"] for e in KNOWLEDGE}}
    texts = [e for examples in groups.values() for e in examples]
    labels = [i for i, examples in groups.items() for _ in examples]
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.linear_model import LogisticRegression
        from sklearn.pipeline import make_pipeline

        model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True), LogisticRegression(C=20, max_iter=1000))
        model.fit(texts, labels)
        return "sklearn", model
    except ImportError:  # scikit-learn not installed: simple word-overlap fallback
        return "keywords", list(zip(texts, labels))


def classify(message: str):
    """Returns (intent, confidence). intent is 'unknown' when confidence is low."""
    global _model
    if _model is None:
        _model = _train()
    kind, model = _model
    if kind == "sklearn":
        probs = model.predict_proba([message])[0]
        i = probs.argmax()
        return (str(model.classes_[i]), float(probs[i])) if probs[i] >= THRESHOLD else ("unknown", float(probs[i]))

    words = set(message.lower().split())
    best, score = "unknown", 0.0
    for text, label in model:
        t = set(text.split())
        s = len(words & t) / max(len(words | t), 1)
        if s > score:
            best, score = label, s
    return (best, score) if score >= 0.4 else ("unknown", score)