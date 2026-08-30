# Vachana 🇮🇳

A full-stack translation app for all Indian languages with a beautiful light-blue glassmorphism UI.

---

## 📁 Project Structure

```
backend/
  app.py           ← Flask API server
  database.py      ← SQLAlchemy models + 22 Indian language seed data
  translator.py    ← Translation engine (deep-translator / Google)
  requirements.txt

frontend/
  Vachana.jsx  ← React component (drop into your Vite/CRA app)
```

---

## 🐍 Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
# → Server running at http://localhost:5000
```

The SQLite database (`vachana.db`) is created automatically on first run,
and all 22 Indian languages are seeded instantly.

---

## ⚛️ Frontend Setup

```bash
# Add the .jsx file to your React project's src/
# Install DM Sans font (already loaded via Google Fonts in the component)

# Run your React app
npm run dev
```

Make sure the API URL in `Vachana.jsx` matches your backend:
```js
const API = "http://localhost:5000/api";
```

---

## 🌐 API Endpoints

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/api/languages`          | List all Indian languages          |
| GET    | `/api/languages/<code>`   | Get a single language by code      |
| POST   | `/api/translate`          | Translate text                     |
| GET    | `/api/history`            | Get last 20 translations           |
| DELETE | `/api/history`            | Clear translation history          |

### POST `/api/translate` body:
```json
{
  "text": "Hello, how are you?",
  "target_lang": "hi"
}
```

### Response:
```json
{
  "translated": "नमस्ते, आप कैसे हैं?",
  "romanized": "",
  "language": {
    "code": "hi",
    "name": "Hindi",
    "native_name": "हिन्दी",
    "script": "Devanagari",
    "speakers_millions": 600,
    ...
  }
}
```

---

## 🗣️ Supported Indian Languages (22)

| Code  | Language     | Script              | Speakers  |
|-------|-------------|---------------------|-----------|
| hi    | Hindi        | Devanagari          | 600M      |
| bn    | Bengali      | Bengali             | 230M      |
| te    | Telugu       | Telugu              | 95M       |
| mr    | Marathi      | Devanagari          | 83M       |
| ta    | Tamil        | Tamil               | 78M       |
| ur    | Urdu         | Nastaliq            | 70M       |
| gu    | Gujarati     | Gujarati            | 62M       |
| kn    | Kannada      | Kannada             | 59M       |
| ml    | Malayalam    | Malayalam           | 38M       |
| or    | Odia         | Odia                | 38M       |
| pa    | Punjabi      | Gurmukhi            | 33M       |
| ne    | Nepali       | Devanagari          | 16M       |
| as    | Assamese     | Bengali-Assamese    | 15M       |
| mai   | Maithili     | Devanagari/Tirhuta  | 13.5M     |
| sat   | Santali      | Ol Chiki            | 7.6M      |
| kok   | Konkani      | Devanagari          | 7.4M      |
| ks    | Kashmiri     | Sharada/Nastaliq    | 7.1M      |
| sd    | Sindhi       | Perso-Arabic        | 5.8M      |
| mni   | Manipuri     | Meitei Mayek        | 1.8M      |
| doi   | Dogri        | Devanagari          | 2.6M      |
| bo    | Bodo         | Devanagari          | 1.4M      |
| sa    | Sanskrit     | Devanagari          | Classical |

---

## 🔧 Translation Engine

- **Primary**: `deep-translator` (free, wraps Google Translate — no API key needed)
- **Fallback**: Built-in mock translations for common phrases when offline
- To enable real translation: `pip install deep-translator` (already in requirements.txt)
