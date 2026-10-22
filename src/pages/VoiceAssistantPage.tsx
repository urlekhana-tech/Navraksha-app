import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Anchor, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { voiceAssistant } from '../services/voiceAssistant';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { AiChatMessage } from '../types';

export const VoiceAssistantPage: React.FC = () => {
  const { captain } = useAuth();
  const { language, currentLanguageItem } = useLanguage();

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Ahoy Captain ${captain.name}! I am NavRaksha AI, your nautical maritime companion on board "${captain.boatName}". Ask me anything about sea weather, fuel conservation, PMMSY government subsidies, or fish landing rates. Speak or type below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Formulate answer from maritime domain engine
    setTimeout(() => {
      const replyText = voiceAssistant.getAnswer(text, language);
      const assistantMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically speak reply if TTS is supported
      if (voiceAssistant.isTtsSupported()) {
        setActiveSpeechMsgId(assistantMsg.id);
        setIsSpeaking(true);
        voiceAssistant.speak(replyText, currentLanguageItem.speechCode, () => {
          setIsSpeaking(false);
          setActiveSpeechMsgId(null);
        });
      }
    }, 400);
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceAssistant.startListening(currentLanguageItem.speechCode, {
        onResult: (transcript) => {
          setIsListening(false);
          handleSendMessage(transcript);
        },
        onError: (err) => {
          setIsListening(false);
          console.warn('Voice capture issue:', err);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (activeSpeechMsgId === msgId && isSpeaking) {
      voiceAssistant.stopSpeaking();
      setIsSpeaking(false);
      setActiveSpeechMsgId(null);
    } else {
      setActiveSpeechMsgId(msgId);
      setIsSpeaking(true);
      voiceAssistant.speak(text, currentLanguageItem.speechCode, () => {
        setIsSpeaking(false);
        setActiveSpeechMsgId(null);
      });
    }
  };

  const sampleQuestions = [
    'Is it safe to sail deep sea today?',
    'What is the PMMSY subsidy for boat engine?',
    'How do I conserve diesel fuel at sea?',
    'What are the emergency distress frequencies?',
    'What are today’s Seer fish (Surmai) rates?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] min-h-[580px] max-w-4xl mx-auto rounded-2xl border border-sky-800/40 bg-slate-950/80 shadow-2xl overflow-hidden pb-16 lg:pb-0">
      {/* Header bar */}
      <div className="bg-slate-900/90 border-b border-sky-900/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md">
            <Anchor className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">NavRaksha Nautical AI</h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Active ({currentLanguageItem.nativeName})
              </span>
            </div>
            <p className="text-xs text-slate-400">Maritime Safety, Weather & PMMSY Advisor</p>
          </div>
        </div>

        <button
          onClick={() => {
            voiceAssistant.stopSpeaking();
            setIsSpeaking(false);
            setMessages([messages[0]]);
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Reset Conversation"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Suggested Questions Chips */}
      <div className="bg-slate-900/40 border-b border-slate-800/60 p-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider whitespace-nowrap pl-2">
          Suggestions:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/90 hover:bg-sky-600 hover:text-white text-slate-300 border border-slate-700 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-sky-400 border border-sky-500/30'
                }`}
              >
                {isUser ? 'Cpt' : <Anchor className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-lg rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10">
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleSpeakMessage(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {activeSpeechMsgId === msg.id && isSpeaking ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-sky-900/40">
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={handleToggleVoiceInput}
            className={`flex items-center justify-center h-11 w-11 rounded-xl transition-all shadow-md touch-target ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-red-600/40 scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700'
            }`}
            title={isListening ? 'Listening... Tap to stop' : 'Tap to speak'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : `Ask NavRaksha in ${currentLanguageItem.name} or type here...`
            }
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="flex items-center justify-center h-11 w-11 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white shadow-md transition-all touch-target"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
