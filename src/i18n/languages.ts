export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  speechCode: string;
  coastalRegion?: string;
}

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN', coastalRegion: 'All Ports' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', coastalRegion: 'National' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN', coastalRegion: 'Karnataka (Mangalore, Malpe, Karwar)' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN', coastalRegion: 'Kerala (Kochi, Kollam, Beypore)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', coastalRegion: 'Tamil Nadu (Chennai, Tuticorin, Rameswaram)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', coastalRegion: 'Andhra Pradesh (Vizag, Kakinada)' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', coastalRegion: 'Maharashtra (Mumbai, Ratnagiri)' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN', coastalRegion: 'Gujarat (Veraval, Porbandar, Okha)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', coastalRegion: 'West Bengal (Digha, Kakdwip)' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechCode: 'or-IN', coastalRegion: 'Odisha (Paradip, Dhamra)' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', speechCode: 'kok-IN', coastalRegion: 'Goa & Coastal Karnataka' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechCode: 'as-IN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', speechCode: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', speechCode: 'fr-FR' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', speechCode: 'pt-PT' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', speechCode: 'ar-SA' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', speechCode: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', speechCode: 'ja-JP' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', speechCode: 'id-ID' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', speechCode: 'th-TH' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', speechCode: 'vi-VN' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', speechCode: 'sw-KE' },
];
