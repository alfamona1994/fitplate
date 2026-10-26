import json
import os
from datetime import date, datetime, timedelta, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from chatbot.service import generate_response
from engine import build_plan

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fitplate.db"
# Set JWT_SECRET_KEY in backend/.env. The fallback is for local development only.
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-only-change-me")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
db = SQLAlchemy(app)
jwt = JWTManager(app)


def now():
    return datetime.now(timezone.utc)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    profile = db.Column(db.Text)  # onboarding answers, stored as JSON text


class Progress(db.Model):  # weight and workouts logged over time
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    logged_on = db.Column(db.Date, default=date.today, nullable=False)
    weight_kg = db.Column(db.Float)
    workouts_done = db.Column(db.Integer)


class Feedback(db.Model):  # ratings on meals and workouts (data for the ML layer later)
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    item_type = db.Column(db.String(20), nullable=False)
    item_name = db.Column(db.String(200), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=now, nullable=False)


class ChatMessage(db.Model):  # chat history
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "user" or "assistant"
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=now, nullable=False)


with app.app_context():
    db.create_all()


def current_user():
    return db.session.get(User, int(get_jwt_identity()))


@app.get("/health")
def health():
    return jsonify(status="ok")


# ---------- Auth ----------
@app.post("/auth/signup")
def signup():
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not name:
        return jsonify(message="Please enter your name."), 400
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify(message="Enter a valid email address."), 400
    if len(password) < 8:
        return jsonify(message="Password must be at least 8 characters."), 400
    if User.query.filter_by(email=email).first():
        return jsonify(message="An account with this email already exists."), 409

    db.session.add(User(name=name, email=email, password_hash=generate_password_hash(password)))
    db.session.commit()
    return jsonify(message="Account created."), 201


@app.post("/auth/signin")
def signin():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify(message="Incorrect email or password."), 401
    return jsonify(token=create_access_token(identity=str(user.id)))


# ---------- Profile and plan ----------
@app.get("/profile")
@jwt_required()
def get_profile():
    user = current_user()
    if not user:
        return jsonify(message="User not found."), 404
    return jsonify(name=user.name or user.email.split("@")[0].title(), email=user.email,
                   profile=json.loads(user.profile) if user.profile else None)


@app.post("/profile")
@jwt_required()
def save_profile():
    user = current_user()
    if not user:
        return jsonify(message="User not found."), 404
    user.profile = json.dumps(request.get_json(silent=True) or {})
    db.session.commit()
    return jsonify(message="Profile saved.")


@app.get("/plan")
@jwt_required()
def get_plan():
    user = current_user()
    if not user:
        return jsonify(message="User not found."), 404
    if not user.profile:
        return jsonify(message="Please complete onboarding first."), 404
    return jsonify(build_plan(json.loads(user.profile)))


# ---------- Progress ----------
@app.post("/progress")
@jwt_required()
def add_progress():
    body = request.get_json(silent=True) or {}
    weight, workouts = body.get("weight_kg"), body.get("workouts_done")
    try:
        weight = float(weight) if weight is not None else None
        workouts = int(workouts) if workouts is not None else None
    except (TypeError, ValueError):
        return jsonify(message="weight_kg must be a number and workouts_done a whole number."), 400
    if weight is None and workouts is None:
        return jsonify(message="Send weight_kg or workouts_done."), 400
    if weight is not None and not 20 <= weight <= 400:
        return jsonify(message="Weight must be between 20 and 400 kg."), 400
    if workouts is not None and not 0 <= workouts <= 14:
        return jsonify(message="Workouts done must be between 0 and 14."), 400

    db.session.add(Progress(user_id=int(get_jwt_identity()), weight_kg=weight, workouts_done=workouts))
    db.session.commit()
    return jsonify(message="Progress saved."), 201


@app.get("/progress")
@jwt_required()
def list_progress():
    rows = (Progress.query.filter_by(user_id=int(get_jwt_identity()))
            .order_by(Progress.logged_on.desc(), Progress.id.desc()).limit(60).all())
    return jsonify([{"date": r.logged_on.isoformat(), "weight_kg": r.weight_kg, "workouts_done": r.workouts_done} for r in rows])


# ---------- Feedback ----------
@app.post("/feedback")
@jwt_required()
def add_feedback():
    body = request.get_json(silent=True) or {}
    item_type = body.get("item_type")
    item_name = (body.get("item_name") or "").strip()
    rating = body.get("rating")
    if item_type not in ("meal", "workout") or not item_name:
        return jsonify(message="Send item_type ('meal' or 'workout') and item_name."), 400
    if not isinstance(rating, int) or isinstance(rating, bool) or not 1 <= rating <= 5:
        return jsonify(message="Rating must be a whole number from 1 to 5."), 400

    db.session.add(Feedback(user_id=int(get_jwt_identity()), item_type=item_type, item_name=item_name[:200], rating=rating))
    db.session.commit()
    return jsonify(message="Thanks for your feedback."), 201


# ---------- Chatbot ----------
@app.post("/chat")
@jwt_required()
def chat():
    user = current_user()
    if not user:
        return jsonify(message="User not found."), 404
    message = ((request.get_json(silent=True) or {}).get("message") or "").strip()
    if not message:
        return jsonify(message="Please type a message."), 400
    if len(message) > 500:
        return jsonify(message="Message is too long (500 characters maximum)."), 400

    profile = json.loads(user.profile) if user.profile else None
    ctx = {"name": user.name or user.email.split("@")[0], "profile": profile, "plan": build_plan(profile) if profile else None}
    result = generate_response(message, ctx)

    db.session.add(ChatMessage(user_id=user.id, role="user", content=message))
    db.session.add(ChatMessage(user_id=user.id, role="assistant", content=result["reply"]))
    db.session.commit()
    return jsonify(result)


@app.get("/chat/history")
@jwt_required()
def chat_history():
    rows = (ChatMessage.query.filter_by(user_id=int(get_jwt_identity()))
            .order_by(ChatMessage.id.desc()).limit(50).all())
    return jsonify([{"role": r.role, "content": r.content} for r in reversed(rows)])


@app.delete("/chat/history")
@jwt_required()
def clear_chat_history():
    ChatMessage.query.filter_by(user_id=int(get_jwt_identity())).delete()
    db.session.commit()
    return jsonify(message="Chat history deleted.")


@app.errorhandler(500)
def server_error(_):
    return jsonify(message="Server error."), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)