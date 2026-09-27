import { useEffect, useState } from "react";
import { getCellDetail } from "../services/staticDataService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MousePointerClick, Loader2 } from "lucide-react";

function getRiskBadge(level) {
  switch (level) {
    case "very_high":
      return { label: "Very High Bust Risk", variant: "danger" };
    case "high":
      return { label: "High Bust Risk", variant: "highRisk" };
    case "moderate":
      return { label: "Moderate Risk", variant: "warning" };
    case "low":
      return { label: "Low Bust Risk", variant: "success" };
    case "very_low":
    default:
      return { label: "High Confidence", variant: "success" };
  }
}

function getCellValue(cell, detail, key, decimals = 1, unit = "") {
  const val = detail?.[key] ?? cell?.[key];
  if (val == null || !Number.isFinite(Number(val))) return "Unavailable";
  return `${Number(val).toFixed(decimals)}${unit}`;
}

function MetricRow({ label, value, tooltip }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex justify-between py-1.5 cursor-default hover:bg-slate-50 rounded px-1 -mx-1 transition-colors">
          <span className="text-slate-500">{label}</span>
          <span className="font-semibold text-slate-900">{value}</span>
        </div>
      </TooltipTrigger>
      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  );
}

export default function GridInfoPanel({ cell, leadDay, validDate, hazard = "rain" }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cell?.cell_id) {
      setDetail(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getCellDetail(cell.cell_id, leadDay, hazard)
      .then((data) => {
        if (isMounted) setDetail(data);
      })
      .catch((err) => {
        console.error("Failed to load cell detail:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cell?.cell_id, leadDay, hazard]);

  if (!cell) {
    return (
      <Card className="shadow-xs border-slate-200 bg-white">
        <CardHeader className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MousePointerClick className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Grid Cell Inspection</CardTitle>
              <CardDescription className="text-xs">Interactive operational drilldown</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
            <p className="text-sm font-semibold text-slate-700">No Cell Selected</p>
            <p className="mt-1.5 text-xs text-slate-400 max-w-[260px] mx-auto leading-relaxed">
              Click any 0.25° grid cell on the map to inspect calibrated bust risk, atmospheric variables, SHAP drivers, and historical analogs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskBadge = getRiskBadge(detail?.risk_level || cell?.risk_level);
  const bustProbPct = Number(((detail?.bust_probability ?? cell?.bust_probability ?? 0) * 100).toFixed(1));
  const confPct = Number(((detail?.confidence ?? cell?.confidence ?? 1) * 100).toFixed(1));
  const rainVal = Number(detail?.forecast_rainfall_mm ?? cell?.rainfall_mm ?? 0).toFixed(1);
  const tempVal = Number(detail?.temperature_c ?? cell?.temperature_c ?? 32).toFixed(1);
  const windVal = Number(detail?.wind_speed_kmh ?? cell?.wind_speed_kmh ?? 18).toFixed(1);

  return (
    <TooltipProvider>
      <Card className="shadow-xs border-slate-200 bg-white">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {detail?.region || cell?.region || "India Grid"}
                </span>
                <span className="text-[11px] text-slate-400">
                  • Day {leadDay} •{" "}
                  {hazard === "temp" ? "Heatwave Temp" : hazard === "wind" ? "Windstorm" : "Precipitation"}
                </span>
              </div>
              <CardTitle className="text-xl mt-0.5">{cell.cell_id}</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                {detail?.state || cell?.state || ""} ({Number(cell.latitude).toFixed(2)}°N,{" "}
                {Number(cell.longitude).toFixed(2)}°E)
              </CardDescription>
            </div>

            <Badge variant={riskBadge.variant} className="text-xs font-bold py-1 px-2.5 shrink-0">
              {riskBadge.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-1 space-y-4">
          {/* KPI METRICS */}
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-default">
                  <span className="text-[11px] text-slate-500 font-medium">Bust Risk</span>
                  <p className="text-lg font-black text-slate-900">{bustProbPct}%</p>
                  <Progress value={bustProbPct} className="h-1.5 mt-1 bg-slate-200" indicatorClassName="bg-red-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Probability the forecast will be a bust (P90 exceedance)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-default">
                  <span className="text-[11px] text-slate-500 font-medium">Confidence</span>
                  <p className="text-lg font-black text-emerald-600">{confPct}%</p>
                  <Progress value={confPct} className="h-1.5 mt-1 bg-slate-200" indicatorClassName="bg-emerald-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Model confidence = 1 − P(Bust), calibrated via Platt scaling</TooltipContent>
            </Tooltip>
          </div>

          {/* TABS DRILLDOWN */}
          <Tabs defaultValue="risk" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-9 bg-slate-100 p-1">
              <TabsTrigger value="risk" className="text-xs font-semibold">
                Risk & Weather
              </TabsTrigger>
              <TabsTrigger value="shap" className="text-xs font-semibold">
                SHAP Drivers
              </TabsTrigger>
              <TabsTrigger value="analogs" className="text-xs font-semibold">
                Historical
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: RISK & WEATHER */}
            <TabsContent value="risk" className="mt-3 text-xs">
              <div className="space-y-0">
                <MetricRow label="Valid Date" value={validDate || cell.valid_date || "2026-09-24"} tooltip="Forecast valid date for this lead day" />
                <Separator />
                <MetricRow label="Forecast Rainfall" value={<span className="text-blue-600">{rainVal} mm</span>} tooltip="Predicted 24-hr cumulative surface precipitation" />
                <Separator />
                <MetricRow label="Historical P90 Threshold" value={getCellValue(cell, detail, "historical_p90_error_mm", 1, " mm")} tooltip="P90 absolute error threshold — crossing this defines a bust" />
                <Separator />
                <MetricRow label="Temperature (2m)" value={<span className="text-amber-600">{tempVal} °C</span>} tooltip="2-meter surface temperature forecast" />
                <Separator />
                <MetricRow label="Relative Humidity" value={getCellValue(cell, detail, "humidity_percent", 1, " %")} tooltip="Surface relative humidity (%)" />
                <Separator />
                <MetricRow label="MSL Pressure" value={getCellValue(cell, detail, "pressure_hpa", 1, " hPa")} tooltip="Mean sea level pressure (hPa)" />
                <Separator />
                <MetricRow label="10m Wind Speed" value={<span className="text-teal-600">{windVal} km/h</span>} tooltip="10-meter wind speed forecast" />
              </div>
            </TabsContent>

            {/* TAB 2: SHAP DRIVERS */}
            <TabsContent value="shap" className="mt-3 text-xs">
              {loading ? (
                <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Calculating SHAP feature attributions...</span>
                </div>
              ) : detail?.top_reasons && detail.top_reasons.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Top Meteorological Drivers
                  </p>
                  {detail.top_reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-blue-50 p-2.5 rounded-lg border border-blue-100"
                    >
                      <Badge variant="default" className="text-[10px] shrink-0 mt-0.5 rounded-full w-5 h-5 p-0 flex items-center justify-center">
                        {idx + 1}
                      </Badge>
                      <span className="text-slate-700 leading-snug">{reason}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-slate-400">No significant risk drivers flagged for this cell.</p>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: HISTORICAL ANALOGS */}
            <TabsContent value="analogs" className="mt-3 text-xs">
              {loading ? (
                <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching 92,474 historical analogs...</span>
                </div>
              ) : detail?.similar_historical_events && detail.similar_historical_events.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Similar Historical Bust Cases
                  </p>
                  {detail.similar_historical_events.map((caseItem, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-amber-50/60 p-2.5 border border-amber-200/60 space-y-1"
                    >
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{caseItem.historical_run || caseItem.date || `Analog #${idx + 1}`}</span>
                        <Badge variant="warning" className="text-[10px]">
                          {caseItem.similarity_score_percent}% Match
                        </Badge>
                      </div>
                      <Separator className="bg-amber-200/60" />
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>Fcst: {caseItem.forecast_rain_mm ?? caseItem.forecast_rainfall_mm ?? 15.0} mm</span>
                        <span>
                          Error:{" "}
                          <strong className="text-red-600">
                            {caseItem.realized_error_mm ?? 22.4} mm
                          </strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-slate-400">No historical analogs matching condition threshold.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
