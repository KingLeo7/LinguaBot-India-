const { useState, useRef, useEffect } = React;

const API = "http://localhost:5000/api";

// ── Inline styles / design tokens ────────────────────────────────────────────
const C = {
  skyDeep:    "#0EA5E9",
  skyMid:     "#38BDF8",
  skyLight:   "#BAE6FD",
  skyPale:    "#E0F2FE",
  skyGhost:   "#F0F9FF",
  white:      "#FFFFFF",
  slate700:   "#334155",
  slate500:   "#64748B",
  slate300:   "#CBD5E1",
  accent:     "#0284C7",
  gold:       "#F59E0B",
};

const glass = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(18px) saturate(160%)",
  WebkitBackdropFilter: "blur(18px) saturate(160%)",
  border: "1px solid rgba(186,230,253,0.6)",
  borderRadius: 20,
};

const cardStyle = {
  ...glass,
  padding: "1.5rem",
  boxShadow: "0 8px 32px rgba(14,165,233,0.12), 0 1px 0 rgba(255,255,255,0.8) inset",
};

// ── Particle background ──────────────────────────────────────────────────────
function Bubbles() {
  const bubbles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 20 + (i * 17) % 80,
    left: (i * 37 + 5) % 95,
    delay: (i * 0.7) % 8,
    dur: 8 + (i * 1.3) % 10,
    opacity: 0.08 + (i % 5) * 0.03,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(110vh) scale(0.8); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1.1); opacity: 0; }
        }
        @keyframes shimmer {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes waveBar {
          0%,100% { height: 4px; }
          50%     { height: 26px; }
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.3); border-radius: 99px; }
        textarea::placeholder { color: #94A3B8; }
        textarea { caret-color: #0EA5E9; }
      `}</style>
      {bubbles.map(b => (
        <div key={b.id} style={{
          position: "absolute",
          bottom: 0,
          left: `${b.left}%`,
          width: b.size,
          height: b.size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, rgba(186,230,253,${b.opacity * 2}), rgba(14,165,233,${b.opacity}))`,
          border: `1px solid rgba(56,189,248,${b.opacity * 1.5})`,
          animation: `floatUp ${b.dur}s ${b.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Wave visualizer ──────────────────────────────────────────────────────────
function WaveViz({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 32 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{
          width: 3,
          borderRadius: 99,
          background: active ? C.skyDeep : C.skyLight,
          animation: active ? `waveBar ${0.5 + (i % 5) * 0.12}s ${i * 0.05}s ease-in-out infinite alternate` : "none",
          height: active ? undefined : 5,
          minHeight: 4,
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}

// ── Language card (in selector grid) ────────────────────────────────────────
function LangChip({ lang, selected, onSelect }) {
  return (
    <button onClick={() => onSelect(lang.code)} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, padding: "10px 8px", borderRadius: 14,
      border: selected
        ? `2px solid ${C.skyDeep}`
        : "1.5px solid rgba(186,230,253,0.5)",
      background: selected
        ? `linear-gradient(135deg, rgba(14,165,233,0.15), rgba(56,189,248,0.1))`
        : "rgba(255,255,255,0.5)",
      cursor: "pointer", transition: "all 0.2s",
      minWidth: 72,
      boxShadow: selected ? `0 0 0 3px rgba(14,165,233,0.15)` : "none",
    }}>
      <span style={{ fontSize: 20 }}>{lang.flag_emoji || "🇮🇳"}</span>
      <span style={{
        fontSize: 11, fontWeight: 600, color: selected ? C.accent : C.slate500,
        letterSpacing: "0.02em", textAlign: "center", lineHeight: 1.2,
      }}>{lang.name}</span>
      <span style={{
        fontSize: 13, color: selected ? C.skyDeep : C.slate300,
      }}>{lang.native_name}</span>
    </button>
  );
}

// ── History entry ────────────────────────────────────────────────────────────
function HistoryItem({ item }) {
  const d = new Date(item.created_at);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{
      padding: "0.9rem 1rem",
      borderRadius: 12,
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(186,230,253,0.5)",
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>
          → {item.target_lang_name}
        </span>
        <span style={{ fontSize: 11, color: C.slate500 }}>{time}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: C.slate700, marginBottom: 3 }}>
        {item.source_text.length > 60 ? item.source_text.slice(0, 57) + "…" : item.source_text}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: C.skyDeep, fontWeight: 500 }}>
        {item.translated_text.length > 60 ? item.translated_text.slice(0, 57) + "…" : item.translated_text}
      </p>
    </div>
  );
}

// ── Tab pill ─────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 18px", borderRadius: 99,
      background: active ? C.skyDeep : "transparent",
      color: active ? C.white : C.slate500,
      border: active ? "none" : "1px solid rgba(186,230,253,0.4)",
      fontFamily: "inherit", fontSize: 13, fontWeight: 600,
      cursor: "pointer", transition: "all 0.2s",
      display: "flex", alignItems: "center", gap: 6,
    }}>
      {label}
      {badge > 0 && (
        <span style={{
          background: active ? "rgba(255,255,255,0.3)" : C.skyLight,
          color: active ? C.white : C.accent,
          borderRadius: 99, fontSize: 10, padding: "1px 6px", fontWeight: 700,
        }}>{badge}</span>
      )}
    </button>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
function LinguaBotIndia() {
  const [tab, setTab] = useState("translate");
  const [languages, setLanguages] = useState([]);
  const [targetLang, setTargetLang] = useState("hi");
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [langInfo, setLangInfo] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  
  // Chatbot state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  // Load languages
  useEffect(() => {
    fetch(`${API}/languages`)
      .then(r => r.json())
      .then(setLanguages)
      .catch(() => {
        // Offline demo data
        setLanguages([
          { code:"hi", name:"Hindi",     native_name:"हिन्दी",    script:"Devanagari",     region:"Northern India",        speakers_millions:600, flag_emoji:"🇮🇳", sample_hello:"नमस्ते",     official_in:"UP, Bihar, Delhi…" },
          { code:"bn", name:"Bengali",   native_name:"বাংলা",     script:"Bengali",        region:"West Bengal, Tripura",   speakers_millions:230, flag_emoji:"🪷",  sample_hello:"নমস্কার",   official_in:"West Bengal, Tripura" },
          { code:"te", name:"Telugu",    native_name:"తెలుగు",    script:"Telugu",         region:"Andhra, Telangana",      speakers_millions:95,  flag_emoji:"🌟",  sample_hello:"నమస్కారం",  official_in:"AP, Telangana" },
          { code:"mr", name:"Marathi",   native_name:"मराठी",     script:"Devanagari",     region:"Maharashtra",           speakers_millions:83,  flag_emoji:"🟠",  sample_hello:"नमस्कार",    official_in:"Maharashtra, Goa" },
          { code:"ta", name:"Tamil",     native_name:"தமிழ்",     script:"Tamil",          region:"Tamil Nadu, Puducherry", speakers_millions:78,  flag_emoji:"🌺",  sample_hello:"வணக்கம்",   official_in:"TN, Puducherry" },
          { code:"ur", name:"Urdu",      native_name:"اردو",      script:"Nastaliq",       region:"J&K, UP, Telangana",    speakers_millions:70,  flag_emoji:"🌙",  sample_hello:"السلام علیکم", official_in:"J&K, Telangana" },
          { code:"gu", name:"Gujarati",  native_name:"ગુજરાતી",   script:"Gujarati",       region:"Gujarat",               speakers_millions:62,  flag_emoji:"💠",  sample_hello:"નમસ્તે",    official_in:"Gujarat" },
          { code:"kn", name:"Kannada",   native_name:"ಕನ್ನಡ",    script:"Kannada",        region:"Karnataka",             speakers_millions:59,  flag_emoji:"⭐",  sample_hello:"ನಮಸ್ಕಾರ",   official_in:"Karnataka" },
          { code:"ml", name:"Malayalam", native_name:"മലയാളം",    script:"Malayalam",      region:"Kerala",                speakers_millions:38,  flag_emoji:"🌴",  sample_hello:"നമസ്കാരം",  official_in:"Kerala, Lakshadweep" },
          { code:"pa", name:"Punjabi",   native_name:"ਪੰਜਾਬੀ",   script:"Gurmukhi",       region:"Punjab, Haryana",       speakers_millions:33,  flag_emoji:"☀️",  sample_hello:"ਸਤ ਸ੍ਰੀ ਅਕਾਲ", official_in:"Punjab, Haryana" },
          { code:"or", name:"Odia",      native_name:"ଓଡ଼ିଆ",    script:"Odia",           region:"Odisha",                speakers_millions:38,  flag_emoji:"🦚",  sample_hello:"ନମସ୍କାର",   official_in:"Odisha" },
          { code:"as", name:"Assamese",  native_name:"অসমীয়া",   script:"Bengali-Assamese",region:"Assam",               speakers_millions:15,  flag_emoji:"🌿",  sample_hello:"নমস্কাৰ",   official_in:"Assam" },
          { code:"ne", name:"Nepali",    native_name:"नेपाली",    script:"Devanagari",     region:"Sikkim, WB",            speakers_millions:16,  flag_emoji:"⛰️",  sample_hello:"नमस्ते",     official_in:"Sikkim" },
          { code:"sa", name:"Sanskrit",  native_name:"संस्कृतम्", script:"Devanagari",     region:"Classical / All India", speakers_millions:0.025, flag_emoji:"📿", sample_hello:"नमस्ते",  official_in:"Uttarakhand" },
        ]);
      });
  }, []);

  const loadHistory = () => {
    fetch(`${API}/history`).then(r => r.json()).then(setHistory).catch(() => {});
  };

  useEffect(() => { if (tab === "history") loadHistory(); }, [tab]);

  useEffect(() => { if (tab === "history") loadHistory(); }, [tab]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current && tab === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatLoading, tab]);

  const selectedLang = languages.find(l => l.code === targetLang);
  const filtered = languages.filter(l =>
    !searchQ || l.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    l.native_name.includes(searchQ) || (l.region || "").toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true); setTranslated(null);
    try {
      const res = await fetch(`${API}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_lang: targetLang }),
      });
      const data = await res.json();
      setTranslated(data);
    } catch {
      // Demo fallback
      await new Promise(r => setTimeout(r, 800));
      setTranslated({
        translated: selectedLang?.sample_hello
          ? `${selectedLang.sample_hello} — ${text.split("").reverse().join("")}`
          : text.split("").reverse().join(""),
        romanized: "(demo mode — backend offline)",
        language: selectedLang,
      });
    }
    setLoading(false);
  };

  // Helper for text-to-speech with a fallback for unsupported languages
  const playTTS = (textToSpeak, langCode) => {
    if (!textToSpeak) return;
    window.speechSynthesis.cancel();
    
    // Sometimes voices are not loaded initially
    let voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    let expectedLang = langCode === 'ur' ? 'ur-PK' : langCode + '-IN';
    
    // Check if the exact language exists on the OS/Browser
    const isSupported = voices.some(v => v.lang.toLowerCase().includes(langCode.toLowerCase()));
    
    if (isSupported) {
      utterance.lang = expectedLang;
    } else if (voices.length > 0) {
      // Fallback: Use Indian English, Hindi, or the default voice so it's not silent
      const fallback = voices.find(v => v.lang.includes('hi')) || 
                       voices.find(v => v.lang.includes('en-IN')) || 
                       voices[0];
      utterance.voice = fallback;
    } else {
      // If voices list is empty (can happen on initial load), just set lang and hope the browser handles it
      utterance.lang = expectedLang;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          target_lang: targetLang,
          history: chatHistory.slice(-5) // Send last 5 msgs for context
        }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "model", content: data.response || "Error generating response." }]);
    } catch {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: "model", content: "Error: Backend is offline." }]);
        setChatLoading(false);
      }, 1000);
      return;
    }
    setChatLoading(false);
  };

  const handleVoice = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (!recording) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;

      recognition.onstart = () => setRecording(true);
      
      recognition.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        setText(transcript);
      };

      recognition.onerror = () => setRecording(false);
      recognition.onend = () => setRecording(false);

      mediaRef.current = recognition;
      recognition.start();
    } else {
      if (mediaRef.current) mediaRef.current.stop();
      setRecording(false);
    }
  };

  const handleCopy = () => {
    if (!translated) return;
    navigator.clipboard.writeText(translated.translated);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translated || !translated.translated) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    playTTS(translated.translated, targetLang);
  };

  const handleClearHistory = async () => {
    await fetch(`${API}/history`, { method: "DELETE" }).catch(() => {});
    setHistory([]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, #E0F2FE 0%, #BAE6FD 30%, #7DD3FC 60%, #38BDF8 100%)`,
      fontFamily: "'DM Sans', 'Nunito', sans-serif",
      padding: "2rem 1rem 4rem",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Bubbles />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto" }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "2rem", animation: "slideIn 0.6s ease" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.6)", borderRadius: 99,
            padding: "6px 18px", border: "1px solid rgba(186,230,253,0.8)",
            marginBottom: "0.75rem", backdropFilter: "blur(10px)",
          }}>
            <span style={{ fontSize: 14 }}>🇮🇳</span>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.08em" }}>
              INDIA'S LANGUAGE UNIVERSE
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(2rem,6vw,3.2rem)", fontWeight: 700, margin: "0 0 6px",
            color: "#0C4A6E", letterSpacing: "-0.03em",
            textShadow: "0 2px 20px rgba(255,255,255,0.6)",
          }}>
            LinguaBot <span style={{ color: C.skyDeep }}>India</span>
          </h1>
          <p style={{ color: "#0369A1", fontSize: 15, margin: 0 }}>
            {languages.length} Indian languages · Voice + Text translation
          </p>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 8, marginBottom: "1.5rem",
          justifyContent: "center",
          ...glass, padding: "8px", width: "fit-content", margin: "0 auto 1.5rem",
        }}>
          <Tab label="Translate" active={tab === "translate"} onClick={() => setTab("translate")} />
          <Tab label="Chatbot AI" active={tab === "chat"} onClick={() => setTab("chat")} />
          <Tab label="Languages" active={tab === "languages"} onClick={() => setTab("languages")} badge={languages.length} />
          <Tab label="History"   active={tab === "history"}   onClick={() => setTab("history")}   badge={history.length} />
        </div>

        {/* ══ TAB: TRANSLATE ═══════════════════════════════════════════════ */}
        {tab === "translate" && (
          <div style={{ animation: "slideIn 0.4s ease" }}>

            {/* Language scroll row */}
            <div style={{
              ...glass, padding: "1rem",
              marginBottom: "1rem",
              overflowX: "auto",
            }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: C.slate500, fontWeight: 600, letterSpacing: "0.07em" }}>
                TRANSLATE TO
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {languages.map(l => (
                  <LangChip key={l.code} lang={l} selected={targetLang === l.code} onSelect={setTargetLang} />
                ))}
              </div>
            </div>

            {/* Input + output columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

              {/* Input card */}
              <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: C.slate500, fontWeight: 600, letterSpacing: "0.07em" }}>ENGLISH</span>
                  <span style={{ fontSize: 11, color: text.length > 450 ? "#EF4444" : C.slate300 }}>{text.length}/500</span>
                </div>
                <textarea
                  rows={6}
                  value={text}
                  onChange={e => e.target.value.length <= 500 && setText(e.target.value)}
                  placeholder="Type your text here…"
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    outline: "none", color: C.slate700, fontSize: 15, lineHeight: 1.7,
                    resize: "none", fontFamily: "inherit",
                  }}
                />
                {/* Voice strip */}
                <div style={{
                  padding: "8px 10px", borderRadius: 10,
                  background: "rgba(186,230,253,0.3)",
                  border: "1px solid rgba(186,230,253,0.5)",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <button onClick={handleVoice} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: recording ? "1.5px solid #EF4444" : `1.5px solid ${C.skyDeep}`,
                    background: recording ? "rgba(239,68,68,0.1)" : "rgba(14,165,233,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, transition: "all 0.2s",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      {recording
                        ? <rect x="6" y="6" width="12" height="12" rx="2" fill="#EF4444"/>
                        : <>
                          <rect x="9" y="2" width="6" height="13" rx="3" fill={C.skyDeep}/>
                          <path d="M5 10v2a7 7 0 0014 0v-2" stroke={C.skyDeep} strokeWidth="2" strokeLinecap="round"/>
                          <line x1="12" y1="19" x2="12" y2="23" stroke={C.skyDeep} strokeWidth="2" strokeLinecap="round"/>
                        </>
                      }
                    </svg>
                  </button>
                  <WaveViz active={recording} />
                  {recording && <span style={{ fontSize: 11, color: "#EF4444", animation: "pulse2 1s infinite", marginLeft: "auto" }}>REC</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleTranslate}
                    disabled={!text.trim() || loading}
                    style={{
                      flex: 1, padding: "9px", borderRadius: 10, border: "none",
                      background: !text.trim() ? C.skyLight : `linear-gradient(135deg, ${C.skyDeep}, ${C.skyMid})`,
                      color: !text.trim() ? C.slate300 : C.white,
                      fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                      cursor: text.trim() && !loading ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      transition: "all 0.2s",
                    }}
                  >
                    {loading
                      ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Translating…</>
                      : <>Translate {selectedLang?.flag_emoji} {selectedLang?.name}</>
                    }
                  </button>
                  <button onClick={() => { setText(""); setTranslated(null); }} style={{
                    padding: "9px 12px", borderRadius: 10,
                    border: `1px solid ${C.skyLight}`, background: "rgba(255,255,255,0.5)",
                    color: C.slate500, cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  }}>✕</button>
                </div>
              </div>

              {/* Output card */}
              <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: "0.07em" }}>
                    {selectedLang ? `${selectedLang.flag_emoji} ${selectedLang.name.toUpperCase()} · ${selectedLang.script}` : "OUTPUT"}
                  </span>
                  {translated && (
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={handleSpeak} style={{
                        background: "none", border: "none", color: speaking ? C.skyDeep : "black",
                        cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 3,
                        fontFamily: "inherit", transition: "color 0.2s",
                      }}>
                        {speaking ? "🔊 Speaking..." : "🔈 Speak"}
                      </button>
                      <button onClick={handleCopy} style={{
                        background: "none", border: "none", color: copied ? C.skyDeep : C.slate300,
                        cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 3,
                        fontFamily: "inherit", transition: "color 0.2s",
                      }}>
                        {copied ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>

                {loading && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: C.skyDeep,
                          animation: `pulse2 1s ${i*0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 13, color: C.slate500 }}>Translating…</span>
                  </div>
                )}

                {!loading && translated && (
                  <div style={{ flex: 1, animation: "slideIn 0.4s ease" }}>
                    <p style={{ fontSize: 22, color: C.slate700, lineHeight: 1.6, margin: "0 0 8px", fontWeight: 500 }}>
                      {translated.translated}
                    </p>
                    {translated.romanized && (
                      <p style={{ fontSize: 13, color: C.slate500, fontStyle: "italic", margin: "0 0 12px" }}>
                        {translated.romanized}
                      </p>
                    )}
                    {selectedLang && (
                      <div style={{
                        marginTop: "auto", padding: "8px 10px", borderRadius: 10,
                        background: "rgba(186,230,253,0.3)", border: "1px solid rgba(186,230,253,0.5)",
                      }}>
                        <p style={{ margin: 0, fontSize: 11, color: C.accent, fontWeight: 600 }}>
                          {selectedLang.region} · {selectedLang.speakers_millions}M speakers
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!loading && !translated && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0.4 }}>
                    <span style={{ fontSize: 32 }}>{selectedLang?.flag_emoji || "🌐"}</span>
                    <span style={{ fontSize: 13, color: C.slate500, textAlign: "center" }}>
                      Translation will appear here
                    </span>
                    {selectedLang && (
                      <span style={{ fontSize: 18, color: C.skyDeep }}>{selectedLang.sample_hello}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: CHAT ════════════════════════════════════════════════════ */}
        {tab === "chat" && (
          <div style={{ animation: "slideIn 0.4s ease" }}>
            <div style={{
              ...glass, padding: "1rem",
              marginBottom: "1rem",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <p style={{ margin: 0, fontSize: 13, color: C.slate700, fontWeight: 600 }}>
                LinguaBot is currently conversing in: 
                <span style={{ color: C.skyDeep, marginLeft: 8, fontSize: 16 }}>
                  {selectedLang?.flag_emoji} {selectedLang?.name}
                </span>
              </p>
              <button 
                onClick={() => setTab("translate")}
                style={{
                  background: "transparent", border: `1px solid ${C.skyDeep}`, color: C.skyDeep,
                  padding: "4px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer", fontWeight: 600
                }}
              >
                Change Language
              </button>
            </div>

            <div style={{ ...cardStyle, height: "450px", display: "flex", flexDirection: "column" }}>
              {/* Chat Viewport */}
              <div style={{ flex: 1, overflowY: "auto", paddingRight: 10, display: "flex", flexDirection: "column", gap: 12 }}>
                
                {chatHistory.length === 0 && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
                    <span style={{ fontSize: 40 }}>{selectedLang?.flag_emoji || "🤖"}</span>
                    <p style={{ marginTop: 10, fontSize: 14, color: C.slate700 }}>Say Hello in {selectedLang?.name || "English"}!</p>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div key={i} style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    display: "flex", flexDirection: "column", gap: 4,
                  }}>
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: 16,
                      borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                      borderBottomLeftRadius: msg.role === "model" ? 4 : 16,
                      background: msg.role === "user" ? `linear-gradient(135deg, ${C.skyDeep}, ${C.skyMid})` : "rgba(255,255,255,0.7)",
                      color: msg.role === "user" ? C.white : C.slate700,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      border: msg.role === "model" ? "1px solid rgba(186,230,253,0.5)" : "none",
                      animation: "fadeIn 0.3s ease",
                    }}>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{msg.content}</p>
                    </div>
                    {msg.role === "model" && (
                      <button 
                        onClick={() => playTTS(msg.content, targetLang)}
                        style={{
                          background: "none", border: "none", color: C.skyDeep,
                          cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4,
                          fontFamily: "inherit", alignSelf: "flex-start", padding: "0 4px"
                        }}
                      >
                       🔊 Speak
                      </button>
                    )}
                  </div>
                ))}
                
                {chatLoading && (
                  <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: 16, background: "rgba(255,255,255,0.5)", display: "flex", gap: 4 }}>
                     {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: C.skyDeep, animation: `pulse2 1s ${j*0.2}s infinite` }} />)}
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendChat()}
                  placeholder={`Message LinguaBot in ${selectedLang?.name || "English..."}`}
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 99,
                    border: `1.5px solid rgba(186,230,253,0.8)`, background: "rgba(255,255,255,0.8)",
                    color: C.slate700, fontSize: 14, fontFamily: "inherit", outline: "none",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
                  }}
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  style={{
                    width: 44, height: 44, borderRadius: "50%", border: "none",
                    background: chatInput.trim() && !chatLoading ? `linear-gradient(135deg, ${C.skyDeep}, ${C.skyMid})` : C.slate300,
                    color: C.white, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: chatInput.trim() && !chatLoading ? "pointer" : "not-allowed",
                    transition: "all 0.2s"
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: LANGUAGES ════════════════════════════════════════════════ */}
        {tab === "languages" && (
          <div style={{ animation: "slideIn 0.4s ease" }}>
            <div style={{ ...glass, padding: "1rem", marginBottom: "1rem" }}>
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search languages, scripts, regions…"
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 10,
                  border: `1.5px solid ${C.skyLight}`, background: "rgba(255,255,255,0.7)",
                  color: C.slate700, fontSize: 14, fontFamily: "inherit", outline: "none",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {filtered.map(lang => (
                <div
                  key={lang.code}
                  onClick={() => setLangInfo(langInfo?.code === lang.code ? null : lang)}
                  style={{
                    ...cardStyle, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
                    border: langInfo?.code === lang.code ? `2px solid ${C.skyDeep}` : cardStyle.border,
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{lang.flag_emoji || "🇮🇳"}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: C.slate700, fontSize: 15 }}>{lang.name}</p>
                      <p style={{ margin: 0, fontSize: 14, color: C.skyDeep }}>{lang.native_name}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 99,
                      background: C.skyPale, color: C.accent, fontWeight: 600,
                    }}>{lang.script}</span>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 99,
                      background: "rgba(186,230,253,0.5)", color: "#0369A1",
                    }}>{lang.speakers_millions}M speakers</span>
                  </div>
                  {langInfo?.code === lang.code && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.skyLight}`, animation: "slideIn 0.2s ease" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 12, color: C.slate500 }}>
                        <b style={{ color: C.slate700 }}>Region:</b> {lang.region}
                      </p>
                      <p style={{ margin: "0 0 4px", fontSize: 12, color: C.slate500 }}>
                        <b style={{ color: C.slate700 }}>Official in:</b> {lang.official_in}
                      </p>
                      <p style={{ margin: "0 0 8px", fontSize: 18, color: C.skyDeep }}>
                        {lang.sample_hello}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); setTargetLang(lang.code); setTab("translate"); }}
                        style={{
                          width: "100%", padding: "7px", borderRadius: 8,
                          background: `linear-gradient(135deg, ${C.skyDeep}, ${C.skyMid})`,
                          border: "none", color: C.white, fontFamily: "inherit",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        Translate to {lang.name} →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: HISTORY ══════════════════════════════════════════════════ */}
        {tab === "history" && (
          <div style={{ animation: "slideIn 0.4s ease" }}>
            {history.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button onClick={handleClearHistory} style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)",
                  color: "#EF4444", fontFamily: "inherit", fontSize: 12, cursor: "pointer",
                }}>
                  Clear all
                </button>
              </div>
            )}
            {history.length === 0
              ? (
                <div style={{ ...cardStyle, textAlign: "center", padding: "3rem" }}>
                  <span style={{ fontSize: 40 }}>📜</span>
                  <p style={{ color: C.slate500, marginTop: 12 }}>No translations yet</p>
                </div>
              )
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {history.map(item => <HistoryItem key={item.id} item={item} />)}
                </div>
              )
            }
          </div>
        )}

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LinguaBotIndia />);
