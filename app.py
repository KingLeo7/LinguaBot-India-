from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import db, Language, TranslationLog
from translator import translate_text
from chatbot import generate_chat_response
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///linguabot.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    Language.seed_indian_languages()


@app.route("/", methods=["GET"])
def index():
    return send_from_directory(".", "index.html")

@app.route("/LinguaBotIndia.jsx", methods=["GET"])
def serve_jsx():
    return send_from_directory(".", "LinguaBotIndia.jsx")


@app.route("/api/languages", methods=["GET"])
def get_languages():
    langs = Language.query.order_by(Language.name).all()
    return jsonify([l.to_dict() for l in langs])


@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "").strip()
    target_code = data.get("target_lang", "hi")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    lang = Language.query.filter_by(code=target_code).first()
    if not lang:
        return jsonify({"error": "Language not found"}), 404

    result = translate_text(text, target_code, lang.name, lang.script)

    log = TranslationLog(
        source_text=text,
        translated_text=result["translated"],
        target_lang_code=target_code,
        target_lang_name=lang.name,
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "translated": result["translated"],
        "language": lang.to_dict(),
        "romanized": result.get("romanized", ""),
    })

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip()
    target_code = data.get("target_lang", "hi")
    history = data.get("history", [])

    if not message:
        return jsonify({"error": "Message is required"}), 400

    lang = Language.query.filter_by(code=target_code).first()
    if not lang:
        return jsonify({"error": "Language not found"}), 404

    response_text = generate_chat_response(message, lang.name, history)
    
    return jsonify({
        "response": response_text
    })

@app.route("/api/history", methods=["GET"])
def get_history():
    logs = TranslationLog.query.order_by(TranslationLog.created_at.desc()).limit(20).all()
    return jsonify([l.to_dict() for l in logs])


@app.route("/api/history", methods=["DELETE"])
def clear_history():
    TranslationLog.query.delete()
    db.session.commit()
    return jsonify({"message": "History cleared"})


@app.route("/api/languages/<code>", methods=["GET"])
def get_language(code):
    lang = Language.query.filter_by(code=code).first_or_404()
    return jsonify(lang.to_dict())


if __name__ == "__main__":
    app.run(debug=True, port=5000)
