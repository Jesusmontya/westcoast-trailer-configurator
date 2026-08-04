"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type LineItem = { label: string; price: string };

export default function PdfGenerator() {
  const [quoteNumber, setQuoteNumber] = useState("0001");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [trailerModel, setTrailerModel] = useState("");
  const [trailerSize, setTrailerSize] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ label: "", price: "" }]);
  const [monthlyEstimate, setMonthlyEstimate] = useState("");
  const [notes, setNotes] = useState("");

  function addItem() {
    setItems((prev) => [...prev, { label: "", price: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  const total = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  function generatePdf() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Franja superior color óxido
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
    doc.text(`QUOTE #${quoteNumber}`, pageWidth - 14, 15, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, 22, {
      align: "right",
    });

    // Cuerpo
    doc.setTextColor(20, 20, 20);
    let y = 46;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PREPARED FOR", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${clientName || "—"}`, 14, y);
    y += 5;
    doc.text(`Phone: ${clientPhone || "—"}`, 14, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("TRAILER", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Model: ${trailerModel || "—"}`, 14, y);
    y += 5;
    doc.text(`Size: ${trailerSize || "—"}`, 14, y);
    y += 10;

    // Tabla de items
    const rows = items
      .filter((item) => item.label)
      .map((item) => [item.label, `$${(parseFloat(item.price) || 0).toLocaleString()}`]);

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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`TOTAL: $${total.toLocaleString()}`, pageWidth - 14, afterTableY, {
      align: "right",
    });

    let footerY = afterTableY + 10;

    if (monthlyEstimate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(184, 86, 47);
      doc.text(`Financing available — as low as $${monthlyEstimate}/mo`, 14, footerY);
      footerY += 8;
    }

    if (notes) {
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      const splitNotes = doc.splitTextToSize(notes, pageWidth - 28);
      doc.text(splitNotes, 14, footerY);
      footerY += splitNotes.length * 5 + 6;
    }

    doc.setDrawColor(220, 220, 220);
    doc.line(14, 280, pageWidth - 14, 280);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("This quote is valid for 30 days.", 14, 286);
    doc.text("allcustomtrailers.com", pageWidth - 14, 286, { align: "right" });

    doc.save(`quote-${quoteNumber}-${clientName || "client"}.pdf`);
  }

  return (
    <div className="max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
            Quote #
          </label>
          <input
            value={quoteNumber}
            onChange={(e) => setQuoteNumber(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
            Client name
          </label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
            Phone
          </label>
          <input
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
            Trailer model
          </label>
          <input
            value={trailerModel}
            onChange={(e) => setTrailerModel(e.target.value)}
            placeholder="e.g. Taco Trailer Classic"
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
            Size
          </label>
          <input
            value={trailerSize}
            onChange={(e) => setTrailerSize(e.target.value)}
            placeholder="e.g. 16 ft"
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
        </div>
      </div>

      <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-2">
        Line items
      </label>
      <div className="flex flex-col gap-2 mb-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item.label}
              onChange={(e) => updateItem(i, "label", e.target.value)}
              placeholder="Item description"
              className="flex-1 px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            />
            <input
              value={item.price}
              onChange={(e) => updateItem(i, "price", e.target.value)}
              placeholder="Price"
              type="number"
              className="w-32 px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            />
            <button
              onClick={() => removeItem(i)}
              className="px-3 text-[#8f8477] hover:text-[#e63946]"
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        type="button"
        className="text-xs font-mono text-[#e8794a] mb-6"
      >
        + Add item
      </button>

      <p className="font-mono text-sm text-[#f2ece2] mb-6">
        Total: <strong>${total.toLocaleString()}</strong>
      </p>

      <div className="mb-4">
        <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
          Monthly financing estimate (optional)
        </label>
        <input
          value={monthlyEstimate}
          onChange={(e) => setMonthlyEstimate(e.target.value)}
          placeholder="e.g. 250"
          className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
        />
      </div>

      <div className="mb-6">
        <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2] min-h-[70px]"
        />
      </div>

      <button
        onClick={generatePdf}
        className="px-6 py-3.5 bg-[#b8562f] text-white font-semibold rounded hover:bg-[#e8794a] transition-colors"
      >
        Generate PDF →
      </button>
    </div>
  );
}