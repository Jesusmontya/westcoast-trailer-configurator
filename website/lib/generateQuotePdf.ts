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

export type QuoteTotals = { subtotal: number; taxAmount: number; total: number; blob: Blob };

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
  const margin = 14;

  let y = 20;

  // Foto de portada, si hay — sin franja de color encima
  if (input.coverImageUrl) {
    const dataUrl = await loadImageAsDataUrl(input.coverImageUrl);
    if (dataUrl) {
      try {
        doc.addImage(dataUrl, "JPEG", 0, 0, pageWidth, 65);
        y = 78;
      } catch {
        // sin portada si la imagen no carga
      }
    }
  }

  doc.setTextColor(0, 0, 0);

  // Encabezado: solo texto, sin fondo
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ALL CUSTOM TRAILERS", margin, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 90, 90);
  doc.text("Custom Trailers — Nevada", margin, y + 6);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`QUOTE #${input.quoteNumber}`, pageWidth - margin, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, y + 6, {
    align: "right",
  });

  y += 14;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("PREPARED FOR", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${input.clientName || "—"}`, margin, y);
  y += 5;
  doc.text(`Phone: ${input.clientPhone || "—"}`, margin, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("TRAILER", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Model: ${input.trailerModel || "—"}`, margin, y);
  y += 5;
  doc.text(`Size: ${input.trailerSize || "—"}`, margin, y);
  y += 10;

  const rows = input.items
    .filter((item) => item.label)
    .map((item) => [item.label, `$${(item.price || 0).toLocaleString()}`]);

  autoTable(doc, {
    startY: y,
    head: [["Item", "Price"]],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
    },
    styles: { fontSize: 10, cellPadding: 4 },
    margin: { left: margin, right: margin },
  });

  // @ts-expect-error - lastAutoTable no está tipado en jsPDF por default
  let afterTableY = doc.lastAutoTable.finalY + 8;

  const subtotal = input.items.reduce((sum, item) => sum + (item.price || 0), 0);
  const taxRate = input.taxRate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`Subtotal: $${subtotal.toLocaleString()}`, pageWidth - margin, afterTableY, {
    align: "right",
  });
  afterTableY += 6;

  if (taxRate > 0) {
    doc.text(
      `Tax (${taxRate}%): $${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      pageWidth - margin,
      afterTableY,
      { align: "right" }
    );
    afterTableY += 6;
  }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - 80, afterTableY, pageWidth - margin, afterTableY);
  afterTableY += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `TOTAL: $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
    pageWidth - margin,
    afterTableY,
    { align: "right" }
  );

  let footerY = afterTableY + 14;

  if (input.monthlyEstimate) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Financing available — as low as $${input.monthlyEstimate}/mo`, margin, footerY);
    footerY += 8;
  }

  if (input.notes) {
    doc.setTextColor(90, 90, 90);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(input.notes, pageWidth - margin * 2);
    doc.text(splitNotes, margin, footerY);
    footerY += splitNotes.length * 5 + 6;
  }

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(margin, 285, pageWidth - margin, 285);
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text("This quote is valid for 30 days.", margin, 291);
  doc.text("allcustomtrailers.com", pageWidth - margin, 291, { align: "right" });

  doc.save(`quote-${input.quoteNumber}-${input.clientName || "client"}.pdf`);

  const blob = doc.output("blob");

  return { subtotal, taxAmount, total, blob };
}