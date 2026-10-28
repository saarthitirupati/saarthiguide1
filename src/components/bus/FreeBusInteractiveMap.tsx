'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { BusStationStop } from '@/data/freeBusStations';

interface FreeBusInteractiveMapProps {
  stops: BusStationStop[];
  activeStopId: string | null;
  onSelectStop: (stop: BusStationStop) => void;
}

export default function FreeBusInteractiveMap({
  stops,
  activeStopId,
  onSelectStop
}: FreeBusInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet on client-side
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initial center: Tirumala Hilltop
      const map = L.map(mapContainerRef.current, {
        center: [13.6828, 79.3495],
        zoom: 15,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Attribution control in bottom right
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; OpenStreetMap contributors')
        .addTo(map);

      const bounds = L.latLngBounds([]);
      const markersMap: Record<string, any> = {};

      stops.forEach((stop) => {
        const isApsrtc = stop.type === 'apsrtc';
        const bgColor = isApsrtc ? '#B45309' : '#0F5132';

        const customIcon = L.divIcon({
          className: 'bus-stop-map-pin',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: ${bgColor};
              border: 2px solid #FFFFFF;
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              cursor: pointer;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 6v6"></path>
                <path d="M15 6v6"></path>
                <path d="M2 12h19.6"></path>
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
                <circle cx="7" cy="18" r="2"></circle>
                <path d="M9 18h5"></path>
                <circle cx="16" cy="18" r="2"></circle>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const popupHtml = `
          <div style="font-family: inherit; min-width: 210px; padding: 4px 2px;">
            <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.3; margin-bottom: 3px;">
              ${stop.name}
            </div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
              ${stop.subtitle}
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <a 
                href="${stop.navigationUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                style="
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  background-color: #0F5132;
                  color: #FFFFFF;
                  text-decoration: none;
                  font-size: 11px;
                  font-weight: 700;
                  padding: 5px 10px;
                  border-radius: 6px;
                "
              >
                Directions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([stop.coordinates.lat, stop.coordinates.lng], {
          icon: customIcon
        })
          .addTo(map)
          .bindPopup(popupHtml);

        marker.on('click', () => {
          onSelectStop(stop);
        });

        markersMap[stop.id] = marker;
        bounds.extend([stop.coordinates.lat, stop.coordinates.lng]);
      });

      markersRef.current = markersMap;

      if (stops.length > 0) {
        map.fitBounds(bounds, { padding: [35, 35] });
      }

      // Ensure proper render size
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops, onSelectStop]);

  // Handle active stop change (pan to marker and open popup)
  useEffect(() => {
    if (!activeStopId || !mapInstanceRef.current) return;
    const marker = markersRef.current[activeStopId];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 17, { animate: true });
      marker.openPopup();
    }
  }, [activeStopId]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: '100%', 
        height: '420px', 
        borderRadius: '14px', 
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
        zIndex: 1
      }} 
    />
  );
}
