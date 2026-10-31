'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { TirumalaStayLocation } from '@/data/tirumalaAccommodation';

interface TirumalaAccommodationMapProps {
  locations: TirumalaStayLocation[];
  activeLocationId: string | null;
  onSelectLocation?: (location: TirumalaStayLocation) => void;
}

export default function TirumalaAccommodationMap({
  locations,
  activeLocationId,
  onSelectLocation
}: TirumalaAccommodationMapProps) {
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

      // Center around Tirumala hilltop administrative center
      const map = L.map(mapContainerRef.current, {
        center: [13.6835, 79.3495],
        zoom: 15,
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
        let pinColor = '#059669'; // Free PAC green
        let pinSymbol = 'H';
        if (loc.category === 'allotment_counter') {
          pinColor = '#D97706'; // Allotment amber
          pinSymbol = 'C';
        } else if (loc.category === 'sub_enquiry') {
          pinColor = '#7C3AED'; // Sub enquiry purple
          pinSymbol = 'E';
        } else if (loc.category === 'rest_house_mutt') {
          pinColor = '#2563EB'; // Rest house blue
          pinSymbol = 'R';
        }

        const customIcon = L.divIcon({
          className: 'stay-map-pin',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: ${pinColor};
              border: 2px solid #FFFFFF;
              box-shadow: 0 3px 8px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-weight: 800;
              font-size: 13px;
              cursor: pointer;
              transition: transform 0.15s ease;
            ">
              ${pinSymbol}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const popupHtml = `
          <div style="font-family: inherit; min-width: 220px; padding: 4px 2px;">
            <div style="display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; background: ${pinColor}15; color: ${pinColor}; border: 1px solid ${pinColor}30;">
              ${loc.categoryLabel}
            </div>
            <div style="font-size: 13.5px; font-weight: 700; color: #0F172A; line-height: 1.3; margin-bottom: 3px;">
              ${loc.name}
            </div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${loc.landmark}</span>
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
                  padding: 5px 10px;
                  border-radius: 6px;
                  font-size: 11.5px;
                  font-weight: 700;
                "
              >
                Directions ↗
              </a>
              ${loc.phone ? `
                <a 
                  href="tel:${loc.phone}"
                  style="
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background-color: #F1F5F9;
                    color: #0F172A;
                    text-decoration: none;
                    padding: 5px 10px;
                    border-radius: 6px;
                    font-size: 11.5px;
                    font-weight: 700;
                    border: 1px solid #CBD5E1;
                  "
                >
                  Call
                </a>
              ` : ''}
            </div>
          </div>
        `;

        const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupHtml);

        marker.on('click', () => {
          if (onSelectLocation) {
            onSelectLocation(loc);
          }
        });

        markersMap[loc.id] = marker;
        bounds.extend([loc.coordinates.lat, loc.coordinates.lng]);
      });

      markersRef.current = markersMap;

      if (locations.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  // Handle active location change (pan and open popup)
  useEffect(() => {
    if (!activeLocationId || !mapInstanceRef.current) return;
    const marker = markersRef.current[activeLocationId];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 16, { animate: true });
      marker.openPopup();
    }
  }, [activeLocationId]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: '100%', 
        height: '420px', 
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }} 
    />
  );
}

