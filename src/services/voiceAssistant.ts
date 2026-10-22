export interface VoiceRecognitionHandlers {
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class VoiceAssistantService {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
      this.synth = window.speechSynthesis || null;
    }
  }

  public isSpeechSupported(): boolean {
    return !!this.recognition;
  }

  public isTtsSupported(): boolean {
    return !!this.synth;
  }

  public startListening(langCode: string = 'en-IN', handlers: VoiceRecognitionHandlers) {
    if (!this.recognition) {
      handlers.onError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      this.recognition.lang = langCode;
      this.recognition.onstart = () => {
        this.isListening = true;
      };
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handlers.onResult(transcript);
      };
      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        handlers.onError(event.error || 'Speech capture error');
      };
      this.recognition.onend = () => {
        this.isListening = false;
        handlers.onEnd();
      };
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      handlers.onError(e.message || 'Error starting speech');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public speak(text: string, langCode: string = 'en-IN', onEnd?: () => void) {
    if (!this.synth) return;
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error', e);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public getAnswer(query: string, lang: string = 'en'): string {
    const q = query.toLowerCase();

    // Weather & Cyclone queries
    if (q.includes('weather') || q.includes('storm') || q.includes('cyclone') || q.includes('hawa') || q.includes('barish') || q.includes('wave') || q.includes('safe to sail')) {
      if (lang === 'hi') {
        return 'कैप्टन, आज कर्नाटक और महाराष्ट्र तट पर हवा की गति 11 से 14 नॉट है और समुद्र शांत है। छोटी नावों के लिए जाना सुरक्षित है, लेकिन गुजरात तट पर लाल चेतावनी है!';
      }
      if (lang === 'kn') {
        return 'ಕ್ಯಾಪ್ಟನ್, ಕರಾವಳಿ ಕರ್ನಾಟಕದಲ್ಲಿ 11 ನಾಟ್ಸ್ ಗಾಳಿಯಿದ್ದು, ಸಮುದ್ರ ಶಾಂತವಾಗಿದೆ. 20 ನಾಟಿಕಲ್ ಮೈಲಿವರೆಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಹೋಗಬಹುದು.';
      }
      if (lang === 'ml') {
        return 'ക്യാപ്റ്റൻ, കേരള തീരത്ത് ചെറിയ തോതിലുള്ള മഴ സാധ്യതയുണ്ട്. പടിഞ്ഞാറൻ കാറ്റ് 18 നോട്സ് വരെ വീശാൻ സാധ്യതയുള്ളതിനാൽ ജാഗ്രത പാലിക്കുക.';
      }
      return 'Ahoy Captain! Coastal waters off Karnataka and Maharashtra report calm seas with 11-14 knots wind, safe for sailing. Notice: Gujarat Veraval coast has a storm surge warning.';
    }

    // Subsidy & PMMSY queries
    if (q.includes('scheme') || q.includes('pmmsy') || q.includes('subsidy') || q.includes('kcc') || q.includes('loan') || q.includes('government') || q.includes('yojana')) {
      if (lang === 'hi') {
        return 'प्रधानमंत्री मत्स्य संपदा योजना (PMMSY) के तहत नाव इंजन, संचार ट्रांसपोंडर और इंसुलेटेड आइस बॉक्स पर 40% से 60% सब्सिडी उपलब्ध है। किसान क्रेडिट कार्ड (KCC) पर 4% ब्याज पर ऋण मिलता है।';
      }
      if (lang === 'kn') {
        return 'ಪಿಎಂಎಂಎಸ್‌ವೈ (PMMSY) ಯೋಜನೆಯಡಿ ದೋಣಿ ಎಂಜಿನ್ ಮತ್ತು ಉಪಗ್ರಹ ಸಂವಹನ ಸಾಧನಗಳಿಗೆ ಶೇ. 40 ರಿಂದ 60 ರಷ್ಟು ಸಬ್ಸಿಡಿ ಲಭ್ಯವಿದೆ. ಮೀನುಗಾರರಿಗೆ ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಸೌಲಭ್ಯವಿದೆ.';
      }
      return 'Captain, under PMMSY (Pradhan Mantri Matsya Sampada Yojana), you can claim 40% to 60% financial assistance for marine outboard engines, two-way satellite transponders, and bio-toilets, plus KCC working capital loans at 4% interest.';
    }

    // Fuel saving & Speed queries
    if (q.includes('fuel') || q.includes('diesel') || q.includes('save') || q.includes('speed') || q.includes('mileage')) {
      if (lang === 'hi') {
        return 'कैप्टन, अपनी नाव को 8 से 10 नॉट की इकॉनमी गति पर चलाएं। इससे 14 नॉट की तुलना में 25% तक डीजल की बचत होती है। समय-समय पर नाव के निचले तल की सफाई करें।';
      }
      return 'Ahoy Captain! Sailing at cruising speed of 8 to 10 knots saves up to 25% diesel compared to high throttle. Keep your propeller clear of weed and check barnacles on the wooden hull.';
    }

    // Emergency & SOS queries
    if (q.includes('sos') || q.includes('emergency') || q.includes('coast guard') || q.includes('police') || q.includes('help') || q.includes('danger')) {
      if (lang === 'hi') {
        return 'आपातकाल में भारतीय तटरक्षक का टोल-फ्री नंबर 1554 है और समुद्री पुलिस 100 है। आप नव रक्षा का लाल एसओएस बटन 3 सेकंड दबाकर तुरंत जीपीएस सहायता संदेश भेज सकते हैं।';
      }
      return 'In any maritime emergency, immediately dial Indian Coast Guard hotline 1554 or Marine Police 100. Press and hold the NavRaksha 3-second SOS ring to transmit your coordinates over SMS and WhatsApp!';
    }

    // Market & Fish Price queries
    if (q.includes('price') || q.includes('rate') || q.includes('surmai') || q.includes('anjal') || q.includes('pomfret') || q.includes('mackerel') || q.includes('bhav') || q.includes('market')) {
      if (lang === 'hi') {
        return 'आज मैंगलोर और कोच्चि बंदरगाह पर सुरमई (Seer Fish) का भाव ₹780 प्रति किलो, सफेद पापलेट ₹1040, और बांगड़ा ₹220 प्रति किलो चल रहा है। आज मांग अच्छी है!';
      }
      if (lang === 'kn') {
        return 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರ: ಅಂಜಲ್ ₹780/ಕೆಜಿ, ಬೆಳ್ಳಿ ಮಾಂಜಿ ₹1040/ಕೆಜಿ, ಬಂಗುಡೆ ₹220/ಕೆಜಿ ಇದೆ. ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೇಡಿಕೆ ಹೆಚ್ಚಾಗಿದೆ!';
      }
      return 'Today at landing ports: Seer Fish (Kingfish/Surmai) averages ₹780/kg, Silver Pomfret ₹1,040/kg, and Indian Mackerel ₹220/kg. Prawns and Squid are trading high!';
    }

    // General fallback
    if (lang === 'hi') {
      return 'नमस्ते कैप्टन! मैं नव रक्षा समुद्री सहायक हूँ। आप मुझसे मौसम, मछली भाव, सुरक्षित रास्ते, या सरकारी योजनाओं के बारे में कभी भी पूछ सकते हैं।';
    }
    if (lang === 'kn') {
      return 'ನಮಸ್ಕಾರ ಕ್ಯಾಪ್ಟನ್! ನಾನು ನಿಮ್ಮ ನಾವ್‌ ರಕ್ಷಾ ಸಾಗರ ಮಿತ್ರ. ಹವಾಮಾನ, ಮೀನು ದರ ಅಥವಾ ಸುರಕ್ಷತಾ ಮಾರ್ಗಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ.';
    }
    return "Ahoy Captain! I am NavRaksha AI, your nautical companion. Ask me about weather conditions, fish landing rates, fuel efficiency, or maritime emergency procedures. Safe voyage!";
  }
}

export const voiceAssistant = new VoiceAssistantService();
