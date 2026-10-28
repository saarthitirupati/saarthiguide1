'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MedicalLocation } from '@/data/medicalLocations';

interface MedicalInteractiveMapProps {
  locations: MedicalLocation[];
  activeLocationId: string | null;
  onSelectLocation: (location: MedicalLocation) => void;
}

export default function MedicalInteractiveMap({
  locations,
  activeLocationId,
  onSelectLocation
}: MedicalInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [13.6825, 79.3500],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; OpenStreetMap contributors')
        .addTo(map);

      const bounds = L.latLngBounds([]);
      const markersMap: Record<string, any> = {};

      locations.forEach((loc) => {
        const customIcon = L.divIcon({
          className: 'medical-map-pin',
          html: `
            <div style="
              width: 34px;
              height: 34px;
              border-radius: 50%;
              background-color: #DC2626;
              border: 2px solid #FFFFFF;
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              cursor: pointer;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -19]
        });

        const popupHtml = `
          <div style="font-family: inherit; min-width: 210px; padding: 4px 2px;">
            <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.3; margin-bottom: 3px;">
              ${loc.name}
            </div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
              ${loc.subtitle} · ${loc.landmark}
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <a 
                href="${loc.navigationUrl}" 
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
              ${loc.phone ? `
                <a 
                  href="tel:${loc.phone}" 
                  style="
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background-color: #FEE2E2;
                    color: #DC2626;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 5px 10px;
                    border-radius: 6px;
                  "
                >
                  Call
                </a>
              ` : ''}
            </div>
          </div>
        `;

        const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], {
          icon: customIcon
        })
          .addTo(map)
          .bindPopup(popupHtml);

        marker.on('click', () => {
          onSelectLocation(loc);
        });

        markersMap[loc.id] = marker;
        bounds.extend([loc.coordinates.lat, loc.coordinates.lng]);
      });

      markersRef.current = markersMap;

      if (locations.length > 0) {
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 17 });
      }

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
  }, [locations, onSelectLocation]);

  useEffect(() => {
    if (!activeLocationId || !mapInstanceRef.current) return;
    const marker = markersRef.current[activeLocationId];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 17, { animate: true });
      marker.openPopup();
    }
  }, [activeLocationId]);

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
