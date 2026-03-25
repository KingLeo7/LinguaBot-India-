from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Language(db.Model):
    __tablename__ = "languages"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    native_name = db.Column(db.String(50), nullable=False)
    script = db.Column(db.String(30), nullable=False)
    region = db.Column(db.String(100))
    speakers_millions = db.Column(db.Float)
    official_in = db.Column(db.String(200))
    sample_hello = db.Column(db.String(100))
    flag_emoji = db.Column(db.String(5), default="🇮🇳")

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "native_name": self.native_name,
            "script": self.script,
            "region": self.region,
            "speakers_millions": self.speakers_millions,
            "official_in": self.official_in,
            "sample_hello": self.sample_hello,
            "flag_emoji": self.flag_emoji,
        }

    @staticmethod
    def seed_indian_languages():
        if Language.query.count() > 0:
            return

        indian_languages = [
            {
                "code": "hi",
                "name": "Hindi",
                "native_name": "हिन्दी",
                "script": "Devanagari",
                "region": "Northern & Central India",
                "speakers_millions": 600.0,
                "official_in": "India (Official), Uttar Pradesh, Bihar, Rajasthan, MP, Haryana, Uttarakhand, HP, Jharkhand, Chhattisgarh, Delhi",
                "sample_hello": "नमस्ते",
                "flag_emoji": "🇮🇳",
            },
            {
                "code": "bn",
                "name": "Bengali",
                "native_name": "বাংলা",
                "script": "Bengali",
                "region": "West Bengal, Tripura",
                "speakers_millions": 230.0,
                "official_in": "West Bengal, Tripura, Bangladesh",
                "sample_hello": "নমস্কার",
                "flag_emoji": "🪷",
            },
            {
                "code": "te",
                "name": "Telugu",
                "native_name": "తెలుగు",
                "script": "Telugu",
                "region": "Andhra Pradesh, Telangana",
                "speakers_millions": 95.0,
                "official_in": "Andhra Pradesh, Telangana",
                "sample_hello": "నమస్కారం",
                "flag_emoji": "🌟",
            },
            {
                "code": "mr",
                "name": "Marathi",
                "native_name": "मराठी",
                "script": "Devanagari",
                "region": "Maharashtra",
                "speakers_millions": 83.0,
                "official_in": "Maharashtra, Goa",
                "sample_hello": "नमस्कार",
                "flag_emoji": "🟠",
            },
            {
                "code": "ta",
                "name": "Tamil",
                "native_name": "தமிழ்",
                "script": "Tamil",
                "region": "Tamil Nadu, Puducherry",
                "speakers_millions": 78.0,
                "official_in": "Tamil Nadu, Puducherry, Sri Lanka, Singapore",
                "sample_hello": "வணக்கம்",
                "flag_emoji": "🌺",
            },
            {
                "code": "ur",
                "name": "Urdu",
                "native_name": "اردو",
                "script": "Nastaliq (Perso-Arabic)",
                "region": "Jammu & Kashmir, Telangana, UP",
                "speakers_millions": 70.0,
                "official_in": "Jammu & Kashmir, Telangana, Pakistan",
                "sample_hello": "السلام علیکم",
                "flag_emoji": "🌙",
            },
            {
                "code": "gu",
                "name": "Gujarati",
                "native_name": "ગુજરાતી",
                "script": "Gujarati",
                "region": "Gujarat",
                "speakers_millions": 62.0,
                "official_in": "Gujarat, Dadra & Nagar Haveli, Daman & Diu",
                "sample_hello": "નમસ્તે",
                "flag_emoji": "💠",
            },
            {
                "code": "kn",
                "name": "Kannada",
                "native_name": "ಕನ್ನಡ",
                "script": "Kannada",
                "region": "Karnataka",
                "speakers_millions": 59.0,
                "official_in": "Karnataka",
                "sample_hello": "ನಮಸ್ಕಾರ",
                "flag_emoji": "⭐",
            },
            {
                "code": "ml",
                "name": "Malayalam",
                "native_name": "മലയാളം",
                "script": "Malayalam",
                "region": "Kerala, Lakshadweep",
                "speakers_millions": 38.0,
                "official_in": "Kerala, Lakshadweep, Puducherry",
                "sample_hello": "നമസ്കാരം",
                "flag_emoji": "🌴",
            },
            {
                "code": "pa",
                "name": "Punjabi",
                "native_name": "ਪੰਜਾਬੀ",
                "script": "Gurmukhi",
                "region": "Punjab, Haryana",
                "speakers_millions": 33.0,
                "official_in": "Punjab, Haryana, Delhi",
                "sample_hello": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
                "flag_emoji": "☀️",
            },
            {
                "code": "or",
                "name": "Odia",
                "native_name": "ଓଡ଼ିଆ",
                "script": "Odia",
                "region": "Odisha",
                "speakers_millions": 38.0,
                "official_in": "Odisha",
                "sample_hello": "ନମସ୍କାର",
                "flag_emoji": "🦚",
            },
            {
                "code": "as",
                "name": "Assamese",
                "native_name": "অসমীয়া",
                "script": "Bengali-Assamese",
                "region": "Assam",
                "speakers_millions": 15.0,
                "official_in": "Assam",
                "sample_hello": "নমস্কাৰ",
                "flag_emoji": "🌿",
            },
            {
                "code": "mai",
                "name": "Maithili",
                "native_name": "मैथिली",
                "script": "Devanagari / Tirhuta",
                "region": "Bihar, Jharkhand",
                "speakers_millions": 13.5,
                "official_in": "Bihar (recognized), 8th Schedule of India",
                "sample_hello": "प्रणाम",
                "flag_emoji": "🎋",
            },
            {
                "code": "sat",
                "name": "Santali",
                "native_name": "ᱥᱟᱱᱛᱟᱲᱤ",
                "script": "Ol Chiki",
                "region": "Jharkhand, Odisha, West Bengal",
                "speakers_millions": 7.6,
                "official_in": "8th Schedule of India",
                "sample_hello": "जोhar",
                "flag_emoji": "🌾",
            },
            {
                "code": "ks",
                "name": "Kashmiri",
                "native_name": "कॉशुर",
                "script": "Sharada / Nastaliq",
                "region": "Jammu & Kashmir",
                "speakers_millions": 7.1,
                "official_in": "Jammu & Kashmir",
                "sample_hello": "اداب",
                "flag_emoji": "❄️",
            },
            {
                "code": "ne",
                "name": "Nepali",
                "native_name": "नेपाली",
                "script": "Devanagari",
                "region": "Sikkim, West Bengal",
                "speakers_millions": 16.0,
                "official_in": "Sikkim, Nepal",
                "sample_hello": "नमस्ते",
                "flag_emoji": "⛰️",
            },
            {
                "code": "sd",
                "name": "Sindhi",
                "native_name": "سنڌي",
                "script": "Perso-Arabic / Devanagari",
                "region": "Gujarat, Rajasthan",
                "speakers_millions": 5.8,
                "official_in": "8th Schedule of India",
                "sample_hello": "सत श्री अकाल",
                "flag_emoji": "🏺",
            },
            {
                "code": "kok",
                "name": "Konkani",
                "native_name": "कोंकणी",
                "script": "Devanagari",
                "region": "Goa, coastal Karnataka & Maharashtra",
                "speakers_millions": 7.4,
                "official_in": "Goa",
                "sample_hello": "देव बरें करूं",
                "flag_emoji": "🌊",
            },
            {
                "code": "doi",
                "name": "Dogri",
                "native_name": "डोगरी",
                "script": "Devanagari / Takri",
                "region": "Jammu region",
                "speakers_millions": 2.6,
                "official_in": "Jammu & Kashmir, 8th Schedule",
                "sample_hello": "नमस्ते",
                "flag_emoji": "🏔️",
            },
            {
                "code": "mni",
                "name": "Manipuri (Meitei)",
                "native_name": "মৈতৈলোন্",
                "script": "Meitei Mayek / Bengali",
                "region": "Manipur",
                "speakers_millions": 1.8,
                "official_in": "Manipur",
                "sample_hello": "হায়",
                "flag_emoji": "🌸",
            },
            {
                "code": "bo",
                "name": "Bodo",
                "native_name": "बड़ो",
                "script": "Devanagari",
                "region": "Assam (BTAD)",
                "speakers_millions": 1.4,
                "official_in": "Assam (8th Schedule)",
                "sample_hello": "नमस्कार",
                "flag_emoji": "🐘",
            },
            {
                "code": "sa",
                "name": "Sanskrit",
                "native_name": "संस्कृतम्",
                "script": "Devanagari",
                "region": "Classical / all of India",
                "speakers_millions": 0.025,
                "official_in": "Uttarakhand (2nd official), 8th Schedule",
                "sample_hello": "नमस्ते",
                "flag_emoji": "📿",
            },
        ]

        for lang_data in indian_languages:
            lang = Language(**lang_data)
            db.session.add(lang)

        db.session.commit()
        print(f"✅ Seeded {len(indian_languages)} Indian languages.")


class TranslationLog(db.Model):
    __tablename__ = "translation_logs"

    id = db.Column(db.Integer, primary_key=True)
    source_text = db.Column(db.Text, nullable=False)
    translated_text = db.Column(db.Text, nullable=False)
    target_lang_code = db.Column(db.String(10), nullable=False)
    target_lang_name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "source_text": self.source_text,
            "translated_text": self.translated_text,
            "target_lang_code": self.target_lang_code,
            "target_lang_name": self.target_lang_name,
            "created_at": self.created_at.isoformat(),
        }
