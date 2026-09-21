import { fmtDateLong, type GR } from "./data";

// Wrap a long string to a fixed character width for the PDF body.
function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > width) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// Build a minimal, valid single-page PDF from a GR record and trigger a download.
export function downloadGRPdf(gr: GR): void {
  const lines: { text: string; size: number; gap: number }[] = [];
  lines.push({ text: "GOVERNMENT OF THE STATE", size: 14, gap: 22 });
  lines.push({ text: gr.department, size: 11, gap: 26 });
  lines.push({ text: "GOVERNMENT RESOLUTION", size: 13, gap: 22 });
  lines.push({ text: `No. ${gr.number}`, size: 11, gap: 16 });
  lines.push({ text: `Date: ${fmtDateLong(gr.date)}`, size: 11, gap: 24 });
  lines.push({ text: `Subject: ${gr.subject}`, size: 12, gap: 22 });
  lines.push({ text: `Category: ${gr.category}`, size: 11, gap: 16 });
  lines.push({
    text: `Keywords: ${gr.keywords.join(", ") || "-"}`,
    size: 11,
    gap: 24,
  });
  lines.push({ text: "Description:", size: 11, gap: 16 });
  for (const l of wrap(gr.description, 82))
    lines.push({ text: l, size: 11, gap: 15 });
  lines.push({ text: "", size: 11, gap: 30 });
  lines.push({
    text: "Demo document - sample data only. e-GR Store.",
    size: 9,
    gap: 12,
  });

  let y = 800;
  let content = "BT\n/F1 12 Tf\n";
  for (const l of lines) {
    content += `/F1 ${l.size} Tf\n1 0 0 1 60 ${y} Tm\n(${esc(l.text)}) Tj\n`;
    y -= l.gap;
  }
  content += "ET";

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets)
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${gr.number.replace(/\//g, "-")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
