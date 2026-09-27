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
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">

            {/* TITLE & BADGES */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="rounded-md bg-blue-700 px-2 py-0.5 text-[10px] font-black text-white tracking-wider uppercase border-0 shrink-0">
                  PS 26079
                </Badge>
                <span className="text-[11px] font-semibold text-slate-500 truncate">
                  Operational Reliability Layer
                </span>
                <Badge
                  variant="success"
                  className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Vercel Static Edge Active
                </Badge>
              </div>

              {/* Responsive title size */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-tight">
                Forecast Guard AI
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                Multi-Hazard Forecast Bust Detection (ECMWF IFS 0.25° Grid)
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">

              {/* SEARCH BUTTON — full width on mobile */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenSearch}
                    className="flex-1 sm:flex-none w-full sm:w-auto min-w-0 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 gap-2 text-xs font-semibold h-9 rounded-xl justify-start sm:justify-center"
                  >
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Search Cells / States</span>
                    <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 shrink-0">
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
                    className="flex-1 sm:flex-none shrink-0 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-xl gap-1.5 whitespace-nowrap"
                  >
                    <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Metrics (Sec 19)</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Section 19 model evaluation & verification report</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-8 hidden sm:block shrink-0" />

              {/* RUN INITIALIZATION TIMESTAMP */}
              <div className="hidden sm:flex rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-xs shrink-0">
                <div>
                  <p className="text-[10px] font-medium text-slate-400 whitespace-nowrap">NWP Run Init</p>
                  <p className="font-bold text-slate-800 whitespace-nowrap">{forecastStart || "2026-09-24 00:00 Z"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
