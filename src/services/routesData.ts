import { SeaRoute, GpsCoordinate } from '../types';

export const calculateDistanceKm = (c1: GpsCoordinate, c2: GpsCoordinate): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

export const calculateTotalRouteDistance = (waypoints: GpsCoordinate[]): number => {
  if (waypoints.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculateDistanceKm(waypoints[i], waypoints[i + 1]);
  }
  return Number(total.toFixed(2));
};

const PRELOADED_ROUTES: SeaRoute[] = [
  {
    id: 'route-panambur-deep',
    name: 'Panambur Deep Sea Trawl Route',
    port: 'Mangalore Old Port / Panambur',
    state: 'Karnataka',
    distanceKm: 18.4,
    durationMinutes: 95,
    description: 'Safe navigational passage avoiding shallow sandbars towards rich Seer fish and Pomfret feeding banks.',
    isDownloaded: true,
    isCustom: false,
    createdAt: '2026-03-15',
    waypoints: [
      { lat: 12.9423, lng: 74.8021 }, // Panambur Harbor mouth
      { lat: 12.9510, lng: 74.7735 }, // Coastal buoy #3
      { lat: 12.9650, lng: 74.7310 }, // 10-fathom contour
      { lat: 12.9802, lng: 74.6850 }, // Deep sea fishing waypoint A
      { lat: 12.9620, lng: 74.6620 }, // South bank turn
      { lat: 12.9450, lng: 74.7200 }, // Return run
    ],
  },
  {
    id: 'route-tannirbhavi-loop',
    name: 'Tannirbhavi Coastal Loop',
    port: 'Mangalore / Gurupura Estuary',
    state: 'Karnataka',
    distanceKm: 12.2,
    durationMinutes: 65,
    description: 'Calm morning netting loop for Indian Mackerel (Bangude) and Sardines within 5 nautical miles.',
    isDownloaded: true,
    isCustom: false,
    createdAt: '2026-03-10',
    waypoints: [
      { lat: 12.8940, lng: 74.8210 },
      { lat: 12.8995, lng: 74.7950 },
      { lat: 12.9150, lng: 74.7700 },
      { lat: 12.9350, lng: 74.7800 },
      { lat: 12.9200, lng: 74.8100 },
    ],
  },
  {
    id: 'route-ullal-someshwar',
    name: 'Ullal to Someshwar Reef Bank',
    port: 'Ullal Coastal Landing',
    state: 'Karnataka',
    distanceKm: 14.8,
    durationMinutes: 80,
    description: 'Traditional artisanal fishing corridor over submerged rocky shelves rich in Kingfish and Rock Cod.',
    isDownloaded: false,
    isCustom: false,
    createdAt: '2026-02-28',
    waypoints: [
      { lat: 12.8420, lng: 74.8450 },
      { lat: 12.8310, lng: 74.8100 },
      { lat: 12.8050, lng: 74.7850 },
      { lat: 12.7820, lng: 74.8120 },
      { lat: 12.8100, lng: 74.8500 },
    ],
  },
  {
    id: 'route-kochi-channel',
    name: 'Fort Kochi Offshore Channel',
    port: 'Kochi (Thoppumpady)',
    state: 'Kerala',
    distanceKm: 22.5,
    durationMinutes: 110,
    description: 'Southern Arabian sea corridor for offshore trawlers tracking high-density White Prawns and Tuna runs.',
    isDownloaded: false,
    isCustom: false,
    createdAt: '2026-01-20',
    waypoints: [
      { lat: 9.9670, lng: 76.2410 },
      { lat: 9.9720, lng: 76.2050 },
      { lat: 9.9850, lng: 76.1420 },
      { lat: 10.0120, lng: 76.0850 },
      { lat: 9.9750, lng: 76.0950 },
      { lat: 9.9550, lng: 76.1900 },
    ],
  },
  {
    id: 'route-kasimedu-shelf',
    name: 'Kasimedu Continental Shelf Path',
    port: 'Chennai Kasimedu Harbour',
    state: 'Tamil Nadu',
    distanceKm: 26.0,
    durationMinutes: 130,
    description: 'Bay of Bengal deep drop-off route for Seer fish (Vanjaram) and Yellowfin Tuna gill-netting.',
    isDownloaded: false,
    isCustom: false,
    createdAt: '2026-02-14',
    waypoints: [
      { lat: 13.1250, lng: 80.2980 },
      { lat: 13.1310, lng: 80.3450 },
      { lat: 13.1420, lng: 80.4200 },
      { lat: 13.1100, lng: 80.4800 },
      { lat: 13.0800, lng: 80.3900 },
    ],
  },
  {
    id: 'route-sassoon-prongs',
    name: 'Sassoon Docks to Prongs Reef',
    port: 'Mumbai Sassoon Docks',
    state: 'Maharashtra',
    distanceKm: 16.5,
    durationMinutes: 90,
    description: 'Safe navigational passage out of Mumbai harbor avoiding shipping lanes towards Prongs Reef and Colaba banks.',
    isDownloaded: false,
    isCustom: false,
    createdAt: '2026-03-01',
    waypoints: [
      { lat: 18.9150, lng: 72.8250 },
      { lat: 18.8950, lng: 72.8100 },
      { lat: 18.8720, lng: 72.7820 },
      { lat: 18.8850, lng: 72.7410 },
      { lat: 18.9100, lng: 72.7750 },
    ],
  },
];

const STORAGE_KEY = 'navraksha_saved_routes';

export const getRoutes = (): SeaRoute[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load custom routes from storage:', e);
  }
  // Initialize with preloaded
  saveRoutesToStorage(PRELOADED_ROUTES);
  return PRELOADED_ROUTES;
};

export const saveRoutesToStorage = (routes: SeaRoute[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  } catch (e) {
    console.error('Error saving routes to local storage:', e);
  }
};

export const toggleRouteDownload = (routeId: string): SeaRoute[] => {
  const current = getRoutes();
  const updated = current.map((r) =>
    r.id === routeId ? { ...r, isDownloaded: !r.isDownloaded } : r
  );
  saveRoutesToStorage(updated);
  return updated;
};

export const saveCustomRecordedRoute = (
  name: string,
  waypoints: GpsCoordinate[],
  description: string = 'Recorded GPS sea journey'
): SeaRoute => {
  const current = getRoutes();
  const distanceKm = calculateTotalRouteDistance(waypoints);
  const newRoute: SeaRoute = {
    id: `custom-route-${Date.now()}`,
    name: name.trim() || `Sea Voyage ${new Date().toLocaleDateString()}`,
    port: 'Current GPS Location',
    state: 'Coastal Waters',
    distanceKm,
    durationMinutes: Math.round(distanceKm * 4.5),
    waypoints,
    isDownloaded: true,
    isCustom: true,
    description,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updated = [newRoute, ...current];
  saveRoutesToStorage(updated);
  return newRoute;
};

export const deleteRoute = (routeId: string): SeaRoute[] => {
  const current = getRoutes();
  const updated = current.filter((r) => r.id !== routeId);
  saveRoutesToStorage(updated);
  return updated;
};
