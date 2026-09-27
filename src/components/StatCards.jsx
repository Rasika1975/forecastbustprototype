import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Grid3x3, AlertTriangle, ShieldCheck, CalendarDays } from "lucide-react";

export default function StatCards({ summary, leadDay, hazard }) {
  const hazardLabel =
    hazard === "temp" ? "Heatwave" :
    hazard === "wind" ? "Windstorm" :
    "Rainfall";

  const highRiskPct = summary?.high_risk_percentage ?? 0;
  const avgConf = summary?.average_confidence ?? 85;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">

      {/* TOTAL CELLS */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate pr-1">
            Total Grid
          </p>
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Grid3x3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-1">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 shrink-0">4,651</span>
            <Badge variant="default" className="text-[9px] sm:text-[10px] whitespace-nowrap px-1.5">
              0.25° Grid
            </Badge>
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-slate-400 truncate">
            ECMWF IFS grid
          </p>
        </CardContent>
      </Card>

      {/* HIGH RISK CELLS */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600 truncate pr-1">
            High Risk
          </p>
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-1">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-black text-amber-600 shrink-0">
              {summary ? summary.high_risk_cells : "—"}
            </span>
            <Badge variant="warning" className="text-[9px] sm:text-[10px] whitespace-nowrap px-1.5">
              {summary ? `${highRiskPct}%` : "0%"}
            </Badge>
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400 truncate">{hazardLabel}</p>
          <Progress
            value={highRiskPct}
            className="h-1.5 mt-1.5 bg-amber-100"
            indicatorClassName="bg-amber-500"
          />
        </CardContent>
      </Card>

      {/* DOMAIN CONFIDENCE */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 truncate pr-1">
            Confidence
          </p>
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-1">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 shrink-0">
              {summary ? `${avgConf}%` : "—"}
            </span>
            <Badge variant="success" className="text-[9px] sm:text-[10px] whitespace-nowrap px-1.5">
              Calibrated
            </Badge>
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400 truncate">Domain mean</p>
          <Progress
            value={avgConf}
            className="h-1.5 mt-1.5 bg-emerald-100"
            indicatorClassName="bg-emerald-500"
          />
        </CardContent>
      </Card>

      {/* FORECAST HORIZON */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-2 flex-row items-center justify-between space-y-0">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600 truncate pr-1">
            Horizon
          </p>
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-1">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 shrink-0 whitespace-nowrap">
              Day {leadDay}
            </span>
            <Badge variant="default" className="text-[9px] sm:text-[10px] whitespace-nowrap px-1.5">
              ECMWF
            </Badge>
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-slate-400 truncate">
            Med-range forecast
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
