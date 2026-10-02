import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { processChatMessage } from '../services/chatbotEngine';
import {
  Bot,
  MessageCircle,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ShoppingBag,
  Check,
  Phone,
  FileText,
  AlertTriangle,
  ExternalLink,
  Truck,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const Chatbot = () => {
  const {
    isChatbotOpen,
    setIsChatbotOpen,
    chatbotInitialQuery,
    setChatbotInitialQuery,
    medicines,
    orders,
    storeDetails,
    currentUser,
    addToCart,
    setIsPrescriptionModalOpen,
    navigateToCatalogWithSearch,
    setActiveTab,
    getWhatsAppOrderUrl
  } = useStore();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mante_chatbot_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Hello! 👋 Welcome to **Guru Medical & Healthcare** (Sawkhed Tejan).\n\nI am **Guru HealthBot**, your AI clinical pharmacy assistant. Ask me about **any medicine, sickness, pain, disease, or dosage rules** in English or मराठी!`,
        quickReplies: [
          '💊 Dolo 650 Dose & Uses',
          '🔥 Pan-D Acidity Guide',
          '🤒 Viral Fever Treatment',
          '🦵 Knee & Back Pain Relief',
          '👶 Children Dosage Rules',
          '🗣️ मराठीत बोला (Marathi)'
        ]
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('mante_chatbot_lang') || 'en');
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);
  const [addedItemMap, setAddedItemMap] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('mante_chatbot_history', JSON.stringify(messages.slice(-20)));
  }, [messages]);

  // Sync language
  useEffect(() => {
    localStorage.setItem('mante_chatbot_lang', language);
  }, [language]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatbotOpen) {
      scrollToBottom();
      setHasUnreadNotice(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isChatbotOpen, messages, isTyping]);

  // Handle external initial queries (e.g. from MedicineCard "Ask AI")
  useEffect(() => {
    if (chatbotInitialQuery) {
      setIsChatbotOpen(true);
      handleSendMessage(chatbotInitialQuery);
      if (setChatbotInitialQuery) setChatbotInitialQuery('');
    }
  }, [chatbotInitialQuery]);

  // Speech Recognition Setup (STT)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech (TTS)
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Clean markdown stars, hashes, etc.
    const clean = text
      .replace(/[*_#`[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/tel:\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMessageId = `msg-usr-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Check language switch prompt
    if (text.includes('मराठी') || text.toLowerCase().includes('marathi')) {
      setLanguage('mr');
    } else if (text.toLowerCase().includes('english')) {
      setLanguage('en');
    }

    // Call server API or fallback to local rule engine
    setTimeout(async () => {
      let botResult = null;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            language,
            userId: currentUser?.id,
            userName: currentUser?.name
          })
        });

        if (res.ok) {
          botResult = await res.json();
        }
      } catch {
        // Backend not running -> fallback directly
      }

      if (!botResult) {
        botResult = processChatMessage(text, {
          medicines,
          orders,
          storeDetails,
          currentUser,
          preferredLanguage: language
        });
      }

      const botMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: botResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedMedicines: botResult.matchedMedicines || [],
        matchedOrder: botResult.matchedOrder || null,
        isEmergency: Boolean(botResult.isEmergency),
        action: botResult.action || null,
        quickReplies: botResult.quickReplies || []
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (isTTSActive) {
        speakText(botResult.text);
      }
    }, 550);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history with Guru HealthBot?')) {
      const resetMsg = [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: language === 'mr'
            ? `नमस्कार! मी **गुरु स्वास्थ्य मित्र** आहे. मी तुम्हाला औषधे शोधण्यात, प्रिस्क्रिप्शन पाठवण्यात किंवा ऑर्डर ट्रॅक करण्यात मदत करू शकतो.`
            : `Hello! I am **Guru HealthBot**. How can I assist you with medicines, prescriptions, or orders today?`,
          quickReplies: [
            language === 'mr' ? '💊 औषधे शोधा' : '💊 Search Medicines',
            language === 'mr' ? '📦 ऑर्डर ट्रॅक करा' : '📦 Track Order',
            language === 'mr' ? '📄 प्रिस्क्रिप्शन पाठवा' : '📄 Upload Prescription',
            language === 'mr' ? '🏪 दुकानाची माहिती' : '🏪 Store Info'
          ]
        }
      ];
      setMessages(resetMsg);
      localStorage.removeItem('mante_chatbot_history');
    }
  };

  const handleAddToCart = (medicine) => {
    addToCart(medicine, 1);
    setAddedItemMap(prev => ({ ...prev, [medicine.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [medicine.id]: false }));
    }, 2000);
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.type === 'open_prescription_modal') {
      setIsPrescriptionModalOpen(true);
    } else if (action.type === 'navigate_catalog') {
      navigateToCatalogWithSearch(action.category || '');
    } else if (action.type === 'navigate_customer_req') {
      setActiveTab('customer-req');
      setIsChatbotOpen(false);
    }
  };

  const renderFormattedText = (raw = '') => {
    // Process markdown-like formatting: bold, links, list items, alert banners
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      // Bold **text**
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={pIdx} className="chat-code">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="chat-bullet-line">
            <span className="chat-bullet-dot">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      if (line.startsWith('🚨') || line.startsWith('⚠️')) {
        return (
          <div key={idx} className="chat-alert-line">
            {renderedParts}
          </div>
        );
      }

      if (line.startsWith('💊') || line.startsWith('📋')) {
        return (
          <div key={idx} className="chat-highlight-line">
            {renderedParts}
          </div>
        );
      }

      return (
        <p key={idx} className="chat-paragraph">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="chatbot-launcher-wrapper no-print">
        {hasUnreadNotice && !isChatbotOpen && (
          <div
            className="chatbot-preview-bubble"
            onClick={() => setIsChatbotOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className="bubble-arrow" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="live-status-dot" />
              <strong>HealthBot Online</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Need medicine advice or order tracking? Ask me!
            </div>
          </div>
        )}

        <button
          className={`chatbot-launcher-btn ${isChatbotOpen ? 'active' : ''}`}
          onClick={() => {
            setIsChatbotOpen(prev => !prev);
            setHasUnreadNotice(false);
          }}
          aria-label="Open AI HealthBot"
          title="Guru HealthBot - AI Pharmacy Assistant"
        >
          {isChatbotOpen ? (
            <X size={24} color="#ffffff" />
          ) : (
            <>
              <div className="chatbot-launcher-icon-wrap">
                <Bot size={26} color="#ffffff" />
                <span className="chatbot-launcher-badge">AI</span>
              </div>
              <span className="chatbot-launcher-label">Ask HealthBot</span>
            </>
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      {isChatbotOpen && (
        <aside
          className={`chatbot-window-container no-print ${isExpanded ? 'expanded' : ''}`}
          role="dialog"
          aria-label="Guru HealthBot Conversation"
        >
          {/* Header */}
          <header className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar-box">
                <Bot size={22} color="#ffffff" />
                <span className="online-indicator-dot" title="Active & Ready" />
              </div>
              <div>
                <div className="chatbot-title-row">
                  <h3>Guru HealthBot</h3>
                  <span className="chatbot-title-badge">AI Pharmacist</span>
                </div>
                <div className="chatbot-subtitle">
                  MR. Rushikesh Mante's Digital Pharmacy • Sawkhed Tejan
                </div>
              </div>
            </div>

            <div className="chatbot-header-actions">
              {/* Language Switcher */}
              <button
                className="chatbot-tool-btn"
                onClick={() => setLanguage(l => l === 'en' ? 'mr' : 'en')}
                title={`Switch to ${language === 'en' ? 'मराठी (Marathi)' : 'English'}`}
              >
                {language === 'en' ? 'मराठी' : 'ENG'}
              </button>

              {/* TTS Toggle */}
              <button
                className={`chatbot-tool-btn ${isTTSActive ? 'active' : ''}`}
                onClick={() => {
                  const next = !isTTSActive;
                  setIsTTSActive(next);
                  if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
                }}
                title={isTTSActive ? 'Disable Voice Reading' : 'Enable Voice Reading (Text-To-Speech)'}
              >
                {isTTSActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Expand / Minimize Toggle */}
              <button
                className="chatbot-tool-btn"
                onClick={() => setIsExpanded(e => !e)}
                title={isExpanded ? 'Standard Window' : 'Full Screen'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Clear History */}
              <button
                className="chatbot-tool-btn"
                onClick={handleClearHistory}
                title="Clear Chat History"
              >
                <RotateCcw size={16} />
              </button>

              {/* Close Button */}
              <button
                className="chatbot-tool-btn close"
                onClick={() => setIsChatbotOpen(false)}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Quick Health Topic Chips Bar */}
          <div className="chatbot-topic-chips-bar">
            <button
              className="chatbot-topic-chip"
              onClick={() => handleSendMessage(language === 'mr' ? 'व्हायरल ताप आणि अंगदुखीवर काय डोस घ्यावा?' : 'Viral fever and body ache treatment and doses')}
            >
              🤒 {language === 'mr' ? 'ताप व अंगदुखी' : 'Fever & Viral'}
            </button>
            <button
              className="chatbot-topic-chip"
              onClick={() => handleSendMessage(language === 'mr' ? 'ॲसिडिटी, पित्त आणि छातीत जळजळ यावर काय उपाय आहे?' : 'Acidity, GERD and heartburn dosage guide')}
            >
              🔥 {language === 'mr' ? 'ॲसिडिटी व पित्त' : 'Acidity & Gas'}
            </button>
            <button
              className="chatbot-topic-chip"
              onClick={() => handleSendMessage(language === 'mr' ? 'गुडघेदुखी आणि कंबरदुखीवर मलम व गोळ्या कोणत्या?' : 'Joint pain, knee osteoarthritis and backache relief')}
            >
              🦵 {language === 'mr' ? 'गुडघे व पाठदुखी' : 'Joint & Knee Pain'}
            </button>
            <button
              className="chatbot-topic-chip"
              onClick={() => handleSendMessage(language === 'mr' ? 'Dolo 650 चा अचूक डोस आणि जेवणाआधी की नंतर?' : 'Dolo 650 dosage and timing rules')}
            >
              💊 {language === 'mr' ? 'Dolo 650 डोस' : 'Dolo 650 Dose'}
            </button>
            <button
              className="chatbot-topic-chip"
              onClick={() => handleSendMessage(language === 'mr' ? 'Pan-D कॅप्सूल कधी आणि कशी घ्यावी?' : 'How to take Pan-D capsule correctly')}
            >
              🌅 {language === 'mr' ? 'Pan-D कधी घ्यावी?' : 'How to take Pan-D'}
            </button>
            <button
              className="chatbot-topic-chip"
              onClick={() => handleSendMessage(language === 'mr' ? 'लहान मुलांच्या औषधांचे डोस नियम सांगा' : 'Children pediatric dosage guidelines')}
            >
              👶 {language === 'mr' ? 'बालकांचे डोस नियम' : 'Child Dose Rules'}
            </button>
            <button
              className="chatbot-topic-chip"
              onClick={() => handleSendMessage(language === 'mr' ? 'उच्च रक्तदाब (High BP) आणि मधुमेहाची काळजी' : 'High BP and diabetes management')}
            >
              🩺 {language === 'mr' ? 'बीपी व शुगर' : 'BP & Diabetes'}
            </button>
          </div>

          {/* Messages Body */}
          <div className="chatbot-messages-body">
            {/* Pharmacy Trust Ribbon */}
            <div className="chatbot-trust-banner">
              <ShieldCheck size={14} color="#059669" />
              <span>Reg. Pharmacy MH-BUL-20B-194821 • 24/7 Hotline: <strong>8237729148</strong></span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="chat-avatar bot-avatar">
                    <Bot size={16} />
                  </div>
                )}

                <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  {/* Emergency Alert Card */}
                  {msg.isEmergency && (
                    <div className="chat-emergency-box">
                      <div className="emergency-header">
                        <AlertTriangle size={18} color="#dc2626" />
                        <strong>CRITICAL EMERGENCY</strong>
                      </div>
                      <div className="emergency-actions">
                        <a
                          href="tel:8237729148"
                          className="btn btn-emergency"
                          style={{ textDecoration: 'none' }}
                        >
                          <Phone size={14} />
                          <span>Call Rushikesh Mante (8237729148)</span>
                        </a>
                        <a
                          href="tel:108"
                          className="btn btn-emergency-secondary"
                          style={{ textDecoration: 'none' }}
                        >
                          <span>Call 108 (Ambulance)</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Formatted Text Content */}
                  <div className="chat-bubble-text">
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Deep-link Action Button */}
                  {msg.action && (
                    <button
                      className="chat-action-btn"
                      onClick={() => handleActionClick(msg.action)}
                    >
                      <span>{msg.action.label}</span>
                      <ChevronRight size={15} />
                    </button>
                  )}

                  {/* Embedded Medicine Cards */}
                  {msg.matchedMedicines && msg.matchedMedicines.length > 0 && (
                    <div className="chat-medicines-grid">
                      {msg.matchedMedicines.map(med => (
                        <div key={med.id} className="chat-med-card">
                          <div className="chat-med-top">
                            <span className="chat-med-cat">{med.category}</span>
                            {med.prescriptionRequired ? (
                              <span className="badge badge-rx" style={{ fontSize: '0.65rem' }}>Rx</span>
                            ) : (
                              <span className="badge badge-otc" style={{ fontSize: '0.65rem' }}>OTC</span>
                            )}
                          </div>
                          <div className="chat-med-name">{med.name}</div>
                          <div className="chat-med-generic">{med.genericName}</div>

                          <div className="chat-med-price-row">
                            <div>
                              <span className="chat-med-price">₹{med.price.toFixed(2)}</span>
                              {med.mrp > med.price && (
                                <span className="chat-med-mrp">₹{med.mrp.toFixed(2)}</span>
                              )}
                            </div>
                            <span className={`chat-med-stock ${med.stock > 0 ? 'in' : 'out'}`}>
                              {med.stock > 0 ? `${med.stock} in stock` : 'Out of Stock'}
                            </span>
                          </div>

                          <div className="chat-med-dosage">
                            <strong>Dose:</strong> {med.dosage}
                          </div>

                          <div className="chat-med-buttons">
                            <button
                              className={`chat-btn-cart ${addedItemMap[med.id] ? 'added' : ''}`}
                              onClick={() => handleAddToCart(med)}
                              disabled={med.stock <= 0}
                            >
                              {addedItemMap[med.id] ? (
                                <>
                                  <Check size={13} />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag size={13} />
                                  <span>Add to Cart</span>
                                </>
                              )}
                            </button>

                            <a
                              href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I want to order ${med.name} via Guru HealthBot.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chat-btn-whatsapp"
                              title="Order on WhatsApp"
                            >
                              WhatsApp
                            </a>
                          </div>

                          <button
                            type="button"
                            className="chat-btn-ask-dose"
                            onClick={() => handleSendMessage(language === 'mr' ? `${med.name} चा डोस कसा घ्यावा आणि काय काळजी घ्यावी?` : `What is the dosage guide and timing for ${med.name}?`)}
                          >
                            📋 {language === 'mr' ? 'अचूक डोस व वेळ मार्गदर्शक' : 'Patient Dosage & Timing Guide'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Embedded Order Tracking Card */}
                  {msg.matchedOrder && (
                    <div className="chat-order-card">
                      <div className="chat-order-header">
                        <div>
                          <div className="chat-order-id">{msg.matchedOrder.id}</div>
                          <div className="chat-order-date">{msg.matchedOrder.orderDate}</div>
                        </div>
                        <span className={`badge ${
                          msg.matchedOrder.status === 'Delivered' ? 'badge-success' :
                          msg.matchedOrder.status === 'Out for Delivery' ? 'badge-info' : 'badge-warning'
                        }`}>
                          {msg.matchedOrder.status}
                        </span>
                      </div>

                      {/* Visual Progress Steps */}
                      <div className="chat-order-steps">
                        {['Pending', 'Packed', 'Out for Delivery', 'Delivered'].map((step, sIdx) => {
                          const steps = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
                          const currentIdx = steps.indexOf(msg.matchedOrder.status);
                          const isDone = currentIdx >= sIdx;
                          const isCurrent = currentIdx === sIdx;
                          return (
                            <div key={step} className={`step-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                              <div className="step-dot" />
                              <span className="step-label">{step}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="chat-order-details">
                        <div className="chat-order-row">
                          <MapPin size={13} color="var(--text-muted)" />
                          <span>{msg.matchedOrder.deliveryAddress}</span>
                        </div>
                        <div className="chat-order-row">
                          <Truck size={13} color="var(--text-muted)" />
                          <span>Payment: <strong>{msg.matchedOrder.paymentMethod}</strong> (₹{msg.matchedOrder.totalAmount.toFixed(2)})</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Footer & Audio playback */}
                  <div className="chat-bubble-footer">
                    <span className="chat-timestamp">{msg.timestamp}</span>
                    {msg.sender === 'bot' && (
                      <button
                        className="chat-tts-icon-btn"
                        onClick={() => speakText(msg.text)}
                        title="Listen to response"
                      >
                        <Volume2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="chat-avatar user-avatar">
                    <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-bubble-row bot-row">
                <div className="chat-avatar bot-avatar">
                  <Bot size={16} />
                </div>
                <div className="chat-bubble bot-bubble typing-bubble">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    Consulting Guru Pharmacy knowledge...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestion Chips */}
          {messages.length > 0 && messages[messages.length - 1].quickReplies && (
            <div className="chatbot-quick-replies">
              {messages[messages.length - 1].quickReplies.map((chip, cIdx) => (
                <button
                  key={cIdx}
                  className="chat-quick-chip"
                  onClick={() => handleSendMessage(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <footer className="chatbot-input-bar">
            {/* Quick Prescription Upload Button */}
            <button
              className="chat-input-tool-btn"
              onClick={() => setIsPrescriptionModalOpen(true)}
              title="Upload Prescription (फोटो / PDF पाठवा)"
              type="button"
            >
              <FileText size={18} />
            </button>

            {/* Voice Input Microphone */}
            <button
              className={`chat-input-tool-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title={isListening ? 'Stop Listening' : 'Speak to Guru HealthBot (मराठी किंवा English)'}
              type="button"
            >
              {isListening ? <MicOff size={18} color="#ef4444" /> : <Mic size={18} />}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              className="chat-text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                language === 'mr'
                  ? 'औषध, लक्षणे किंवा ऑर्डर आयडी विचारा...'
                  : 'Ask about medicines, dosage, symptoms...'
              }
            />

            {/* Send Button */}
            <button
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              title="Send Message"
              type="button"
            >
              <Send size={16} />
            </button>
          </footer>

          {/* Disclaimer Note */}
          <div className="chatbot-disclaimer">
            <span>ℹ️ AI Pharmacy Assistant provides informational guidance. In emergency, call <strong>8237729148</strong>.</span>
          </div>
        </aside>
      )}
    </>
  );
};
