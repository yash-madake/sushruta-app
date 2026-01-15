import os
from datetime import datetime
from gtts import gTTS
import playsound
import uuid
import time
import re
import requests  # Ollama HTTP API

# ================= CONFIG =================
MODEL_NAME = "qwen3:4b-instruct"   # Ollama model name
MAX_TURNS = 6                      # a bit more context
COOLDOWN_SECONDS = 1.0
MAX_CHARS_PER_TURN = 800           # allow slightly more info per turn

SYSTEM_INSTRUCTION = """
You are a Senior Care Assistant chatbot called 'SeniorCare Ally'.

Goals:
- Help older adults and family caregivers with daily questions.
- Be calm, polite, and easy to understand.
- Encourage safety, dignity, and independence.

Rules:
- You are NOT a doctor and cannot diagnose or prescribe.
- For serious symptoms (chest pain, breathing trouble, confusion, falls, suicidal thoughts),
  clearly advise contacting a doctor or emergency services immediately.
- Use short paragraphs and simple language.
- Offer practical advice: routines, reminders, fall prevention, medication organization,
  emotional well-being, light exercise, and diet.
- If unsure, say so and suggest professional help.

Style:
- Respectful, supportive, non-judgmental.
- Keep answers concise but clear (3–7 short sentences).
- Do not use bullet points or lists; write in plain sentences.
- Always finish your sentences before stopping.
- When giving factual information, be accurate and avoid guessing.
"""

# ================= LANGUAGE =================
LANGUAGE_MAP = {
    "english": "en",
    "hindi": "hi",
    "marathi": "mr",
    "tamil": "ta",
    "telugu": "te",
    "bengali": "bn",
    "gujarati": "gu",
    "kannada": "kn",
    "malayalam": "ml",
    "punjabi": "pa",
    "french": "fr",
    "german": "de",
    "russian": "ru",
}

LANGUAGE_INSTRUCTION_MAP = {
    "en": "Respond in simple English.",
    "hi": "Respond only in simple Hindi.",
    "mr": "Respond only in simple Marathi.",
    "ta": "Respond only in simple Tamil.",
    "te": "Respond only in simple Telugu.",
    "bn": "Respond only in simple Bengali.",
    "gu": "Respond only in simple Gujarati.",
    "kn": "Respond only in simple Kannada.",
    "ml": "Respond only in simple Malayalam.",
    "pa": "Respond only in simple Punjabi.",
    "fr": "Respond only in simple French.",
    "de": "Respond only in simple German.",
    "ru": "Respond only in simple Russian.",
}

FALLBACK_MESSAGES = {
    "en": "I’m taking a short pause. Please try again in a moment.",
    "hi": "मैं थोड़ी देर के लिए रुक रहा हूँ। कृपया कुछ समय बाद फिर कोशिश करें।",
    "mr": "मी थोडा वेळ थांबत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
    "ta": "நான் சிறிது நேரம் இடைவேளை எடுக்கிறேன். தயவுசெய்து சிறிது நேரத்திற்குப் பிறகு முயற்சிக்கவும்.",
    "te": "నేను కొద్దిసేపు విరామం తీసుకుంటున్నాను. దయచేసి కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.",
    "bn": "আমি একটু বিরতি নিচ্ছি। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।",
    "gu": "હું થોડા સમય માટે વિરામ લઈ રહ્યો છું. કૃપા કરીને થોડા સમય પછી ફરી પ્રયત્ન કરો.",
    "kn": "ನಾನು ಸ್ವಲ್ಪ ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    "ml": "ഞാൻ അല്പസമയം ഇടവേള എടുക്കുന്നു. ദയവായി കുറച്ച് സമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കുക.",
    "pa": "ਮੈਂ ਥੋੜ੍ਹੀ ਦੇਰ ਲਈ ਰੁਕ ਰਿਹਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਸਮੇਂ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    "fr": "Je fais une petite pause. Veuillez réessayer dans un instant.",
    "de": "Ich mache eine kurze Pause. Bitte versuchen Sie es gleich noch einmal.",
    "ru": "Я делаю небольшой перерыв. Пожалуйста, попробуйте ещё раз чуть позже.",
}

