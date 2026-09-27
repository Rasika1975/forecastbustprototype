import { useState, useEffect } from "react";
import DaySelector from "./DaySelector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, Pause } from "lucide-react";

export default function ControlsBar({
  hazard,
  setHazard,
  leadDay,
  setLeadDay,
  viewMode,
  setViewMode,
  riskFilter,
  setRiskFilter,
  regionFilter,
  setRegionFilter,
  mapTheme,
  setMapTheme,
  forecastStart,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback timer for 10-day loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setLeadDay((prevDay) => (prevDay >= 10 ? 1 : prevDay + 1));
      }, 2000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setLeadDay]);

  return (
    <TooltipProvider>
      <section className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200 space-y-4">
        {/* ROW 1: HAZARD DOMAIN SELECTOR */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Multi-Hazard Target Selector
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Select hazard domain to evaluate dedicated calibrated forecast bust models.
            </p>
          </div>

          <ToggleGroup value={hazard} onValueChange={(v) => v && setHazard(v)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="rain">🌧️ Heavy Rain Busts</ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Evaluate heavy rainfall forecast bust probability</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="temp">🌡️ Heatwave Temp Busts</ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Evaluate temperature-based heatwave bust probability</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="wind">💨 Windstorm Busts</ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Evaluate windstorm forecast bust probability</TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>

        <Separator />

        {/* ROW 2: FORECAST HORIZON & VIEW MODE */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Forecast Horizon & Radar Loop
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Select lead day (1–10) or launch automated 10-day risk progression playback.
              </p>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isPlaying ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="ml-2 h-8 text-xs font-bold gap-1.5 shrink-0"
                >
                  {isPlaying ? (
                    <><Pause className="h-3.5 w-3.5" /> Pause Loop</>
                  ) : (
                    <><Play className="h-3.5 w-3.5" /> Play 10-Day Loop</>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPlaying ? "Pause the 10-day playback animation" : "Auto-advance through all 10 lead days"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* VIEW MODE TOGGLE */}
          <ToggleGroup value={viewMode} onValueChange={(v) => v && setViewMode(v)}>
            <ToggleGroupItem value="risk">🛡️ Bust Risk & Confidence</ToggleGroupItem>
            <ToggleGroupItem value="field">
              {hazard === "temp"
                ? "🌡️ Temperature Field"
                : hazard === "wind"
                ? "💨 Wind Speed Field"
                : "🌧️ Precipitation Forecast"}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* DAY SELECTOR STRIP */}
        <DaySelector
          selectedDay={leadDay}
          onChange={setLeadDay}
          forecastStart={forecastStart}
        />

        <Separator />

        {/* ROW 3: QUICK FILTERS & MAP THEME SELECTOR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* RISK FILTER */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">Risk Filter:</span>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cells (4,651)</SelectItem>
                  <SelectItem value="high_risk">High &amp; Very High Risk</SelectItem>
                  <SelectItem value="moderate_plus">Moderate Risk &amp; Above</SelectItem>
                  <SelectItem value="very_high">Very High Risk Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* REGION FILTER */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">Region:</span>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub-Regions</SelectItem>
                  <SelectItem value="Western Ghats">Western Ghats</SelectItem>
                  <SelectItem value="North-East">North-East</SelectItem>
                  <SelectItem value="Central India">Central India</SelectItem>
                  <SelectItem value="Northern Plains">Northern Plains</SelectItem>
                  <SelectItem value="Deccan Plateau">Deccan Plateau</SelectItem>
                  <SelectItem value="Eastern Coastal">Eastern Coastal</SelectItem>
                  <SelectItem value="Northwest Arid">Northwest Arid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* MAP THEME TOGGLE */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Map Theme:</span>
            <ToggleGroup value={mapTheme} onValueChange={(v) => v && setMapTheme(v)}>
              <ToggleGroupItem value="satellite" className="text-[11px]">🛰️ Satellite</ToggleGroupItem>
              <ToggleGroupItem value="standard" className="text-[11px]">🗺️ Standard</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
