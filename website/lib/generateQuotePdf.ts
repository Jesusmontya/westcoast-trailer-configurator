import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type QuoteLineItem = { label: string; price: number; image_url?: string | null; cost?: number };

export type QuotePdfInput = {
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  trailerModel?: string;
  trailerSize?: string;
  coverImageUrl?: string | null;
  items: QuoteLineItem[];
  taxRate?: number;
  monthlyEstimate?: number | null;
  notes?: string | null;
};

export type QuoteTotals = { subtotal: number; taxAmount: number; total: number };

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateQuotePdf(input: QuotePdfInput): Promise<QuoteTotals> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 0;

  // Foto de portada (del tamaño de trailer elegido), si hay
  if (input.coverImageUrl) {
    const dataUrl = await loadImageAsDataUrl(input.coverImageUrl);
    if (dataUrl) {
      try {
        doc.addImage(dataUrl, "JPEG", 0, 0, pageWidth, 70);
        y = 70;
      } catch {
        // si la imagen no carga, seguimos sin portada
      }
    }
  }

  // Franja de marca
  doc.setFillColor(184, 86, 47);
  doc.rect(0, y, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text("ALL CUSTOM TRAILERS", 14, y + 13);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Custom Food Trailers — Nevada", 14, y + 20);

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text(`QUOTE #${input.quoteNumber}`, pageWidth - 14, y + 13, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, y + 20, {
    align: "right",
  });

  y += 42;

  doc.setTextColor(20, 20, 20);
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
  let afterTableY = doc.lastAutoTable.finalY + 8;

  const subtotal = input.items.reduce((sum, item) => sum + (item.price || 0), 0);
  const taxRate = input.taxRate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Subtotal: $${subtotal.toLocaleString()}`, pageWidth - 14, afterTableY, {
    align: "right",
  });
  afterTableY += 6;

  if (taxRate > 0) {
    doc.text(
      `Tax (${taxRate}%): $${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      pageWidth - 14,
      afterTableY,
      { align: "right" }
    );
    afterTableY += 6;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(
    `TOTAL: $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
    pageWidth - 14,
    afterTableY + 2,
    { align: "right" }
  );

  let footerY = afterTableY + 14;

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
  doc.line(14, 285, pageWidth - 14, 285);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("This quote is valid for 30 days.", 14, 291);
  doc.text("allcustomtrailers.com", pageWidth - 14, 291, { align: "right" });

  doc.save(`quote-${input.quoteNumber}-${input.clientName || "client"}.pdf`);

  return { subtotal, taxAmount, total };
}