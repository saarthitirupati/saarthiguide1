import React from 'react';

interface PilgrimagePathWatermarkProps {
  opacity?: number;
  className?: string;
}

export function PilgrimagePathWatermark({ opacity = 0.22, className }: PilgrimagePathWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 8px 24px 8px',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', opacity }}>
        <svg
          viewBox="0 0 540 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          {/* DEFINITIONS & GRADIENTS */}
          <defs>
            <linearGradient id="hillGradBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F5132" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#0F5132" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="hillGradFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F5132" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#0F5132" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A72C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D4A72C" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* 1. BACKGROUND: Seshachalam 7 Sacred Hills Ridge (Sapthagiri) */}
          <path
            d="M 0 106 L 0 88 Q 50 68, 110 76 T 230 62 T 350 52 T 460 68 T 540 76 L 540 106 Z"
            fill="url(#hillGradBack)"
          />
          <path
            d="M 20 106 Q 90 80, 170 88 T 320 74 T 470 84 L 540 106 Z"
            fill="url(#hillGradFront)"
          />

          {/* 2. GROUND BASELINE */}
          <line x1="6" y1="106" x2="534" y2="106" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />

          {/* 3. LEFT: Alipiri Maha Dwaram (Ornate Dravidian Entrance Gate) */}
          {/* Base Steps */}
          <line x1="14" y1="106" x2="70" y2="106" stroke="#0F5132" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="103" x2="66" y2="103" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />

          {/* Left & Right Pillars with Decorative Mouldings */}
          <rect x="22" y="66" width="9" height="37" rx="1.5" stroke="#0F5132" strokeWidth="1.5" fill="#FFFDF7" />
          <rect x="53" y="66" width="9" height="37" rx="1.5" stroke="#0F5132" strokeWidth="1.5" fill="#FFFDF7" />
          {/* Pillar Ring Details */}
          <line x1="22" y1="76" x2="31" y2="76" stroke="#0F5132" strokeWidth="1" />
          <line x1="53" y1="76" x2="62" y2="76" stroke="#0F5132" strokeWidth="1" />
          <line x1="22" y1="94" x2="31" y2="94" stroke="#0F5132" strokeWidth="1" />
          <line x1="53" y1="94" x2="62" y2="94" stroke="#0F5132" strokeWidth="1" />

          {/* Central Archway */}
          <path
            d="M 31 103 V 80 Q 42 70, 53 80 V 103"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Arch Cornice Beam & Decorative Pediment */}
          <rect x="18" y="62" width="48" height="4.5" rx="1" stroke="#0F5132" strokeWidth="1.5" fill="#FFFDF7" />
          <path
            d="M 23 62 L 29 48 H 55 L 61 62 Z"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="#FFFDF7"
          />
          {/* Arch Temple Tier 2 */}
          <path
            d="M 32 48 L 35 40 H 49 L 52 48 Z"
            stroke="#0F5132"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Golden Kalasams on Alipiri Arch */}
          <line x1="38" y1="40" x2="38" y2="34" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="42" y1="40" x2="42" y2="31" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="40" x2="46" y2="34" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />

          {/* 4. CENTER: The Sacred Path (Srivari Mettu & Ghat Road) */}
          {/* S-Curve Dotted Path leading uphill */}
          <path
            d="M 64 98 C 110 98, 125 87, 165 89 C 205 91, 230 76, 275 80 C 320 84, 345 68, 385 75 C 410 79, 425 89, 442 95"
            stroke="#0F5132"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="5 5"
          />

          {/* Milestone (KM 7 - Srivari Mettu Halfway) */}
          <path
            d="M 128 106 V 97 A 4 4 0 0 1 136 97 V 106 Z"
            stroke="#0F5132"
            strokeWidth="1.25"
            fill="#FFFDF7"
          />
          <line x1="130" y1="100" x2="134" y2="100" stroke="#D4A72C" strokeWidth="1.5" strokeLinecap="round" />

          {/* Seshachalam Forest Tree 1 */}
          <line x1="102" y1="106" x2="102" y2="92" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M 102 92 C 96 92, 93 86, 96 82 C 94 76, 102 74, 106 78 C 110 74, 116 78, 114 83 C 117 87, 111 92, 102 92 Z"
            stroke="#0F5132"
            strokeWidth="1.25"
            fill="url(#hillGradBack)"
          />

          {/* Halfway Mandapam (Gali Gopuram / Mokalla Parvatham Resting Mantapam) */}
          <line x1="198" y1="106" x2="232" y2="106" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />
          {/* 4 Stone Pillars */}
          <line x1="202" y1="106" x2="202" y2="86" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="210" y1="106" x2="210" y2="86" stroke="#0F5132" strokeWidth="1.25" strokeLinecap="round" />
          <line x1="220" y1="106" x2="220" y2="86" stroke="#0F5132" strokeWidth="1.25" strokeLinecap="round" />
          <line x1="228" y1="106" x2="228" y2="86" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />
          {/* Mandapam Cornice & Sloping Roof */}
          <line x1="197" y1="86" x2="233" y2="86" stroke="#0F5132" strokeWidth="1.75" strokeLinecap="round" />
          <path
            d="M 199 86 L 204 77 H 226 L 231 86 Z"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="#FFFDF7"
          />
          {/* Mandapam Golden Flag */}
          <line x1="215" y1="77" x2="215" y2="68" stroke="#D4A72C" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M 215 68 L 223 71.5 L 215 75 Z"
            fill="#D4A72C"
          />

          {/* Seshachalam Forest Tree 2 */}
          <line x1="295" y1="106" x2="295" y2="90" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M 295 90 C 289 90, 286 84, 289 80 C 287 75, 295 72, 299 76 C 304 72, 310 76, 308 81 C 311 85, 305 90, 295 90 Z"
            stroke="#0F5132"
            strokeWidth="1.25"
            fill="url(#hillGradBack)"
          />

          {/* Stepped Pilgrimage Stones (Mettu) */}
          <line x1="250" y1="83" x2="258" y2="83" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
          <line x1="262" y1="81" x2="270" y2="81" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
          <line x1="330" y1="83" x2="338" y2="83" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
          <line x1="342" y1="80" x2="350" y2="80" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />

          {/* 5. RIGHT: Golden Dwajasthambham (Temple Flagstaff) */}
          <line x1="392" y1="106" x2="392" y2="46" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
          {/* Flagstaff rings */}
          <line x1="390" y1="90" x2="394" y2="90" stroke="#D4A72C" strokeWidth="1.5" />
          <line x1="390" y1="72" x2="394" y2="72" stroke="#D4A72C" strokeWidth="1.5" />
          <line x1="390" y1="56" x2="394" y2="56" stroke="#D4A72C" strokeWidth="1.5" />
          {/* Flagstaff Golden Flag with Garuda silhouette */}
          <path
            d="M 392 46 Q 380 50, 368 47 Q 380 57, 392 56 Z"
            fill="#D4A72C"
            stroke="#D4A72C"
            strokeWidth="1"
          />

          {/* 6. RIGHT: Ananda Nilayam Golden Sanctum Vimanam (Golden Dome) */}
          {/* Vimanam Sanctum Base */}
          <rect x="402" y="90" width="36" height="16" rx="1" stroke="#0F5132" strokeWidth="1.5" fill="#FFFDF7" />
          <line x1="402" y1="96" x2="438" y2="96" stroke="#0F5132" strokeWidth="1" />
          {/* Stepped Golden Dome of Ananda Nilayam */}
          <path
            d="M 405 90 C 405 78, 412 70, 420 68 C 428 70, 435 78, 435 90 Z"
            stroke="#D4A72C"
            strokeWidth="1.75"
            fill="url(#goldGrad)"
          />
          {/* Ananda Nilayam Golden Kalasams */}
          <line x1="416" y1="68" x2="416" y2="59" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="420" y1="68" x2="420" y2="55" stroke="#D4A72C" strokeWidth="2.25" strokeLinecap="round" />
          <line x1="424" y1="68" x2="424" y2="59" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />

          {/* 7. RIGHT: Majestic 5-Tiered Dravidian Raja Gopuram */}
          {/* Tier 1 (Base & Gate) */}
          <path
            d="M 444 106 L 449 88 H 515 L 520 106 Z"
            stroke="#0F5132"
            strokeWidth="1.75"
            strokeLinejoin="round"
            fill="#FFFDF7"
          />
          {/* Entrance Doorway */}
          <path
            d="M 476 106 V 95 Q 482 91, 488 95 V 106"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="url(#hillGradFront)"
          />
          {/* Tier 1 Cornice */}
          <line x1="446" y1="88" x2="518" y2="88" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />

          {/* Tier 2 */}
          <path
            d="M 452 88 L 456 74 H 508 L 512 88 Z"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="#FFFDF7"
          />
          {/* Tier 2 Windows/Niches (Kudu arches) */}
          <circle cx="474" cy="81" r="2.5" stroke="#0F5132" strokeWidth="1" />
          <circle cx="490" cy="81" r="2.5" stroke="#0F5132" strokeWidth="1" />
          <line x1="450" y1="74" x2="514" y2="74" stroke="#0F5132" strokeWidth="1.5" strokeLinecap="round" />

          {/* Tier 3 */}
          <path
            d="M 459 74 L 463 61 H 501 L 505 74 Z"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="#FFFDF7"
          />
          {/* Tier 3 Niche */}
          <circle cx="482" cy="67.5" r="2" stroke="#0F5132" strokeWidth="1" />
          <line x1="458" y1="61" x2="506" y2="61" stroke="#0F5132" strokeWidth="1.25" strokeLinecap="round" />

          {/* Tier 4 */}
          <path
            d="M 465 61 L 468 50 H 496 L 499 61 Z"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="#FFFDF7"
          />
          <line x1="465" y1="50" x2="499" y2="50" stroke="#0F5132" strokeWidth="1.25" strokeLinecap="round" />

          {/* Tier 5 (Apex / Crown) */}
          <path
            d="M 470 50 L 472 40 H 492 L 494 50 Z"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="#FFFDF7"
          />
          {/* Barrel Vault Barrel Top (Shikara) */}
          <path
            d="M 471 40 Q 482 34, 493 40 Z"
            stroke="#0F5132"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="url(#goldGrad)"
          />

          {/* 5 Golden Gopuram Kalasams */}
          <line x1="474" y1="36" x2="474" y2="29" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="478" y1="35" x2="478" y2="27" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="482" y1="34" x2="482" y2="25" stroke="#D4A72C" strokeWidth="2.25" strokeLinecap="round" />
          <line x1="486" y1="35" x2="486" y2="27" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="490" y1="36" x2="490" y2="29" stroke="#D4A72C" strokeWidth="1.75" strokeLinecap="round" />

          {/* 8. CENTER SKY: Sacred Lord Venkateswara Tiruman (Namam) Emblem */}
          <g transform="translate(262, 22)">
            {/* White/Green U-Shape (Padam) */}
            <path
              d="M 4 2 V 14 C 4 19, 14 19, 14 14 V 2"
              stroke="#0F5132"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Central Red/Gold Tilak (Kasturi) */}
            <line x1="9" y1="0" x2="9" y2="15" stroke="#D97732" strokeWidth="2" strokeLinecap="round" />
            {/* Outer Shankha & Chakra minimalist wings */}
            <path
              d="M -3 6 Q -9 1, -11 6 Q -8 11, -3 8"
              stroke="#D4A72C"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M 21 6 Q 27 1, 29 6 Q 26 11, 21 8"
              stroke="#D4A72C"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </g>

        </svg>

        {/* Rapido-Inspired Clean Brand Tag & Waypoints */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 800,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              color: '#0F5132',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              lineHeight: 1.1,
            }}
          >
            <span>#saarthiguide</span>
          </div>
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#0F5132',
              opacity: 0.65,
            }}
          >
            Alipiri • Srivari Mettu • Tirumala
          </div>
        </div>
      </div>
    </div>
  );
}

export default PilgrimagePathWatermark;
