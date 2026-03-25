"""
Translation module for LinguaBot.

Uses deep-translator (free, no API key required) as primary engine.
Falls back to a mock reversal if the package is unavailable.

Install:  pip install deep-translator
"""

try:
    from deep_translator import GoogleTranslator
    TRANSLATOR_AVAILABLE = True
except ImportError:
    TRANSLATOR_AVAILABLE = False
    print("⚠️  deep-translator not installed. Using mock translation.")
    print("   Run: pip install deep-translator")


# Map our internal language codes to deep-translator / Google language codes
CODE_MAP = {
    "hi":  "hi",    # Hindi
    "bn":  "bn",    # Bengali
    "te":  "te",    # Telugu
    "mr":  "mr",    # Marathi
    "ta":  "ta",    # Tamil
    "ur":  "ur",    # Urdu
    "gu":  "gu",    # Gujarati
    "kn":  "kn",    # Kannada
    "ml":  "ml",    # Malayalam
    "pa":  "pa",    # Punjabi
    "or":  "or",    # Odia
    "as":  "as",    # Assamese
    "mai": "mai",   # Maithili (Google supports)
    "sat": "sat",   # Santali (limited support)
    "ks":  "ks",    # Kashmiri
    "ne":  "ne",    # Nepali
    "sd":  "sd",    # Sindhi
    "kok": "kok",   # Konkani (limited)
    "doi": "doi",   # Dogri (limited)
    "mni": "mni",   # Manipuri
    "bo":  "bo",    # Tibetan/Bodo (limited)
    "sa":  "sa",    # Sanskrit
}

# Sample translations used when the API is unavailable (demo / offline mode)
MOCK_TRANSLATIONS = {
    "hi": {
        "hello": "नमस्ते",
        "how are you": "आप कैसे हैं?",
        "thank you": "धन्यवाद",
        "good morning": "शुभ प्रभात",
        "goodbye": "अलविदा",
    },
    "ta": {
        "hello": "வணக்கம்",
        "how are you": "நீங்கள் எப்படி இருக்கிறீர்கள்?",
        "thank you": "நன்றி",
        "good morning": "காலை வணக்கம்",
    },
    "te": {
        "hello": "నమస్కారం",
        "how are you": "మీరు ఎలా ఉన్నారు?",
        "thank you": "ధన్యవాదాలు",
        "good morning": "శుభోదయం",
    },
    "ml": {
        "hello": "നമസ്കാരം",
        "how are you": "സുഖമാണോ?",
        "thank you": "നന്ദി",
        "good morning": "സുപ്രഭാതം",
    },
    "bn": {
        "hello": "নমস্কার",
        "how are you": "আপনি কেমন আছেন?",
        "thank you": "ধন্যবাদ",
        "good morning": "শুভ সকাল",
    },
    "or": {
        "hello": "ନମସ୍କାର",
        "how are you": "ଆପଣ କେମିତି ଅଛନ୍ତି?",
        "thank you": "ଧନ୍ୟବାଦ",
        "good morning": "ଶୁଭ ସକାଳ",
    },
}


def translate_text(text: str, target_code: str, lang_name: str, script: str) -> dict:
    """
    Translate `text` to the target language.

    Returns:
        dict with keys:
          - translated (str): translated text
          - romanized  (str): optional romanization hint
    """
    google_code = CODE_MAP.get(target_code, target_code)

    if TRANSLATOR_AVAILABLE:
        try:
            translator = GoogleTranslator(source="auto", target=google_code)
            translated = translator.translate(text)
            return {"translated": translated, "romanized": ""}
        except Exception as exc:
            # Fall through to mock on any error (rate limit, unsupported lang, etc.)
            print(f"Translator error for {target_code}: {exc}")

    # ── Offline / mock path ──────────────────────────────────────────────────
    text_lower = text.lower().strip()
    mock = MOCK_TRANSLATIONS.get(target_code, {})
    if text_lower in mock:
        return {"translated": mock[text_lower], "romanized": ""}

    # Generic fallback: annotate the text so the UI still shows something
    return {
        "translated": f"[{lang_name} / {script}] {text[::-1]}",  # reversed as placeholder
        "romanized": f"(install deep-translator for real translation)",
    }