GOODBYE_MESSAGES = {
    "en": "Take care. Wishing you good health and peace.",
    "hi": "अपना ध्यान रखें। आपको अच्छे स्वास्थ्य और शांति की शुभकामनाएँ।",
    "mr": "आपली काळजी घ्या. तुम्हाला चांगल्या आरोग्य आणि शांततेच्या शुभेच्छा.",
    "ta": "உங்களை கவனித்துக் கொள்ளுங்கள். நல்ல உடல்நலம் மற்றும் அமைதி உங்களுக்கு கிடைக்க வாழ்த்துக்கள்.",
    "te": "మీరు జాగ్రత్తగా ఉండండి. మీకు మంచి ఆరోగ్యం మరియు శాంతి కలగాలి.",
    "bn": "নিজের যত্ন নিন। আপনার সুস্বাস্থ্য এবং শান্তি কামনা করি।",
    "gu": "તમારું ધ્યાન રાખો. તમને સારા આરોગ્ય અને શાંતિની શુભકામનાઓ.",
    "kn": "ನಿಮ್ಮ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಗಮನ ಕೊಡಿ. ನಿಮಗೆ ಉತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಶಾಂತಿ ದೊರಕಲಿ.",
    "ml": "സ്വയം ശ്രദ്ധിക്കണം. നിങ്ങളുടെ നല്ല ആരോഗ്യത്തിനും മനശ്ശാന്തിക്കും ആശംസകൾ.",
    "pa": "ਆਪਣਾ ਧਿਆਨ ਰੱਖੋ। ਤੁਹਾਨੂੰ ਚੰਗੀ ਸਿਹਤ ਅਤੇ ਸ਼ਾਂਤੀ ਦੀਆਂ ਸ਼ੁਭਕਾਮਨਾਵਾਂ।",
    "fr": "Prenez soin de vous. Je vous souhaite une bonne santé et de la paix.",
    "de": "Passen Sie gut auf sich auf. Ich wünsche Ihnen gute Gesundheit und Frieden.",
    "ru": "Берегите себя. Желаю вам крепкого здоровья и душевного покоя.",
}

# ================= HELPERS =================
def clean_for_speech(text):
    text = re.sub(r'[*#_`~>|<={}\[\]();]', '', text)
    text = text.replace(":", ".")
    text = text.replace("-", " ")
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def speak_text(text, lang_code):
    try:
        clean_text = clean_for_speech(text)
        filename = f"voice_{uuid.uuid4()}.mp3"
        tts = gTTS(text=clean_text, lang=lang_code, slow=False)
        tts.save(filename)
        playsound.playsound(filename)
        os.remove(filename)
    except Exception:
        pass

def safe_text(text):
    if not text:
        return ""
    return text[:MAX_CHARS_PER_TURN]

# ================= OLLAMA / QWEN3 CALL =================
def ask_senior_care_bot(history, user_message, lang_code):
    if len(history) > MAX_TURNS:
        history[:] = history[-MAX_TURNS:]

    time.sleep(COOLDOWN_SECONDS)

    language_instruction = LANGUAGE_INSTRUCTION_MAP.get(
        lang_code, "Respond in simple English."
    )

    system_prompt = SYSTEM_INSTRUCTION + "\n\n" + language_instruction

    conv_lines = [system_prompt, ""]
    for turn in history:
        if turn["role"] == "user":
            conv_lines.append(f"User: {turn['text']}")
        else:
            conv_lines.append(f"Assistant: {turn['text']}")
    conv_lines.append(f"User: {user_message}")
    conv_lines.append("Assistant:")

    full_prompt = "\n".join(conv_lines)

    try:
        url = "http://localhost:11434/api/generate"
        payload = {
            "model": MODEL_NAME,
            "prompt": full_prompt,
            "stream": False,
            # let Qwen choose length; prompt already asks for concise answers
        }

        resp = requests.post(url, json=payload, timeout=120)
        resp.raise_for_status()
        data = resp.json()

        text = (data.get("response") or "").strip()
        if not text:
            return FALLBACK_MESSAGES.get(
                lang_code, "I’m taking a short pause. Please try again."
            )

        return text

    except Exception as e:
        print("Ollama / Qwen error:", repr(e))
        return FALLBACK_MESSAGES.get(
            lang_code, "I’m taking a short pause. Please try again."
        )

# ================= CLI CHAT =================
def run_cli_chat():
    print("\n=== SeniorCare Ally ===")
    print("A supportive AI companion for seniors and caregivers.\n")

    print("Available languages:")
    for lang in LANGUAGE_MAP:
        print("-", lang.capitalize())

    choice = input("\nChoose your language: ").strip().lower()
    lang_code = LANGUAGE_MAP.get(choice, "en")

    print("\nType 'exit' to quit.\n")

    history = []
    session_start = datetime.now().strftime("%Y-%m-%d %H:%M")

    history.append({
        "role": "user",
        "text": f"Conversation started at {session_start}.",
    })

    while True:
        user_message = input("You: ").strip()

        if user_message.lower() in {"exit", "quit"}:
            goodbye = GOODBYE_MESSAGES.get(
                lang_code, "Take care. Wishing you good health and peace."
            )
            print("\nSeniorCare Ally:", goodbye)
            speak_text(goodbye, lang_code)
            break

        if not user_message:
            continue

        history.append({"role": "user", "text": safe_text(user_message)})

        reply = ask_senior_care_bot(history, user_message, lang_code)
        history.append({"role": "model", "text": safe_text(reply)})

        print("\nSeniorCare Ally:", reply, "\n")
        speak_text(reply, lang_code)

# ================= RUN =================
if __name__ == "__main__":
    run_cli_chat()







