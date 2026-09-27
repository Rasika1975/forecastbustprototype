import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Legend data ----------------------------------------------------------------

const riskLevels = [
  { label: "0–20% Very Low", color: "#10b981" },
  { label: "20–40% Low", color: "#84cc16" },
  { label: "40–60% Moderate", color: "#f59e0b" },
  { label: "60–80% High", color: "#f97316" },
  { label: "80–100% Very High", color: "#ef4444" },
];
const rainLevels = [
  { label: "< 5 mm Trace", color: "#dcfce7" },
  { label: "5–20 mm Light", color: "#86efac" },
  { label: "20–50 mm Moderate", color: "#fde047" },
  { label: "50–100 mm Heavy", color: "#fb923c" },
  { label: "> 100 mm Extreme", color: "#ef4444" },
];
const tempLevels = [
  { label: "< 25 °C Cool", color: "#93c5fd" },
  { label: "25–32 °C Moderate", color: "#fde047" },
  { label: "32–38 °C Hot", color: "#fb923c" },
  { label: "38–44 °C Severe", color: "#ef4444" },
  { label: "> 44 °C Extreme", color: "#991b1b" },
];
const windLevels = [
  { label: "< 15 km/h Light", color: "#ccfbf1" },
  { label: "15–35 km/h Moderate", color: "#5eead4" },
  { label: "35–55 km/h Strong", color: "#0d9488" },
  { label: "55–75 km/h Gale", color: "#0f766e" },
  { label: "> 75 km/h Cyclone", color: "#115e59" },
];

// Legend UI (plain inline styles — lives inside Leaflet DOM) -----------------

function LegendUI({ viewMode, hazard }) {
  const [collapsed, setCollapsed] = useState(false);

  let levels = riskLevels;
  let title = "Bust Risk";
  if (viewMode !== "risk") {
    if (hazard === "temp") { levels = tempLevels; title = "Temperature"; }
    else if (hazard === "wind") { levels = windLevels; title = "Wind Speed"; }
    else { levels = rainLevels; title = "Precipitation"; }
  }

  const card = {
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(6px)",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(15,23,42,0.18)",
    minWidth: "130px",
    maxWidth: "165px",
    overflow: "hidden",
    fontFamily: "system-ui,-apple-system,sans-serif",
  };

  return (
    <div style={card}>
      {/* Header — tap to collapse */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        style={{
          display: "flex", width: "100%", alignItems: "center",
          justifyContent: "space-between", padding: "7px 10px",
          background: "none", border: "none", cursor: "pointer", gap: "6px",
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#1e293b" }}>
          {title}
        </span>
        <span style={{ color: "#94a3b8", fontSize: "11px", lineHeight: 1 }}>
          {collapsed ? "▾" : "▴"}
        </span>
      </button>

      {!collapsed && (
        <div style={{ padding: "0 10px 9px", borderTop: "1px solid #f1f5f9" }}>
          {levels.map((lv) => (
            <div key={lv.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "5px" }}>
              <span style={{ width: "11px", height: "11px", borderRadius: "3px", flexShrink: 0, border: "1px solid rgba(0,0,0,0.1)", background: lv.color }} />
              <span style={{ fontSize: "10px", fontWeight: 500, color: "#334155", lineHeight: 1.3 }}>
                {lv.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Leaflet Control — renders inside the map DOM so it never escapes -----------

export default function MapLegend({ viewMode, hazard }) {
  const map = useMap();
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const LegendControl = L.Control.extend({
      onAdd() {
        const div = L.DomUtil.create("div");
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        setContainer(div);
        return div;
      },
      onRemove() {
        setContainer(null);
      },
    });

    const ctrl = new LegendControl({ position: "bottomleft" });
    ctrl.addTo(map);
    return () => { ctrl.remove(); };
  }, [map]);

  if (!container) return null;
  return createPortal(<LegendUI viewMode={viewMode} hazard={hazard} />, container);
}
