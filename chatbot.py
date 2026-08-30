import os

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

def generate_chat_response(message: str, lang_name: str, history: list = None) -> str:
    """
    Generate an AI response strictly in the specified Indian language.
    """
    if history is None:
        history = []
        
    openai_key = os.environ.get("OPENAI_API_KEY")
    google_key = os.environ.get("GOOGLE_API_KEY")

    # ── OpenAI path (Primary) ────────────────────────────────────────────────
    if OPENAI_AVAILABLE and openai_key:
        try:
            client = OpenAI(api_key=openai_key)
            
            system_instructions = (
                f"You are Vachana, an intelligent and conversational AI assistant. "
                f"Your job is to directly ANSWER the user's questions and hold a natural conversation. "
                f"CRITICAL RULE: DO NOT simply translate the user's message! You must respond to them intelligently. "
                f"No matter what language the user speaks in, your response MUST be written fluently in the {lang_name} language."
            )
            
            messages = [{"role": "system", "content": system_instructions}]
            for h in history:
                messages.append({"role": h["role"], "content": h["content"]})
            messages.append({"role": "user", "content": message})
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API Error: {e}", flush=True)
            # fallback to Gemini if possible

    # ── Google Gemini path (Secondary) ───────────────────────────────────────
    if GENAI_AVAILABLE and google_key:
        genai.configure(api_key=google_key)
        
        system_instructions = (
            f"You are Vachana, an intelligent and conversational AI assistant. "
            f"Your job is to directly ANSWER the user's questions and hold a natural conversation. "
            f"CRITICAL RULE: DO NOT simply translate the user's message! You must respond to them intelligently. "
            f"No matter what language the user speaks in, your response MUST be written fluently in the {lang_name} language."
        )
        
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_instructions
        )
        
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

    # ── Offline / Mock path ──────────────────────────────────────────────────
    print("Using Mock AI Chat Response")
    text_lower = message.lower().strip()
    
    if "hello" in text_lower or "hi" in text_lower or "नमस्ते" in text_lower:
        return f"[{lang_name} AI] Greetings! I am Vachana. How can I help you today? (To enable real AI, ensure OpenAI or Google API keys are set in .env)"
        
    if "who are you" in text_lower:
        return f"[{lang_name} AI] I am Vachana, an AI representation of India's diverse languages!"

    return f"[{lang_name} AI] This is a mock AI response. You said: '{message}'. Install 'openai' or 'google-generativeai' and set keys to enable the real AI Chatbot!"
