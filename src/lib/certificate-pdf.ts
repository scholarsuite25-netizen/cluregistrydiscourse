import { PDFDocument, PDFPage, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export type CertImages = {
  registrar?: Uint8Array | null;
  vc?: Uint8Array | null;
};

const PAGE_W = 841.89; // A4 landscape (pt)
const PAGE_H = 595.28;
const CX = PAGE_W / 2;

const COLORS = {
  cream: rgb(255 / 255, 253 / 255, 247 / 255),
  gold: rgb(201 / 255, 182 / 255, 118 / 255),
  purple: rgb(76 / 255, 23 / 255, 105 / 255),
  purpleLight: rgb(183 / 255, 161 / 255, 190 / 255),
  orange: rgb(178 / 255, 89 / 255, 0),
  ink: rgb(26 / 255, 11 / 255, 46 / 255),
  body: rgb(94 / 255, 46 / 255, 119 / 255),
  zinc: rgb(113 / 255, 113 / 255, 122 / 255),
  zincFaint: rgb(161 / 255, 161 / 255, 170 / 255),
  black: rgb(0, 0, 0),
};

function wrapLines(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const attempt = cur ? `${cur} ${w}` : w;
    const width = font.widthOfTextAtSize(attempt, size);
    if (width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = attempt;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function measure(text: string, font: PDFFont, size: number) {
  return font.widthOfTextAtSize(text, size);
}

function detectImage(bytes: Uint8Array): "png" | "jpeg" {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "jpeg";
  return "png";
}

async function embedImage(
  doc: PDFDocument,
  page: PDFPage,
  bytes: Uint8Array | null | undefined,
  cx: number,
  bottomY: number,
  maxW: number,
  maxH: number
) {
  if (!bytes || bytes.length === 0) return;
  try {
    const img =
      detectImage(bytes) === "png"
        ? await doc.embedPng(bytes)
        : await doc.embedJpg(bytes);
    const w = img.width;
    const h = img.height;
    const scale = Math.min(maxW / w, maxH / h);
    const dw = w * scale;
    const dh = h * scale;
    page.drawImage(img, { x: cx - dw / 2, y: bottomY - dh, width: dw, height: dh });
  } catch {
    // ignore corrupt signature image; placeholder is drawn by caller level instead
  }
}

type CertPdfOptions = {
  name: string;
  certificateNo: string;
  accessCode: string;
  images?: CertImages;
  theme?: string;
  eventDate?: string;
};

export async function buildCertificatePdf({
  name,
  certificateNo,
  accessCode,
  images = {},
  theme = "Governance, Innovation and Service",
  eventDate = "Thursday, 15 October 2026",
}: CertPdfOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontBoldItalic = await doc.embedFont(StandardFonts.HelveticaBoldOblique);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  // Background + borders
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: COLORS.cream });
  page.drawRectangle({
    x: 18,
    y: 18,
    width: PAGE_W - 36,
    height: PAGE_H - 36,
    borderColor: COLORS.gold,
    borderWidth: 3.5,
  });
  page.drawRectangle({
    x: 34,
    y: 34,
    width: PAGE_W - 68,
    height: PAGE_H - 68,
    borderColor: COLORS.purpleLight,
    borderWidth: 1.2,
  });

  // Logo
  try {
    const res = await fetch("/images/clu-logo.png");
    if (res.ok) {
      const buf = new Uint8Array(await res.arrayBuffer());
      await embedImage(doc, page, buf, CX, 526, 70, 70);
    }
  } catch {
    // logo optional
  }

  // University header
  page.drawText("CHRISLAND UNIVERSITY, ABEOKUTA", {
    x: CX - measure("CHRISLAND UNIVERSITY, ABEOKUTA", fontBold, 19) / 2,
    y: 505,
    size: 19,
    font: fontBold,
    color: COLORS.purple,
  });
  page.drawText("OFFICE OF THE REGISTRAR", {
    x: CX - measure("OFFICE OF THE REGISTRAR", font, 9.5) / 2,
    y: 491,
    size: 9.5,
    font,
    color: COLORS.zinc,
  });

  // Band
  const bandW = 340;
  const bandH = 30;
  page.drawRectangle({
    x: CX - bandW / 2,
    y: 436,
    width: bandW,
    height: bandH,
    color: COLORS.purple,
  });
  page.drawText("MAIDEN REGISTRY DISCOURSE 2026", {
    x: CX - measure("MAIDEN REGISTRY DISCOURSE 2026", fontBold, 11.5) / 2,
    y: 454,
    size: 11.5,
    font: fontBold,
    color: COLORS.gold,
  });

  // Body title
  page.drawText("CERTIFICATE OF PARTICIPATION", {
    x: CX - measure("CERTIFICATE OF PARTICIPATION", fontBold, 24) / 2,
    y: 398,
    size: 24,
    font: fontBold,
    color: COLORS.gold,
  });
  const lineW = 150;
  page.drawRectangle({ x: CX - lineW / 2, y: 385, width: lineW, height: 1.5, color: COLORS.orange });

  page.drawText("This is to certify that", {
    x: CX - measure("This is to certify that", fontItalic, 12) / 2,
    y: 366,
    size: 12,
    font: fontItalic,
    color: COLORS.zinc,
  });

  // Name (wraps to up to two centered lines)
  const nameLines = wrapLines(name.trim(), fontBoldItalic, 30, 520);
  const nameBlockH = nameLines.length * 40;
  let nameTop = 342 - nameBlockH / 2;
  for (const line of nameLines) {
    const y = nameTop - 30;
    page.drawText(line, {
      x: CX - measure(line, fontBoldItalic, 30) / 2,
      y,
      size: 30,
      font: fontBoldItalic,
      color: COLORS.ink,
    });
    nameTop -= 40;
  }

  // Body paragraph
  const bodyTop = nameTop - 14;
  const bodyText = `attended the Maiden Registry Discourse held on ${eventDate} at Chrisland University, Abeokuta with the theme “${theme}”.`;
  const bodyLines = wrapLines(bodyText, font, 10.5, 560);
  let bodyY = bodyTop;
  for (let i = 0; i < Math.min(bodyLines.length, 2); i++) {
    page.drawText(bodyLines[i], {
      x: CX - measure(bodyLines[i], font, 10.5) / 2,
      y: bodyY,
      size: 10.5,
      font,
      color: COLORS.body,
    });
    bodyY -= 15;
  }

  // Signatures
  const cols = [300, 542];
  const sigNames = ["Mr. S. B. Omotoso, FCIA", "Prof. Oyedunni S. Arulogun, FAAS"];
  const sigTitles = ["Registrar", "Vice-Chancellor"];
  const sigBytes = [images.registrar, images.vc];
  for (let i = 0; i < 2; i++) {
    const cx = cols[i];
    if (sigBytes[i] && sigBytes[i]!.length > 0) {
      await embedImage(doc, page, sigBytes[i], cx, 250, 165, 42);
    } else {
      page.drawText("~", {
        x: cx - measure("~", fontBold, 26) / 2,
        y: 262,
        size: 26,
        font: fontBold,
        color: COLORS.gold,
      });
    }
    page.drawRectangle({ x: cx - 85, y: 242, width: 170, height: 1.2, color: COLORS.zincFaint });
    page.drawText(sigNames[i], {
      x: cx - measure(sigNames[i], fontBold, 10.5) / 2,
      y: 228,
      size: 10.5,
      font: fontBold,
      color: COLORS.black,
    });
    page.drawText(sigTitles[i], {
      x: cx - measure(sigTitles[i], font, 9.5) / 2,
      y: 214,
      size: 9.5,
      font,
      color: COLORS.zinc,
    });
  }

  // Footer line
  const foot = "Certificate No: " + certificateNo;
  const acLine = "Access Code: " + accessCode;
  page.drawText(foot, { x: 48, y: 48, size: 9, font, color: COLORS.zincFaint });
  page.drawText(acLine, {
    x: PAGE_W - 48 - measure(acLine, font, 9),
    y: 48,
    size: 9,
    font,
    color: COLORS.zincFaint,
  });

  const bytes = await doc.save();
  return bytes;
}