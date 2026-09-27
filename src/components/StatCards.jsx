import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Grid3x3, AlertTriangle, ShieldCheck, CalendarDays } from "lucide-react";

export default function StatCards({ summary, leadDay, hazard }) {
  const hazardLabel =
    hazard === "temp" ? "Heatwave Temp" :
    hazard === "wind" ? "Windstorm" :
    "Rainfall";

  const highRiskPct = summary?.high_risk_percentage ?? 0;
  const avgConf = summary?.average_confidence ?? 85;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* TOTAL CELLS */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="p-4 pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Grid Coverage
          </p>
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <Grid3x3 className="h-3.5 w-3.5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">4,651</span>
            <Badge variant="default" className="text-[10px]">0.25° GeoJSON</Badge>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">ECMWF IFS operational grid</p>
        </CardContent>
      </Card>

      {/* HIGH RISK CELLS */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="p-4 pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            High Risk ({hazardLabel})
          </p>
          <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">
              {summary ? summary.high_risk_cells : "—"}
            </span>
            <Badge variant="warning" className="text-[10px]">
              {summary ? `${highRiskPct}%` : "0%"}
            </Badge>
          </div>
          <Progress
            value={highRiskPct}
            className="h-1.5 mt-2 bg-amber-100"
            indicatorClassName="bg-amber-500"
          />
        </CardContent>
      </Card>

      {/* DOMAIN CONFIDENCE */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="p-4 pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Mean Domain Confidence
          </p>
          <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">
              {summary ? `${avgConf}%` : "—"}
            </span>
            <Badge variant="success" className="text-[10px]">Calibrated</Badge>
          </div>
          <Progress
            value={avgConf}
            className="h-1.5 mt-2 bg-emerald-100"
            indicatorClassName="bg-emerald-500"
          />
        </CardContent>
      </Card>

      {/* FORECAST HORIZON */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="p-4 pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Forecast Horizon
          </p>
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">Day {leadDay}</span>
            <Badge variant="default" className="text-[10px]">ECMWF IFS</Badge>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Medium-range risk evaluation</p>
        </CardContent>
      </Card>
    </div>
  );
}
