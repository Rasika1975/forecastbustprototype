import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import ControlsBar from "./components/ControlsBar";
import IndiaMap from "./components/IndiaMap";
import GridInfoPanel from "./components/GridInfoPanel";
import SearchCommand from "./components/SearchCommand";
import VerificationModal from "./components/VerificationModal";
import { getForecastData, getDaySummary } from "./services/staticDataService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";

const TOTAL_INDIA_GRID_CELLS = 4651;

export default function App() {
  const [leadDay, setLeadDay] = useState(1);
  const [hazard, setHazard] = useState("rain"); // "rain" | "temp" | "wind"
  const [forecast, setForecast] = useState(null);
  const [summary, setSummary] = useState(null);
  const [cells, setCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Controls & Filters
  const [viewMode, setViewMode] = useState("risk"); // "risk" | "field"
  const [riskFilter, setRiskFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [mapTheme, setMapTheme] = useState("satellite"); // "satellite" | "standard"

  // Modals
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function loadForecast(day, hazardMode = hazard) {
    try {
      setLoading(true);
      setError(null);

      const [mapData, summaryData] = await Promise.all([
        getForecastData(day, hazardMode),
        getDaySummary(day, hazardMode).catch(() => null),
      ]);

      setForecast(mapData);
      setCells(mapData.cells || []);
      setSummary(summaryData);
      setSelectedCell(null);
    } catch (err) {
      console.error("Forecast load error:", err);
      setError(`Failed to load static forecast dataset (${err.message})`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForecast(leadDay, hazard);
  }, [leadDay, hazard]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      {/* HEADER */}
      <Header
        onOpenVerification={() => setShowVerificationModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        forecastStart={forecast?.forecast_start}
      />

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-[1600px] w-full space-y-4 sm:space-y-5 px-3 sm:px-6 py-4 sm:py-6 flex-1">
        {/* TOP KPI STAT CARDS */}
        <StatCards summary={summary} leadDay={leadDay} hazard={hazard} />

        {/* CONTROLS BAR */}
        <ControlsBar
          hazard={hazard}
          setHazard={setHazard}
          leadDay={leadDay}
          setLeadDay={setLeadDay}
          viewMode={viewMode}
          setViewMode={setViewMode}
          riskFilter={riskFilter}
          setRiskFilter={setRiskFilter}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          mapTheme={mapTheme}
          setMapTheme={setMapTheme}
          forecastStart={forecast?.forecast_start}
        />

        {/* ERROR NOTIFICATION */}
        {error && (
          <Alert variant="destructive" className="flex items-center justify-between">
            <AlertTriangle className="h-4 w-4" />
            <div className="flex-1 ml-2">
              <AlertTitle>Data Load Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => loadForecast(leadDay)}
              className="ml-4 shrink-0 h-7 text-xs font-bold"
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* MAIN DASHBOARD CONTENT GRID */}
        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* MAP DISPLAY CONTAINER */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200 min-h-[650px]">
            <div className="h-[650px] w-full min-h-[650px]">
              {loading ? (
                <div className="flex h-full min-h-[650px] items-center justify-center bg-slate-900/5 backdrop-blur-xs">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                    <p className="text-xs font-semibold text-slate-600">
                      Loading calibrated 0.25° grid predictions...
                    </p>
                  </div>
                </div>
              ) : (
                <IndiaMap
                  cells={cells}
                  selectedCell={selectedCell}
                  onCellSelect={setSelectedCell}
                  viewMode={viewMode}
                  hazard={hazard}
                  riskFilter={riskFilter}
                  regionFilter={regionFilter}
                  mapTheme={mapTheme}
                />
              )}
            </div>
          </div>

          {/* DRILLDOWN SIDE PANEL */}
          <div className="space-y-5">
            <GridInfoPanel
              cell={selectedCell}
              leadDay={leadDay}
              validDate={forecast?.valid_date}
              hazard={hazard}
            />

            {/* DOMAIN SUMMARY CARD */}
            <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Operational Summary • Day {leadDay}
              </p>
              <h2 className="text-base font-bold text-slate-900">
                Valid Date: {forecast?.valid_date || "2026-09-24"}
              </h2>

              <Separator />

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Grid Cells</span>
                  <span className="font-semibold text-slate-900">{TOTAL_INDIA_GRID_CELLS}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Spatial Resolution</span>
                  <span className="font-semibold text-slate-800">0.25° (~27 km)</span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Data Feed</span>
                  <span className="font-semibold text-emerald-600">Vercel Edge Static Engine</span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Mean Domain Confidence</span>
                  <span className="font-semibold text-emerald-600">
                    {summary?.average_confidence ? `${summary.average_confidence}%` : "Calculated"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="mx-auto max-w-[1600px] px-6 text-center text-xs text-slate-400">
          Forecast Guard AI • Operational Reliability Layer • Problem Statement 26079 • Deployed directly on Vercel
        </div>
      </footer>

      {/* MODALS */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />

      <SearchCommand
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        cells={cells}
        onSelectCell={setSelectedCell}
      />
    </div>
  );
}
