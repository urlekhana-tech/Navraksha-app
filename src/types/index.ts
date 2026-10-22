export interface CaptainProfile {
  id: string;
  name: string;
  phone: string;
  boatName: string;
  boatRegNo: string;
  licenseNo: string;
  basePort: string;
  state: string;
  role: 'fisherman' | 'boat_owner' | 'maritime_officer';
  issuedDate: string;
  expiryDate: string;
  avatarUrl?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  isAuthenticated: boolean;
}

export interface GpsCoordinate {
  lat: number;
  lng: number;
  timestamp?: number;
  speedKnots?: number;
  heading?: number;
  accuracy?: number;
}

export interface SeaRoute {
  id: string;
  name: string;
  port: string;
  state: string;
  distanceKm: number;
  durationMinutes: number;
  waypoints: GpsCoordinate[];
  isDownloaded: boolean;
  isCustom?: boolean;
  description: string;
  createdAt: string;
}

export interface SosAlertRecord {
  id: string;
  timestamp: string;
  lat: number;
  lng: number;
  accuracy: number;
  boatName: string;
  boatRegNo: string;
  captainName: string;
  phone: string;
  status: 'active' | 'resolved' | 'dispatched';
  dispatchedTo: string[];
  resolvedAt?: string;
}

export type SafetyAdvisoryLevel = 'SAFE' | 'CAUTION' | 'DANGER';

export interface MarineWeatherData {
  portId: string;
  portName: string;
  state: string;
  lat: number;
  lng: number;
  temperatureC: number;
  condition: string;
  windSpeedKnots: number;
  windSpeedKmh: number;
  windDirection: string;
  windHeadingDeg: number;
  waveHeightMeters: number;
  swellPeriodSeconds: number;
  visibilityKm: number;
  humidityPercent: number;
  pressureHpa: number;
  advisoryLevel: SafetyAdvisoryLevel;
  advisorySummary: string;
  advisoryDetails: string;
  nextHighTide: string;
  nextLowTide: string;
  waterTempC: number;
  hourlyForecast: {
    time: string;
    windKnots: number;
    waveMeters: number;
    rainProb: number;
    status: SafetyAdvisoryLevel;
  }[];
}

export interface FishSpeciesRate {
  id: string;
  speciesEn: string;
  speciesLocal: { [langCode: string]: string };
  scientificName: string;
  category: 'Pelagic' | 'Demersal' | 'Crustacean' | 'Cephalopod';
  minRate: number;
  maxRate: number;
  currentRate: number;
  previousRate: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  portName: string;
  state: string;
  updatedTime: string;
  freshnessGrade: string;
  demandStatus: 'High' | 'Moderate' | 'Normal';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'safety' | 'weather' | 'subsidy' | 'navigation' | 'general';
}

export interface FishScanResult {
  speciesName: string;
  localName: string;
  scientificName: string;
  confidence: number;
  estimatedWeightKg: number;
  estimatedLengthCm: number;
  freshnessGrade: 'Grade A Premium' | 'Grade B Commercial' | 'Grade C Processing';
  estimatedMarketRatePerKg: number;
  totalEstimatedBatchValue: number;
  marketDemand: 'High' | 'Steady' | 'Fair';
  coolingAdvice: string;
  bestLandingPort: string;
}
