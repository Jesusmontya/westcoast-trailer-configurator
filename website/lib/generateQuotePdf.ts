import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type QuoteLineItem = { label: string; price: number };

export type QuotePdfInput = {
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  trailerModel?: string;
  trailerSize?: string;
  items: QuoteLineItem[];
  monthlyEstimate?: number | null;
  notes?: string | null;
};

export function generateQuotePdf(input: QuotePdfInput) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(184, 86, 47);
  doc.rect(0, 0, pageWidth, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ALL CUSTOM TRAILERS", 14, 15);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Custom Food Trailers — Nevada", 14, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`QUOTE #${input.quoteNumber}`, pageWidth - 14, 15, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, 22, {
    align: "right",
  });

  doc.setTextColor(20, 20, 20);
  let y = 46;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PREPARED FOR", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${input.clientName || "—"}`, 14, y);
  y += 5;
  doc.text(`Phone: ${input.clientPhone || "—"}`, 14, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("TRAILER", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Model: ${input.trailerModel || "—"}`, 14, y);
  y += 5;
  doc.text(`Size: ${input.trailerSize || "—"}`, 14, y);
  y += 10;

  const rows = input.items
    .filter((item) => item.label)
    .map((item) => [item.label, `$${(item.price || 0).toLocaleString()}`]);

  autoTable(doc, {
    startY: y,
    head: [["Item", "Price"]],
    body: rows,
    theme: "plain",
    headStyles: { fillColor: [43, 36, 29], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 4 },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error - lastAutoTable no está tipado en jsPDF por default
  const afterTableY = doc.lastAutoTable.finalY + 10;

  const total = input.items.reduce((sum, item) => sum + (item.price || 0), 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`TOTAL: $${total.toLocaleString()}`, pageWidth - 14, afterTableY, {
    align: "right",
  });

  let footerY = afterTableY + 10;

  if (input.monthlyEstimate) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(184, 86, 47);
    doc.text(`Financing available — as low as $${input.monthlyEstimate}/mo`, 14, footerY);
    footerY += 8;
  }

  if (input.notes) {
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(input.notes, pageWidth - 28);
    doc.text(splitNotes, 14, footerY);
    footerY += splitNotes.length * 5 + 6;
  }

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 280, pageWidth - 14, 280);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("This quote is valid for 30 days.", 14, 286);
  doc.text("allcustomtrailers.com", pageWidth - 14, 286, { align: "right" });

  doc.save(`quote-${input.quoteNumber}-${input.clientName || "client"}.pdf`);

  return total;
}