from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Import your chatbot logic
from chatbot import ask_senior_care_bot, LANGUAGE_MAP

app = Flask(__name__)
CORS(app)  # Allow browser JS (React) to call this API

# In-memory session store: {session_id: history_list}
SESSIONS = {}


# --------------------------------------------------
# Serve React HTML WITHOUT Jinja parsing
# --------------------------------------------------
@app.route("/")
def index():
    # This serves templates/index.html as a RAW file
    # No Jinja, no parsing, no explosions
    return send_from_directory("templates", "index.html")


# --------------------------------------------------
# Chat API endpoint
# --------------------------------------------------
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}

    user_message = (data.get("message") or "").strip()
    language = (data.get("language") or "english").lower()
    session_id = data.get("session_id") or "default"

    if not user_message:
        return jsonify({
            "reply": "",
            "error": "Empty message"
        }), 400

    # Map "english" -> "en", "hindi" -> "hi", etc.
    lang_code = LANGUAGE_MAP.get(language, "en")

    # Get or create conversation history
    history = SESSIONS.get(session_id, [])

    # Call your Gemini-based bot
    reply = ask_senior_care_bot(history, user_message, lang_code)

    # Update history for context continuity
    history.append({"role": "user", "text": user_message})
    history.append({"role": "model", "text": reply})
    SESSIONS[session_id] = history

    return jsonify({
        "reply": reply
    })


# --------------------------------------------------
# Run server
# --------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
