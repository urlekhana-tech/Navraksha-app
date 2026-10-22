import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Navigation, 
  MapPin, 
  Layers, 
  Play, 
  Square, 
  RefreshCw, 
  Radio, 
  ShieldAlert, 
  Anchor,
  RotateCw,
  Gauge,
  Map as MapIcon,
  CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import { GpsCoordinate, SeaRoute } from '../types';
import { getRoutes, calculateDistanceKm } from '../services/routesData';
import { useAuth } from '../contexts/AuthContext';

export const GpsNavigationPage: React.FC = () => {
  const { captain } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vesselMarkerRef = useRef<L.Marker | null>(null);
  const breadcrumbPolylineRef = useRef<L.Polyline | null>(null);
  const routeOverlayPolylineRef = useRef<L.Polyline | null>(null);

  // Initial coastal coordinates (Panambur / Mangalore harbor mouth)
  const [currentCoord, setCurrentCoord] = useState<GpsCoordinate>({
    lat: 12.9423,
    lng: 74.8021,
    speedKnots: 8.4,
    heading: 285,
    accuracy: 6.5,
  });

  const [breadcrumbs, setBreadcrumbs] = useState<[number, number][]>([
    [12.9350, 74.8150],
    [12.9390, 74.8080],
    [12.9423, 74.8021],
  ]);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('none');
  const [routes, setRoutes] = useState<SeaRoute[]>([]);
  const [speedKnots, setSpeedKnots] = useState<number>(8.4);
  const [headingDeg, setHeadingDeg] = useState<number>(285);
  const [gpsLocked, setGpsLocked] = useState<boolean>(true);

  // Initialize routes
  useEffect(() => {
    setRoutes(getRoutes());
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create map centered on Arabian Sea off Mangalore
    const map = L.map(mapContainerRef.current, {
      center: [currentCoord.lat, currentCoord.lng],
      zoom: 13,
      zoomControl: false,
    });

    // Dark nautical marine basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO (NavRaksha Marine)',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom ship vessel icon
    const vesselIcon = L.divIcon({
      className: 'navraksha-vessel-marker',
      html: `
        <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:rgba(14,165,233,0.25); border:1.5px solid #38bdf8; animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="transform: rotate(${headingDeg}deg); width:32px; height:32px; border-radius:50%; background:#0284c7; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(56,189,248,0.7);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const marker = L.marker([currentCoord.lat, currentCoord.lng], { icon: vesselIcon }).addTo(map);
    vesselMarkerRef.current = marker;

    // Breadcrumb polyline (retaining last 500 waypoints)
    const breadcrumbLine = L.polyline(breadcrumbs, {
      color: '#38bdf8',
      weight: 3.5,
      dashArray: '4, 8',
      opacity: 0.9,
    }).addTo(map);
    breadcrumbPolylineRef.current = breadcrumbLine;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker position and heading
  useEffect(() => {
    if (!mapInstanceRef.current || !vesselMarkerRef.current) return;

    vesselMarkerRef.current.setLatLng([currentCoord.lat, currentCoord.lng]);

    // Update icon rotation
    const vesselIcon = L.divIcon({
      className: 'navraksha-vessel-marker',
      html: `
        <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:rgba(14,165,233,0.25); border:1.5px solid #38bdf8;"></div>
          <div style="transform: rotate(${headingDeg}deg); width:32px; height:32px; border-radius:50%; background:#0284c7; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(56,189,248,0.7);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
    vesselMarkerRef.current.setIcon(vesselIcon);

    if (breadcrumbPolylineRef.current) {
      breadcrumbPolylineRef.current.setLatLngs(breadcrumbs);
    }
  }, [currentCoord, headingDeg, breadcrumbs]);

  // Recenter Map
  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentCoord.lat, currentCoord.lng], 14, {
        animate: true,
      });
      setGpsLocked(true);
    }
  };

  // Route overlay selection
  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    if (!mapInstanceRef.current) return;

    if (routeOverlayPolylineRef.current) {
      mapInstanceRef.current.removeLayer(routeOverlayPolylineRef.current);
      routeOverlayPolylineRef.current = null;
    }

    if (routeId === 'none') return;

    const route = routes.find((r) => r.id === routeId);
    if (route && route.waypoints.length > 0) {
      const latLngs: [number, number][] = route.waypoints.map((w) => [w.lat, w.lng]);
      const polyline = L.polyline(latLngs, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
      }).addTo(mapInstanceRef.current);

      routeOverlayPolylineRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  };

  // Simulated Sea Voyage Mode (allows rich interactive demonstration of sea voyage)
  useEffect(() => {
    if (!isSimulating) return;

    const simulationInterval = setInterval(() => {
      setCurrentCoord((prev) => {
        // Navigate westward into fishing banks
        const dLat = (Math.sin(Date.now() / 8000) * 0.0008);
        const dLng = -0.0012; // moving seaward west
        const nextLat = Number((prev.lat + dLat).toFixed(6));
        const nextLng = Number((prev.lng + dLng).toFixed(6));
        const newSpeed = Number((7.8 + Math.random() * 1.8).toFixed(1));
        const newHeading = Math.round(270 + Math.sin(Date.now() / 4000) * 20);

        setSpeedKnots(newSpeed);
        setHeadingDeg(newHeading);

        setBreadcrumbs((old) => {
          const updated = [...old, [nextLat, nextLng] as [number, number]];
          return updated.slice(-500); // keep last 500
        });

        if (mapInstanceRef.current && gpsLocked) {
          mapInstanceRef.current.panTo([nextLat, nextLng], { animate: true });
        }

        return {
          lat: nextLat,
          lng: nextLng,
          speedKnots: newSpeed,
          heading: newHeading,
          accuracy: 5.2,
        };
      });
    }, 2000);

    return () => clearInterval(simulationInterval);
  }, [isSimulating, gpsLocked]);

  // Real Geolocation Lock (if supported)
  const requestRealGpsLock = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, speed, heading, accuracy } = pos.coords;
          const kSpeed = speed ? Number((speed * 1.94384).toFixed(1)) : 8.0;
          setCurrentCoord({
            lat: latitude,
            lng: longitude,
            speedKnots: kSpeed,
            heading: heading || 280,
            accuracy: accuracy || 8,
          });
          setSpeedKnots(kSpeed);
          if (heading) setHeadingDeg(Math.round(heading));
          setGpsLocked(true);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 14);
          }
        },
        (err) => {
          console.warn('GPS position error or permission denied:', err);
          recenterMap();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      recenterMap();
    }
  };

  const speedKmh = Number((speedKnots * 1.852).toFixed(1));

  // Heading compass string (N, NE, E, SE, S, SW, W, NW)
  const getCompassDirection = (deg: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((deg % 360) / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] min-h-[560px] w-full rounded-2xl overflow-hidden border border-sky-800/40 shadow-2xl flex flex-col">
      {/* Top Marine HUD Strip */}
      <div className="z-20 bg-slate-950/90 backdrop-blur-xl border-b border-sky-900/50 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/40">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{captain.boatName}</span>
              <span className="font-mono text-xs text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                {captain.boatRegNo}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 mt-0.5 flex items-center gap-2">
              <span>Lat: {currentCoord.lat.toFixed(4)}°N</span>
              <span>·</span>
              <span>Lng: {currentCoord.lng.toFixed(4)}°E</span>
              <span>·</span>
              <span className="text-emerald-400">±{currentCoord.accuracy || 6}m</span>
            </div>
          </div>
        </div>

        {/* Speed & Heading Gauge Telemetry */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Speed Indicator */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Speed</div>
            <div className="text-lg font-bold font-mono text-white leading-tight">
              {speedKnots} <span className="text-xs font-normal text-sky-400">knots</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">{speedKmh} km/h</div>
          </div>

          {/* Heading Indicator */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Heading</div>
            <div className="text-lg font-bold font-mono text-white leading-tight">
              {headingDeg}° <span className="text-xs font-bold text-sky-400">{getCompassDirection(headingDeg)}</span>
            </div>
            <div className="text-[10px] text-emerald-400">On Track</div>
          </div>

          {/* Route Overlay Selector */}
          <div className="hidden md:flex items-center gap-1.5">
            <select
              value={selectedRouteId}
              onChange={(e) => handleSelectRoute(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="none">-- Overlay Route --</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.distanceKm} km)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Marine Compass Rose Widget */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-950/85 border border-sky-400/40 shadow-xl backdrop-blur-md">
            {/* Compass dial markings */}
            <div className="absolute top-1 text-[10px] font-extrabold text-red-500">N</div>
            <div className="absolute right-1 text-[10px] font-bold text-slate-300">E</div>
            <div className="absolute bottom-1 text-[10px] font-bold text-slate-300">S</div>
            <div className="absolute left-1 text-[10px] font-bold text-slate-300">W</div>

            {/* Rotating Arrow Needle */}
            <div
              className="h-14 w-1 bg-gradient-to-t from-transparent via-sky-400 to-red-500 rounded-full transition-transform duration-500"
              style={{ transform: `rotate(${headingDeg}deg)` }}
            />
            <div className="absolute h-3 w-3 rounded-full bg-white border border-slate-900 shadow-md" />
            <div className="absolute bottom-4 text-[9px] font-mono font-bold text-sky-300">
              {headingDeg}°
            </div>
          </div>
        </div>

        {/* Bottom Floating Map Controls */}
        <div className="absolute bottom-5 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          {/* Simulation Toggle */}
          <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all touch-target ${
                isSimulating
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30'
              }`}
            >
              {isSimulating ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Pause Voyage Simulation</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Simulate Sea Voyage</span>
                </>
              )}
            </button>

            <button
              onClick={requestRealGpsLock}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors touch-target"
              title="Lock GPS Position"
            >
              <Navigation className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden sm:inline">Lock GPS</span>
            </button>
          </div>

          {/* Breadcrumbs stats */}
          <div className="bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono shadow-xl hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Trail: {breadcrumbs.length} waypoints</span>
            </div>
            <span>·</span>
            <span>Cruising: Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
