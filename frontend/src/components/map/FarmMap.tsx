import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Field } from '../../types';
import {
  Layers,
  Eye,
  ShieldAlert,
  Sparkles,
  Maximize2,
  Info,
  ChevronRight,
  Crosshair,
  Satellite,
  Compass,
  Wind,
  Droplets,
  Sprout,
  Activity,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface FarmMapProps {
  height?: string;
  selectedField?: Field | null;
  onSelectField?: (field: Field) => void;
  className?: string;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  height = 'h-[380px]',
  selectedField,
  onSelectField,
  className = '',
}) => {
  const { fields, setSelectedFieldId, setCurrentRoute } = useApp();

  const [activeLayers, setActiveLayers] = useState<{
    ndvi: boolean;
    crops: boolean;
    chemicals: boolean;
    risks: boolean;
    buffers: boolean;
  }>({
    ndvi: true,
    crops: true,
    chemicals: true,
    risks: true,
    buffers: true,
  });

  const [hoveredField, setHoveredField] = useState<Field | null>(null);
  const [activeFieldDetail, setActiveFieldDetail] = useState<Field | null>(selectedField || fields[0] || null);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lon: string; alt: string; moisture: string }>({
    lat: '20.1985° N',
    lon: '73.8315° E',
    alt: '584m MSL',
    moisture: '68% VWC (Optimal)',
  });

  useEffect(() => {
    if (selectedField) {
      setActiveFieldDetail(selectedField);
    }
  }, [selectedField]);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleFieldClick = (field: Field) => {
    setActiveFieldDetail(field);
    if (onSelectField) {
      onSelectField(field);
    } else {
      setSelectedFieldId(field.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const lat = (20.208 - y * 0.025).toFixed(4);
    const lon = (73.82 - (1 - x) * 0.025).toFixed(4);
    setCursorCoords({
      lat: `${lat}° N`,
      lon: `${lon}° E`,
      alt: `${Math.round(580 + (1 - y) * 12)}m MSL`,
      moisture: `${Math.round(62 + y * 12)}% VWC`,
    });
  };

  const getAgronomicFieldStyle = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          stroke: '#B91C1C', // Rust Red
          fill: '#B91C1C',
          text: 'text-[#FCA5A5]',
          bg: 'bg-[#7F1D1D]/90',
          badge: '🔴 BLIGHT / PHI ALERT',
        };
      case 'MEDIUM':
        return {
          stroke: '#D97706', // Amber Ochre
          fill: '#D97706',
          text: 'text-[#FCD34D]',
          bg: 'bg-[#78350F]/90',
          badge: '🟠 MODERATE WATCH',
        };
      default:
        return {
          stroke: '#2D6A4F', // Active Crop Green
          fill: '#2D6A4F',
          text: 'text-[#D8F3DC]',
          bg: 'bg-[#14281D]/90',
          badge: '🟢 VIGOROUS / HARVEST READY',
        };
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative w-full rounded-xl border border-earth-border bg-[#14281D] overflow-hidden shadow-panel select-none ${height} ${className}`}
    >
      {/* Real-World Soil & Foliage Cartography Canvas */}
      <div className="absolute inset-0 bg-[#0F2017] bg-geo-grid flex items-center justify-center overflow-hidden">
        {/* Subtle Organic Field Contours */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <div className="w-[620px] h-[620px] rounded-full border border-[#52B788]/20 flex items-center justify-center">
            <div className="w-[420px] h-[420px] rounded-full border border-[#52B788]/20 flex items-center justify-center">
              <div className="w-[220px] h-[220px] rounded-full border border-[#52B788]/30" />
            </div>
          </div>
        </div>

        {/* Vector Parcels Representation */}
        <div className="relative w-full h-full p-4 flex items-center justify-center">
          <svg viewBox="0 0 800 450" className="w-full h-full max-h-[360px] drop-shadow-2xl">
            {/* Irrigation Canal & Soil Moisture Buffer */}
            {activeLayers.buffers && (
              <path
                d="M 40 385 Q 290 355 450 395 T 760 375"
                fill="none"
                stroke="#1D70B8"
                strokeWidth="22"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
            )}
            <path
              d="M 50 385 Q 290 355 450 395 T 750 375"
              fill="none"
              stroke="#0284C7"
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.85"
            />
            <text x="590" y="365" fill="#7DD3FC" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono" opacity="0.9">
              Godavari Irrigation Canal (Moisture Buffer Zone)
            </text>

            {/* Field Polygons */}
            {fields.map((field) => {
              const agriStyle = getAgronomicFieldStyle(field.riskLevel);
              const isSelected = activeFieldDetail?.id === field.id;
              const isHovered = hoveredField?.id === field.id;

              const fieldPaths: Record<string, string> = {
                'field-a': 'M 100 80 L 320 70 L 300 200 L 110 210 Z',
                'field-b': 'M 115 225 L 300 215 L 280 340 L 125 350 Z',
                'field-c': 'M 340 75 L 530 65 L 515 195 L 325 205 Z',
                'field-d': 'M 325 220 L 515 210 L 490 340 L 305 345 Z',
                'field-e': 'M 550 70 L 710 60 L 695 185 L 535 195 Z',
                'field-f': 'M 535 215 L 695 205 L 675 330 L 515 340 Z',
              };

              const centerPoints: Record<string, [number, number]> = {
                'field-a': [200, 140],
                'field-b': [200, 280],
                'field-c': [420, 135],
                'field-d': [400, 275],
                'field-e': [620, 130],
                'field-f': [600, 270],
              };

              const center = centerPoints[field.id] || [200, 140];
              const path = fieldPaths[field.id] || 'M 100 80 L 300 80 L 300 200 L 100 200 Z';

              const fillOpacity = isSelected ? 0.75 : isHovered ? 0.6 : 0.4;

              return (
                <g
                  key={field.id}
                  onClick={() => handleFieldClick(field)}
                  onMouseEnter={() => setHoveredField(field)}
                  onMouseLeave={() => setHoveredField(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Field Area */}
                  <path
                    d={path}
                    fill={agriStyle.fill}
                    fillOpacity={fillOpacity}
                    stroke={isSelected ? '#D8F3DC' : agriStyle.stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeDasharray={field.status === 'HARVESTING' ? '5,3' : undefined}
                    className="transition-all duration-200 hover:brightness-125"
                  />

                  {/* Field Code */}
                  <text
                    x={center[0]}
                    y={center[1] - 8}
                    textAnchor="middle"
                    fill="#FAF8F5"
                    fontSize="12"
                    fontWeight="800"
                    fontFamily="JetBrains Mono"
                    className="select-none pointer-events-none drop-shadow-md"
                  >
                    {field.code}
                  </text>

                  {/* Active Crop Tag */}
                  {activeLayers.crops && (
                    <text
                      x={center[0]}
                      y={center[1] + 8}
                      textAnchor="middle"
                      fill="#D8F3DC"
                      fontSize="9"
                      fontWeight="600"
                      className="select-none pointer-events-none"
                    >
                      {field.currentCrop.split(' ')[0]} • {(field.acreage * 0.4047).toFixed(1)} ha
                    </text>
                  )}

                  {/* Risk Alert Badge */}
                  {activeLayers.risks && field.riskLevel === 'HIGH' && (
                    <g transform={`translate(${center[0] - 22}, ${center[1] + 16})`}>
                      <rect
                        width="44"
                        height="15"
                        rx="3"
                        fill="#B91C1C"
                        className="animate-pulse"
                      />
                      <text
                        x="22"
                        y="11"
                        textAnchor="middle"
                        fill="#FAF8F5"
                        fontSize="8"
                        fontWeight="800"
                        fontFamily="JetBrains Mono"
                      >
                        PHI OVERLAP
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Top Left: GIS Field Station Header */}
      <div className="absolute top-3 left-3 z-10 hud-glass px-3.5 py-2 rounded-lg text-[#FAF8F5] shadow-lg pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52B788] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52B788]" />
          </span>
          <h4 className="text-xs font-bold font-mono tracking-tight text-[#FAF8F5] uppercase">
            GEOSPATIAL PARCEL TELEMETRY
          </h4>
        </div>
        <p className="text-[10px] font-mono text-[#A7D7B5] mt-0.5">
          Nashik Dindori Cluster • 6 Active Parcels • 48.5 ac (19.6 ha)
        </p>
      </div>

      {/* Top Right: Agronomic Layer Toggles */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 hud-glass p-1.5 rounded-lg text-[#FAF8F5] shadow-lg pointer-events-auto">
        <span className="text-[10px] font-mono font-bold text-[#A7D7B5] px-1.5 hidden sm:inline flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#52B788]" /> LAYERS:
        </span>
        <button
          onClick={() => toggleLayer('ndvi')}
          className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
            activeLayers.ndvi ? 'bg-[#2D6A4F] text-[#D8F3DC]' : 'text-[#A7D7B5] hover:text-white'
          }`}
        >
          NDVI VIGOR
        </button>
        <button
          onClick={() => toggleLayer('chemicals')}
          className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
            activeLayers.chemicals ? 'bg-[#2D6A4F] text-[#D8F3DC]' : 'text-[#A7D7B5] hover:text-white'
          }`}
        >
          CHEMICAL LOGS
        </button>
        <button
          onClick={() => toggleLayer('risks')}
          className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
            activeLayers.risks ? 'bg-[#B91C1C] text-[#FAF8F5]' : 'text-[#A7D7B5] hover:text-white'
          }`}
        >
          PHI RISKS
        </button>
        <button
          onClick={() => toggleLayer('buffers')}
          className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
            activeLayers.buffers ? 'bg-[#1D70B8] text-white' : 'text-[#A7D7B5] hover:text-white'
          }`}
        >
          WATER BUFFER
        </button>
      </div>

      {/* Bottom Left: Live Agronomic Cursor Telemetry */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 hud-glass px-3 py-1.5 rounded-lg text-[#FAF8F5] font-mono text-[10px] shadow-lg">
        <div className="flex items-center gap-1 text-[#52B788] font-bold">
          <Crosshair className="w-3 h-3" />
          <span>GPS:</span>
        </div>
        <span>{cursorCoords.lat}</span>
        <span className="text-[#2D6A4F]">•</span>
        <span>{cursorCoords.lon}</span>
        <span className="text-[#2D6A4F]">•</span>
        <span className="text-[#A7D7B5]">{cursorCoords.moisture}</span>
      </div>

      {/* Bottom Right: Floating Parcel Telemetry HUD Box */}
      {activeFieldDetail && (
        <div className="absolute bottom-3 right-3 w-72 sm:w-80 z-10 bg-[#FAF8F5]/95 backdrop-blur-md rounded-lg border border-earth-border shadow-modal p-3.5 animate-slide-up text-earth-bark">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-earth-bark">{activeFieldDetail.code}</span>
                <Badge severity={activeFieldDetail.riskLevel} size="sm" beacon mono />
              </div>
              <h4 className="text-xs font-bold text-earth-bark mt-0.5">{activeFieldDetail.name}</h4>
              <p className="text-[11px] text-earth-timber">{activeFieldDetail.currentCrop} • {(activeFieldDetail.acreage * 0.4047).toFixed(1)} ha</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#1B4D3E] bg-[#D8F3DC] px-2 py-0.5 rounded border border-[#A7D7B5]">
              {activeFieldDetail.acreage} ac
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-earth-border text-[11px] font-mono">
            <div>
              <span className="text-earth-timber block text-[9px] uppercase font-bold">WITHHOLDING STATUS</span>
              <span className="font-bold text-earth-bark">{activeFieldDetail.daysUntilHarvest}d to harvest</span>
            </div>
            <div>
              <span className="text-earth-timber block text-[9px] uppercase font-bold">CANOPY TREATMENT</span>
              <span className="font-bold text-earth-bark truncate block">
                {activeFieldDetail.activeIngredientsApplied[0] || 'Clean Soil'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-earth-timber">
              VIGOR: <strong className="text-[#2B9348]">NDVI 0.82 (Healthy)</strong>
            </span>
            <Button
              variant="leaf"
              size="sm"
              onClick={() => {
                setSelectedFieldId(activeFieldDetail.id);
                setCurrentRoute('field-detail');
              }}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              className="text-xs h-7 px-2.5 font-bold"
            >
              Open Parcel Log
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
