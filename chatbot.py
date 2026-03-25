import os

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    print("⚠️  google-generativeai not installed. Using mock chat.")
    print("   Run: pip install google-generativeai")

def generate_chat_response(message: str, lang_name: str, history: list = None) -> str:
    """
    Generate an AI response strictly in the specified Indian language.
    """
    if history is None:
        history = []
        
    api_key = os.environ.get("GOOGLE_API_KEY")
    if GENAI_AVAILABLE and api_key:
        genai.configure(api_key=api_key)
        
        system_instructions = (
            f"You are LinguaBot India, an intelligent and conversational AI assistant. "
            f"Your job is to directly ANSWER the user's questions and hold a natural conversation. "
            f"CRITICAL RULE: DO NOT simply translate the user's message! You must respond to them intelligently. "
            f"No matter what language the user speaks in, your response MUST be written fluently in the {lang_name} language."
        )
        
        # Use gemini-2.5-flash which is supported by the user's API key
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_instructions
        )
        
        # Convert our history format to Gemini format
        formatted_messages = []
        for h in history: 
            role = "user" if h["role"] == "user" else "model"
            formatted_messages.append({"role": role, "parts": [h["content"]]})
        
        formatted_messages.append({"role": "user", "parts": [message]})
        
        try:
            response = model.generate_content(formatted_messages)
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}", flush=True)
            return "माफ़ करें, मुझे कुछ तकनीकी समस्या आ रही है। (Sorry, I am facing a technical issue.)"

    # ── Offline / Mock path ──────────────────────────────────────────────────
    print("Using Mock AI Chat Response")
    text_lower = message.lower().strip()
    
    if "hello" in text_lower or "hi" in text_lower or "नमस्ते" in text_lower:
        return f"[{lang_name} AI] Greetings! I am LinguaBot. How can I help you today? (To enable real AI, set GOOGLE_API_KEY environment variable.)"
        
    if "who are you" in text_lower:
        return f"[{lang_name} AI] I am LinguaBot, an AI representation of India's diverse languages!"

    # Generic fallback mock response
    return f"[{lang_name} AI] This is a mock AI response. You said: '{message}'. Run 'pip install google-generativeai' and set your GOOGLE_API_KEY to enable the real AI Chatbot!"
