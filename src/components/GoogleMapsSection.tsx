import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Phone, Clock, Navigation, CheckCircle2, ShieldCheck, Car, Bike, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types/store';

interface GoogleMapsSectionProps {
  apiKey: string;
  settings?: StoreSettings;
}

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ apiKey, settings }) => {
  const storeLocation = { 
    lat: settings?.lat ?? 45.5165, 
    lng: settings?.lng ?? -122.6515 
  };
  const storeName = settings?.storeName || 'EarthHarvest Organic Market';
  const fullAddress = settings ? `${settings.address}, ${settings.cityStateZip}` : '1420 SE Belmont St, Portland, OR 97214';
  const phone = settings?.phone || '(503) 555-0198';

  const [selectedMarker, setSelectedMarker] = useState<boolean>(true);
  const [directionsFrom, setDirectionsFrom] = useState('');
  const [directionsStatus, setDirectionsStatus] = useState<string | null>(null);

  const handleGetDirections = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directionsFrom.trim()) return;
    const destination = encodeURIComponent(fullAddress);
    const origin = encodeURIComponent(directionsFrom);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, '_blank', 'noopener,noreferrer');
    setDirectionsStatus(`Opened Google Maps route from "${directionsFrom}" to ${storeName}.`);
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
      {/* Top Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-b border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Google Maps Local Business Listing
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Visit {storeName}
            </h3>
            <p className="text-stone-400 text-sm mt-1">
              {fullAddress}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-900/40"
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps App
            </a>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium transition-colors border border-stone-700"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Map + Location Info & Route Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left Column: Interactive Map Canvas */}
        <div className="lg:col-span-8 relative min-h-[380px] lg:min-h-[520px] bg-stone-950">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                key={`${storeLocation.lat}-${storeLocation.lng}`}
                style={{ width: '100%', height: '100%', minHeight: '380px' }}
                defaultCenter={storeLocation}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                gestureHandling="greedy"
                fullscreenControl={true}
                streetViewControl={true}
              >
                <AdvancedMarker
                  position={storeLocation}
                  onClick={() => setSelectedMarker(true)}
                  title={storeName}
                >
                  <Pin
                    background="#059669"
                    borderColor="#064e3b"
                    glyphColor="#ffffff"
                    scale={1.2}
                  />
                </AdvancedMarker>

                {selectedMarker && (
                  <InfoWindow
                    position={storeLocation}
                    onCloseClick={() => setSelectedMarker(false)}
                  >
                    <div className="p-2 text-stone-900 max-w-xs">
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1">
                        100% Certified Organic
                      </div>
                      <h4 className="font-serif font-bold text-base text-stone-900 leading-tight">
                        {storeName}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">
                        {fullAddress}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1">
                        <span>★ 4.9</span>
                        <span className="text-stone-400 font-normal">(384 Google Reviews)</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1.5 border-t border-stone-200 pt-1.5">
                        {settings?.hoursWeekday || 'Open today until 8:00 PM'} • Free EV charging &amp; bike racks
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block w-full text-center py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                      >
                        Navigate to Store
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-stone-950">
              <MapPin className="w-12 h-12 text-emerald-500 mb-3 animate-bounce" />
              <p className="text-stone-300 font-medium">Google Maps interactive canvas ready</p>
              <p className="text-xs text-stone-500 mt-1 max-w-md">
                {fullAddress} • Geocoordinates {storeLocation.lat}° N, {storeLocation.lng}° W
              </p>
            </div>
          )}

          {/* Quick Overlay Badge */}
          <div className="absolute top-4 left-4 z-10 bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/80 shadow-lg text-xs font-medium text-stone-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Store Hours: {settings?.hoursWeekday || 'Mon - Sat: 7:30 AM – 8:00 PM'}</span>
          </div>
        </div>

        {/* Right Column: Local Transit & Route Directions Tool */}
        <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-between bg-stone-950 border-t lg:border-t-0 lg:border-l border-stone-800">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                Find Fast Driving &amp; Transit Directions
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Enter your neighborhood or address to calculate fastest local route to fresh organic produce.
              </p>

              <form onSubmit={handleGetDirections} className="mt-3 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={directionsFrom}
                    onChange={(e) => setDirectionsFrom(e.target.value)}
                    placeholder="e.g., Hawthorne, Downtown, Beaverton..."
                    className="w-full pl-3 pr-20 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Go
                  </button>
                </div>
                {directionsStatus && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    ✓ {directionsStatus}
                  </p>
                )}
              </form>
            </div>

            {/* Local Store Highlights */}
            <div className="space-y-3 pt-4 border-t border-stone-800">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold text-stone-200">Local Operating Hours</h5>
                  <p className="text-xs text-stone-400">{settings?.hoursWeekday || 'Monday – Saturday: 7:30 AM – 8:00 PM'}</p>
                  <p className="text-xs text-stone-400">{settings?.hoursSunday || 'Sunday: 8:30 AM – 6:00 PM'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Car className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold text-stone-200">Parking &amp; Curbside Pickup</h5>
                  <p className="text-xs text-stone-400">{settings?.parkingNote || 'Dedicated 24-car customer lot behind store. 10 designated curbside bays.'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Bike className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold text-stone-200">Eco-Transit &amp; Bike Friendly</h5>
                  <p className="text-xs text-stone-400">Belmont Bikeway Station #14. TriMet Bus Lines 15 &amp; 70 drop right at the entrance.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold text-stone-200">100% Organic Guarantee</h5>
                  <p className="text-xs text-stone-400">Oregon Tilth Certified Organic retailer. USDA Organic verified supply chain.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 mt-6">
            <div className="bg-stone-900/90 rounded-2xl p-3.5 border border-stone-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Local Search Authority</span>
                <span className="font-semibold text-emerald-400">#1 Organic Food Near Me</span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block text-[11px]">Google Map Score</span>
                <span className="font-bold text-white">4.9 ★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
