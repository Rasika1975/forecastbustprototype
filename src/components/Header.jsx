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
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-3">

          {/* Top row — title + badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="rounded-md bg-blue-700 px-2 py-0.5 text-[10px] font-black text-white tracking-wider uppercase border-0 shrink-0">
                  PS 26079
                </Badge>
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline truncate">
                  Operational Reliability Layer
                </span>
                <Badge
                  variant="success"
                  className="hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Vercel Edge Active
                </Badge>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-tight">
                Forecast Guard AI
              </h1>
              <p className="text-[10px] sm:text-xs font-medium text-slate-400 truncate">
                Multi-Hazard Bust Detection · ECMWF IFS 0.25°
              </p>
            </div>

            {/* Desktop-only: timestamp */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Separator orientation="vertical" className="h-8 shrink-0" />
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-xs shrink-0">
                <div>
                  <p className="text-[10px] font-medium text-slate-400 whitespace-nowrap">NWP Run Init</p>
                  <p className="font-bold text-slate-800 whitespace-nowrap">{forecastStart || "2026-09-24 00:00 Z"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search + Metrics row — both full-width on mobile, side-by-side on desktop */}
          <div className="mt-2.5 flex flex-col gap-2 md:flex-row md:items-center">

            {/* Search bar — full width always */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2.5 h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 text-sm font-medium text-left"
            >
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="flex-1 truncate">Search cells, states, regions…</span>
              <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 shrink-0">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Metrics button — full width on mobile, auto on desktop */}
            <button
              type="button"
              onClick={onOpenVerification}
              className="w-full md:w-auto md:shrink-0 flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors text-white text-sm font-semibold"
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span>Multi-Hazard Metrics (Sec 19)</span>
            </button>

          </div>

        </div>
      </header>
    </TooltipProvider>
  );
}
