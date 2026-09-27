import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const riskLevels = [
  { label: "0–20% (Very Low / 80–100% Confidence)", color: "#10b981", badge: "High Confidence" },
  { label: "20–40% (Low / 60–80% Confidence)", color: "#84cc16", badge: "Moderate High" },
  { label: "40–60% (Moderate / 40–60% Confidence)", color: "#f59e0b", badge: "Caution" },
  { label: "60–80% (High / 20–40% Confidence)", color: "#f97316", badge: "Elevated Danger" },
  { label: "80–100% (Very High / 0–20% Confidence)", color: "#ef4444", badge: "Bust Alert" },
];

const rainLevels = [
  { label: "< 5 mm (Trace / Dry)", color: "#dcfce7" },
  { label: "5–20 mm (Light Rain)", color: "#86efac" },
  { label: "20–50 mm (Moderate Rain)", color: "#fde047" },
  { label: "50–100 mm (Heavy Rain)", color: "#fb923c" },
  { label: "> 100 mm (Extreme Rain)", color: "#ef4444" },
];

const tempLevels = [
  { label: "< 25 °C (Cool / Normal)", color: "#93c5fd" },
  { label: "25–32 °C (Moderate Temp)", color: "#fde047" },
  { label: "32–38 °C (Warm / Hot)", color: "#fb923c" },
  { label: "38–44 °C (Severe Heatwave)", color: "#ef4444" },
  { label: "> 44 °C (Extreme Heat Alert)", color: "#991b1b" },
];

const windLevels = [
  { label: "< 15 km/h (Light Breeze)", color: "#ccfbf1" },
  { label: "15–35 km/h (Moderate Wind)", color: "#5eead4" },
  { label: "35–55 km/h (Strong Wind)", color: "#0d9488" },
  { label: "55–75 km/h (Gale / Storm)", color: "#0f766e" },
  { label: "> 75 km/h (Severe Cyclone)", color: "#115e59" },
];

export default function MapLegend({ viewMode = "risk", hazard = "rain" }) {
  const isRiskMode = viewMode === "risk";

  let levels = riskLevels;
  let title = "Bust Risk & Confidence";
  let footer = "Confidence = 1 − P(Bust). Calibrated P90 error threshold per cell.";

  if (!isRiskMode) {
    if (hazard === "temp") {
      levels = tempLevels;
      title = "2m Surface Temperature (°C)";
      footer = "ECMWF IFS 0.25° grid 2m surface temperature field.";
    } else if (hazard === "wind") {
      levels = windLevels;
      title = "10m Wind Speed (km/h)";
      footer = "ECMWF IFS 0.25° grid 10m surface wind velocity.";
    } else {
      levels = rainLevels;
      title = "Forecast Precipitation (mm)";
      footer = "ECMWF IFS 0.25° 24-hr cumulative surface precipitation.";
    }
  }

  return (
    <Card className="absolute bottom-4 left-4 z-[1000] max-w-[270px] bg-white/95 backdrop-blur border-slate-200 shadow-lg rounded-xl">
      <CardContent className="p-3.5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-800">
          {title}
        </p>

        <div className="space-y-1.5">
          {levels.map((level) => (
            <div
              key={level.label}
              className="flex items-center gap-2 text-xs text-slate-700"
            >
              <span
                className="h-3.5 w-3.5 rounded shrink-0 border border-black/10"
                style={{ backgroundColor: level.color }}
              />
              <span className="font-medium leading-snug">{level.label}</span>
            </div>
          ))}
        </div>

        <Separator className="my-2" />

        <p className="text-[10px] text-slate-500 leading-tight">{footer}</p>
      </CardContent>
    </Card>
  );
}
