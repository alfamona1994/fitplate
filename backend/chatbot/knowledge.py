# Small knowledge base of general fitness answers. The classifier learns these questions together with the
# plan intents, so one model decides which kind of question it is (a label starting with "kb:" means a knowledge answer).
# STATUS: draft. Have a dietitian or fitness professional review every answer before you evaluate the system.
# Rules for adding entries: no supplement doses, no medical advice, no promises of results.

KNOWLEDGE = [
    {"id": "progressive_overload",
     "questions": ["what is progressive overload", "how do i get stronger", "how do i add weight", "how to improve my lifts", "when should i lift heavier"],
     "answer": "Progressive overload means asking your body for a little more over time so it keeps adapting. Change one thing at a time: first add a rep, and once you reach the top of your rep range add a small amount of weight. Small steps lower the chance of injury. Your plan follows this rule."},
    {"id": "warm_up",
     "questions": ["how do i warm up", "should i stretch before exercise", "warm up before workout", "cool down after exercise", "what should i do before a workout"],
     "answer": "Spend 5 to 10 minutes on light movement that copies your workout, such as an easy walk and gentle bodyweight squats or arm circles. Warming up raises your heart rate gradually and prepares your joints. After exercise, a few minutes of easy walking helps your breathing settle."},
    {"id": "protein_sources",
     "questions": ["what foods have protein", "good protein sources", "vegetarian protein foods", "how can i get more protein", "protein rich foods"],
     "answer": "Common protein foods include beans, moi moi and akara, eggs, fish, chicken, lean meat, milk or yoghurt, soya and groundnuts. Spread protein across your meals instead of eating it all at once. Choose foods that fit your diet type and allergies. Your dashboard shows the protein target for your plan."},
    {"id": "plateau",
     "questions": ["my weight is not changing", "i am not losing weight", "i stopped making progress", "weight loss plateau", "why am i not seeing results"],
     "answer": "Body weight naturally moves up and down from day to day, so judge progress over 2 to 4 weeks, not one weigh-in. Check that you are following the plan consistently, sleeping enough and drinking water. Do not cut calories sharply or skip meals. If you are worried, speak to a doctor or dietitian."},
    {"id": "motivation",
     "questions": ["i do not feel like working out", "how to stay motivated", "i want to give up", "how to be consistent", "i keep skipping workouts", "i have no energy to exercise"],
     "answer": "Everyone has low days. Try a very short version of today's workout, even 10 minutes, because starting is the hardest part. Plan the time in advance, lay out your clothes and tell a friend. Rest is fine when you are ill or exhausted. If low mood or tiredness lasts for weeks, please talk to a doctor."},
    {"id": "meal_timing",
     "questions": ["what to eat before exercise", "what to eat after a workout", "food before a run", "snack before gym", "post workout meal"],
     "answer": "Before exercise, a light snack with carbohydrate, such as a banana or oats, 1 to 2 hours ahead is usually comfortable. After exercise, have a normal meal with protein and carbohydrate, and drink water. You do not need special products. Your meal plan already spreads your energy across the day."},
    {"id": "cardio_vs_strength",
     "questions": ["should i do cardio or weights", "cardio or strength training", "do i need both cardio and strength", "which is better for weight loss"],
     "answer": "Both help. Cardio builds heart and lung fitness, and strength training protects muscle and bones. The WHO advises regular moderate activity plus muscle-strengthening on at least two days a week. Your plan mixes both according to your goal."},
    {"id": "results_time",
     "questions": ["how long to see results", "how fast will i lose weight", "when will i see changes", "how long does it take to get fit"],
     "answer": "It varies from person to person. Many people notice better energy and sleep within a few weeks, while body changes usually take longer. A gradual pace, about 0.5 kg a week for weight loss, is considered safer than fast loss. Consistency matters more than speed."},
    {"id": "form_safety",
     "questions": ["how to do a squat properly", "correct form for push ups", "am i doing this exercise right", "proper exercise form", "how to avoid injury when exercising"],
     "answer": "Start with light effort and learn each movement slowly. Keep your back neutral, move under control, and stop if you feel sharp pain. Form is hard to judge from text, so ask a qualified trainer or physiotherapist to check you, especially before adding weight."},
    {"id": "supplements",
     "questions": ["should i take creatine", "best protein powder", "do i need supplements", "which supplements should i buy", "pre workout supplements", "vitamins for gym"],
     "answer": "FitPlate does not recommend supplements or doses. Most people can meet their needs from food. Supplements are regulated products in Nigeria, so buy only products registered with NAFDAC, and ask a doctor or pharmacist first, especially if you have a health condition, take medication, or are pregnant or breastfeeding."},
]

ANSWERS = {e["id"]: e["answer"] for e in KNOWLEDGE}