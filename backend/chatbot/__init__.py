# FitPlate chatbot. Entry point: service.generate_response()
#
# Order of work for every message:
#   1. safety.py      red-flag check (emergencies, self-harm, unsafe dieting) always runs first
#   2. classifier.py  TF-IDF + logistic regression decides what is being asked (plan intents and knowledge topics)
#   3. responder.py / knowledge.py   personalised answers from the user's plan, or a reviewed general answer
#   4. llm.py         optional Claude call for questions the classifier does not know (off without an API key)
#   5. fallback       a safe "I'm not sure" answer