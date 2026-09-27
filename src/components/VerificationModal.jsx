import { useEffect, useState } from "react";
import { getVerificationMetrics } from "../services/staticDataService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CloudRain, Thermometer, Wind, Loader2 } from "lucide-react";

// On mobile the 8-column table is replaced with stacked metric cards per lead day
function MetricCards({ data, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-xs">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading metrics...
      </div>
    );
  }
  if (!data?.metrics_by_lead_day) {
    return (
      <p className="text-center text-slate-400 text-xs py-6">No verification data available</p>
    );
  }
  return (
    <div className="space-y-2">
      {Object.entries(data.metrics_by_lead_day).map(([leadKey, row]) => (
        <div key={leadKey} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-black text-slate-900 mb-2">{leadKey}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">PR-AUC</span>
              <span className="font-semibold text-blue-600 font-mono">{row.pr_auc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ROC-AUC</span>
              <span className="font-semibold font-mono">{row.roc_auc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recall</span>
              <span className="font-semibold font-mono">{row.recall}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Precision</span>
              <span className="font-semibold font-mono">{row.precision}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">F1</span>
              <span className="font-semibold font-mono">{row.f1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Brier</span>
              <span className="font-semibold text-emerald-600 font-mono">{row.brier_score}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-slate-500">ECE (Calibration)</span>
              <span className="font-semibold font-mono text-slate-600">{row.ece}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Desktop table view
function MetricTable({ data, loading }) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl">
      <table className="w-full text-left text-xs min-w-[560px]">
        <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3 whitespace-nowrap">Lead Day</th>
            <th className="py-2.5 px-3 whitespace-nowrap">PR-AUC</th>
            <th className="py-2.5 px-3 whitespace-nowrap">ROC-AUC</th>
            <th className="py-2.5 px-3 whitespace-nowrap">Recall</th>
            <th className="py-2.5 px-3 whitespace-nowrap">Precision</th>
            <th className="py-2.5 px-3 whitespace-nowrap">F1</th>
            <th className="py-2.5 px-3 whitespace-nowrap">Brier</th>
            <th className="py-2.5 px-3 whitespace-nowrap">ECE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data?.metrics_by_lead_day ? (
            Object.entries(data.metrics_by_lead_day).map(([leadKey, row]) => (
              <tr key={leadKey} className="hover:bg-slate-50/70 transition">
                <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">{leadKey}</td>
                <td className="py-2 px-3 font-mono font-semibold text-blue-600">{row.pr_auc}</td>
                <td className="py-2 px-3 font-mono">{row.roc_auc}</td>
                <td className="py-2 px-3 font-mono">{row.recall}</td>
                <td className="py-2 px-3 font-mono">{row.precision}</td>
                <td className="py-2 px-3 font-mono font-semibold">{row.f1}</td>
                <td className="py-2 px-3 font-mono text-emerald-600">{row.brier_score}</td>
                <td className="py-2 px-3 font-mono text-slate-600">{row.ece}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-6 text-center text-slate-400">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading metrics...
                  </span>
                ) : "No verification data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function VerificationModal({ isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [activeHazard, setActiveHazard] = useState("rain");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getVerificationMetrics(activeHazard)
        .then((res) => setData(res))
        .catch((err) => console.error("Metrics load failed:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, activeHazard]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">

        <DialogHeader className="pb-0">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge className="rounded-md bg-blue-700 px-2 py-0.5 text-[10px] sm:text-[11px] font-black text-white tracking-wider uppercase border-0 shrink-0">
              Sec 19 Verification
            </Badge>
            <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">
              PS 26079
            </span>
          </div>

          <DialogTitle className="text-lg sm:text-xl leading-tight">
            Model Evaluation & Verification Report
          </DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs leading-relaxed">
            Statistical evaluation of the calibrated XGBoost forecast-bust detector across Day 1–10 horizons.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 text-sm text-slate-700 mt-1">

          {/* Metadata Cards — stacked on mobile, 3-col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="p-3">
                <p className="text-[11px] text-slate-500 font-medium">Model Architecture</p>
                <p className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
                  {data?.model_name || "Calibrated XGBoost"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                  v{data?.model_version || "1.2.0"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="p-3">
                <p className="text-[11px] text-slate-500 font-medium">Evaluation Split</p>
                <p className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">Chronological Holdout</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">93,020 unseen samples</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="p-3">
                <p className="text-[11px] text-slate-500 font-medium">Target Definition</p>
                <p className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">P90 Absolute Error</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Grid-cell & lead-time specific</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Metrics section */}
          <div>
            {/* Header row — stacks on mobile */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Lead-Time Verification (Day 1 – Day 10)
                </h3>
                <p className="text-[11px] text-slate-500">9,302 test grid cells per lead day</p>
              </div>

              {/* Hazard toggle — full width on mobile */}
              <ToggleGroup
                value={activeHazard}
                onValueChange={(v) => v && setActiveHazard(v)}
                className="w-full sm:w-auto justify-start sm:justify-end"
              >
                <ToggleGroupItem value="rain" className="flex-1 sm:flex-none gap-1.5 justify-center">
                  <CloudRain className="h-3.5 w-3.5 shrink-0" />
                  Rain
                </ToggleGroupItem>
                <ToggleGroupItem value="temp" className="flex-1 sm:flex-none gap-1.5 justify-center">
                  <Thermometer className="h-3.5 w-3.5 shrink-0" />
                  Heat
                </ToggleGroupItem>
                <ToggleGroupItem value="wind" className="flex-1 sm:flex-none gap-1.5 justify-center">
                  <Wind className="h-3.5 w-3.5 shrink-0" />
                  Wind
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Mobile: stacked cards — Desktop: scrollable table */}
            <div className="block sm:hidden">
              <MetricCards data={data} loading={loading} />
            </div>
            <div className="hidden sm:block">
              <MetricTable data={data} loading={loading} />
            </div>
          </div>

          {/* Key Findings */}
          <Alert variant="info">
            <Info className="h-4 w-4 shrink-0" />
            <AlertDescription className="ml-2">
              <p className="font-bold text-blue-950 mb-1.5 text-xs">Scientific & Operational Validation:</p>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px] sm:text-xs text-slate-700">
                <li>
                  <strong>PR-AUC & Brier Score:</strong> Busts are rare (~10–15% prevalence). Calibrated model achieves low Brier score (0.13–0.14) across all horizons.
                </li>
                <li>
                  <strong>Probability Calibration:</strong> ECE below 0.025 across all lead times — predicted probabilities match empirical bust frequencies.
                </li>
                <li>
                  <strong>Skill Degradation:</strong> ROC-AUC 0.65 (Day 1) → 0.71 (Day 10), showing strong ranking skill even in medium range.
                </li>
              </ul>
            </AlertDescription>
          </Alert>

        </div>

        <DialogFooter className="mt-2 pt-3 border-t border-slate-100">
          <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
            Close Report
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
