import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, BarChart3 } from "lucide-react";

export default function Header({ onOpenVerification, onOpenSearch, forecastStart }) {
  return (
    <TooltipProvider>
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40 shadow-xs">
        <div className="mx-auto max-w-[1600px] px-6 py-3.5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* TITLE & BADGES */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="rounded-md bg-blue-700 px-2.5 py-0.5 text-[11px] font-black text-white shadow-xs tracking-wider uppercase border-0">
                  PS 26079
                </Badge>
                <span className="text-xs font-semibold text-slate-500">
                  Operational Reliability Layer
                </span>
                <Badge
                  variant="success"
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Vercel Static Edge Active
                </Badge>
              </div>

              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Forecast Guard AI
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Multi-Hazard Weather Forecast Bust Detection (ECMWF IFS 0.25° Grid)
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* SEARCH BUTTON */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenSearch}
                    className="border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 gap-2 text-xs font-semibold h-9 rounded-xl"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Search Cells / States</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search grid cells by ID, state, or region (⌘K)</TooltipContent>
              </Tooltip>

              {/* VERIFICATION REPORT BUTTON */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onOpenVerification}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-xl shadow-xs gap-1.5"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    Multi-Hazard Metrics (Sec 19)
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Section 19 model evaluation & verification report</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              {/* RUN INITIALIZATION TIMESTAMP */}
              <div className="hidden sm:flex rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-xs">
                <div>
                  <p className="text-[10px] font-medium text-slate-400">NWP Run Init</p>
                  <p className="font-bold text-slate-800">{forecastStart || "2026-09-24 00:00 Z"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
