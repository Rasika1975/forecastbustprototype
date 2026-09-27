import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin } from "lucide-react";

function getRiskVariant(riskLevel) {
  if (["high", "very_high"].includes(riskLevel)) return "danger";
  if (riskLevel === "moderate") return "warning";
  return "success";
}

function getRiskLabel(riskLevel) {
  return (riskLevel || "low").replace("_", " ").toUpperCase();
}

export default function SearchCommand({ isOpen, onClose, cells = [], onSelectCell }) {
  const [query, setQuery] = useState("");

  const filteredCells = useMemo(() => {
    if (!query.trim()) return cells.slice(0, 15);
    const q = query.toLowerCase().trim();
    return cells
      .filter(
        (c) =>
          String(c.cell_id).toLowerCase().includes(q) ||
          String(c.state || "").toLowerCase().includes(q) ||
          String(c.region || "").toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [cells, query]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-xl p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-500" />
            Search Grid Cells & States
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="p-3 bg-slate-50/50">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type cell ID (e.g. CELL_1234), state (e.g. Kerala), or region..."
            className="bg-white border-slate-200 text-sm h-9"
          />
        </div>

        <Separator />

        {/* Results list */}
        <div className="max-h-[350px] overflow-y-auto p-2 space-y-0.5">
          {filteredCells.length > 0 ? (
            filteredCells.map((cell, i) => (
              <div key={cell.cell_id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCell(cell);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors text-left"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span>{cell.cell_id}</span>
                        <span className="text-[11px] text-slate-500 font-normal truncate">
                          {cell.state || "India"} • {cell.region || "Region"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {Number(cell.latitude).toFixed(2)}°N, {Number(cell.longitude).toFixed(2)}°E
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs font-bold text-blue-600">
                      {(Number(cell.bust_probability || 0) * 100).toFixed(0)}% Bust
                    </span>
                    <Badge
                      variant={getRiskVariant(cell.risk_level)}
                      className="text-[10px] font-bold uppercase py-0.5"
                    >
                      {getRiskLabel(cell.risk_level)}
                    </Badge>
                  </div>
                </button>
                {i < filteredCells.length - 1 && <Separator className="my-0.5" />}
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">No results found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No matching grid cells for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}
        </div>

        {filteredCells.length > 0 && (
          <>
            <Separator />
            <div className="px-4 py-2 text-[11px] text-slate-400 bg-slate-50/50">
              {query.trim()
                ? `${filteredCells.length} result${filteredCells.length !== 1 ? "s" : ""} for "${query}"`
                : `Showing ${filteredCells.length} of ${cells.length} cells — type to filter`}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
