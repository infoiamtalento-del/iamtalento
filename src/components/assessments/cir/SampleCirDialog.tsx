import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, FileText, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CirPages, CIR_TOTAL_PAGES, PAGE_H, PAGE_W } from "./CirPages";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FILE_NAME = "IAmTalento-Sample-CIR-Report.pdf";
const PAGE_GAP = 20;

/** Pop-up viewer for the sample Career Intelligence Report, with a PDF download. */
const SampleCirDialog = ({ open, onOpenChange }: Props) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const available = el.clientWidth - 32;
    setScale(Math.min(1, Math.max(0.3, available / PAGE_W)));
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    // The dialog content mounts in a portal, so wait a frame before measuring.
    const id = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  const download = async () => {
    setError(null);
    setExporting(true);
    try {
      // Let the off-screen, full-size copy render before capturing it.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (document.fonts?.ready) await document.fonts.ready;
      const root = exportRef.current;
      if (!root) throw new Error("Report is not ready yet.");
      const images = Array.from(root.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = () => r(null); })))
      );

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
      const pages = Array.from(root.querySelectorAll<HTMLElement>("[data-cir-page]"));

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: PAGE_W,
          height: PAGE_H,
          windowWidth: PAGE_W,
        });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297, undefined, "FAST");
      }
      pdf.save(FILE_NAME);
    } catch (e) {
      console.error(e);
      setError("Could not create the PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[94vh] max-w-[min(920px,96vw)] flex-col gap-0 overflow-hidden border-0 bg-slate-200 p-0 sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3.5 pr-14">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="truncate font-display text-base font-bold text-slate-900">
                Sample CIR Report
              </DialogTitle>
              <DialogDescription className="truncate text-xs text-slate-500">
                Digital Marketing · {CIR_TOTAL_PAGES} pages · Illustrative data
              </DialogDescription>
            </div>
          </div>
          <Button onClick={download} disabled={exporting} className="shrink-0 gap-2 font-bold cursor-pointer">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "Preparing PDF" : "Download PDF"}
          </Button>
        </div>

        {error && <p className="shrink-0 bg-red-50 px-5 py-2 text-xs font-medium text-red-700">{error}</p>}

        <div ref={viewportRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <div
            className="mx-auto"
            style={{ width: PAGE_W * scale, height: (PAGE_H * CIR_TOTAL_PAGES + PAGE_GAP * (CIR_TOTAL_PAGES - 1)) * scale }}
          >
            <div style={{ width: PAGE_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <PreviewPages />
            </div>
          </div>
        </div>

      </DialogContent>

      {exporting &&
        createPortal(
          <div ref={exportRef} aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0, width: PAGE_W }}>
            <CirPages />
          </div>,
          document.body
        )}
    </Dialog>
  );
};

/** Page-shaped shadows around each page in the preview. */
const PreviewPages = () => (
  <div className="cir-preview flex flex-col [&>section]:shadow-[0_18px_50px_-20px_rgba(15,23,42,0.45)]" style={{ gap: PAGE_GAP }}>
    <CirPages />
  </div>
);

export default SampleCirDialog;
