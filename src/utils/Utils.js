import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfigFile from "@tailwindConfig";

export const tailwindConfig = () => {
  return resolveConfig(tailwindConfigFile);
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const formatThousands = (value) =>
  Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const detailUser = () => {
  const { loginResponse } = useAuth();

  if (!loginResponse) {
    return {
      idUser: null,
      username: "Guest User",
      fullname: "Guest User",
      role: "Guest User",
    };
  }

  try {
    return jwtDecode(loginResponse);
  } catch (error) {
    console.error("Invalid token", error);
    return {
      idUser: null,
      username: "Guest User",
      fullname: "Guest User",
      role: "Guest User",
    };
  }
};

export const generateUUID = () => {
  return uuidv4();
};

export const sanitizePathName = (value = "") => {
  return value
    .toString()
    .trim()
    .replace(/[\\\/:*?"<>|]/g, "-");
};

export const UNIT_OPTIONS = [
  { value: "PC", label: "PC" },
  { value: "BOX", label: "BOX" },
  { value: "CARTON", label: "CARTON" },
  { value: "PALLET", label: "PALLET" },
  { value: "ROLL", label: "ROLL" },
  { value: "KG", label: "KG" },
  { value: "G", label: "G" },
  { value: "MG", label: "MG" },
  { value: "TON", label: "TON" },
  { value: "Meter", label: "Meter" },
  { value: "CM", label: "CM" },
  { value: "MM", label: "MM" },
  { value: "KM", label: "KM" },
  { value: "L", label: "L" },
  { value: "ML", label: "ML" },
];

export const normalize = (val) => (val || "").toString().toUpperCase();

export const cleanModelCode = (str) => (str ? str.split("-")[0].trim() : "");

export const statusConfig = {
  warning: {
    label: "Warning",
    bg: "#FEF3C7",
    color: "#92400E",
    border: "#FCD34D",
  },
  good: { label: "Good", bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
};

export const getCurrentYearMonth = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

export function getOverallStatus(mrpByMonth, dosTarget) {
  if (mrpByMonth.some((m) => m.dos < dosTarget)) return "warning";
  return "good";
}

const GS1_MARKET_RANGES = [
  { range: [0, 19], market: "Amerika Serikat / Kanada (UPC)" },
  { range: [300, 379], market: "Prancis" },
  { range: [400, 440], market: "Jerman" },
  { range: [450, 459], market: "Jepang" },
  { range: [460, 469], market: "Rusia" },
  { range: [471, 471], market: "Taiwan" },
  { range: [480, 480], market: "Filipina" },
  { range: [489, 489], market: "Hong Kong" },
  { range: [490, 499], market: "Jepang" },
  { range: [500, 509], market: "Inggris" },
  { range: [520, 521], market: "Yunani" },
  { range: [540, 549], market: "Belgia / Luksemburg" },
  { range: [560, 560], market: "Portugal" },
  { range: [570, 579], market: "Denmark" },
  { range: [590, 590], market: "Polandia" },
  { range: [599, 599], market: "Hungaria" },
  { range: [600, 601], market: "Afrika Selatan" },
  { range: [619, 619], market: "Tunisia" },
  { range: [622, 622], market: "Iran" },
  { range: [624, 624], market: "Arab Saudi" },
  { range: [625, 625], market: "Uni Emirat Arab" },
  { range: [629, 629], market: "Oman" },
  { range: [640, 649], market: "Finlandia" },
  { range: [690, 699], market: "Tiongkok" },
  { range: [700, 709], market: "Norwegia" },
  { range: [729, 729], market: "Israel" },
  { range: [730, 739], market: "Swedia" },
  { range: [750, 750], market: "Meksiko" },
  { range: [754, 755], market: "Kanada" },
  { range: [760, 769], market: "Swiss / Liechtenstein" },
  { range: [770, 771], market: "Kolombia" },
  { range: [778, 779], market: "Argentina" },
  { range: [789, 790], market: "Brasil" },
  { range: [800, 839], market: "Italia" },
  { range: [840, 849], market: "Spanyol" },
  { range: [868, 869], market: "Turki" },
  { range: [870, 879], market: "Belanda" },
  { range: [880, 881], market: "Korea Selatan" },
  { range: [885, 885], market: "Thailand" },
  { range: [888, 888], market: "Singapura" },
  { range: [890, 890], market: "India" },
  { range: [893, 893], market: "Vietnam" },
  { range: [894, 894], market: "Bangladesh" },
  { range: [896, 896], market: "Pakistan" },
  { range: [899, 899], market: "Indonesia" },
  { range: [900, 919], market: "Austria" },
  { range: [930, 939], market: "Australia" },
  { range: [940, 949], market: "Selandia Baru" },
  { range: [955, 955], market: "Malaysia" },
  { range: [958, 958], market: "Makau, Tiongkok" },
];

// barcodeReference.js
// Mapping barcode format (dari ZXing) -> info usage & reference
// Key harus match dengan BarcodeFormat enum di @zxing/library

export const BARCODE_REFERENCE = {
  QR_CODE: {
    name: "QR Code (Quick Response Code)",
    usage: [
      "Individual Box (Offset Printing)",
      "Individual Box (Corrugated)",
      "Caution Sheet",
      "Label",
      "Film outer / upper",
      "Ink Bag",
    ],
    reference: "Individual Box Baikal series",
  },
  EAN_13: {
    name: "EAN Code (European Article Number)",
    usage: ["Individual Box (Offset Printing)", "Label"],
    reference: "Individual Box Baikal series",
  },
  JAN_CODE: {
    name: "JAN Code (Japanese Article Number)",
    usage: ["Individual Box (Offset Printing)"],
    reference: "Individual Box Lantana / 301 series",
  },
  UPC_A: {
    name: "UPC Code (Universal Product Code)",
    usage: [
      "Individual Box (Offset Printing)",
      "Outer Carton Box (Corrugated)",
    ],
    reference: "Individual Box Sakura series",
  },
  CODE_39: {
    name: "Barcode Code39",
    usage: [
      "Individual Box (Offset Printing)",
      "Outer Carton Box (Corrugated)",
      "Caution Sheet",
      "Shrink Film",
    ],
    reference: "Individual Box Craig series",
  },
  CODE_128: {
    name: "Barcode",
    usage: ["Outer Carton Box (Corrugated)"],
    reference: "Outer Box Orpheus / 301 series",
  },
  CODABAR: {
    name: "C-Code",
    usage: ["Individual Box (Offset Printing)"],
    reference: "Individual Box Liatris / 301 series",
  },
  DATA_MATRIX: {
    name: "Data Matrix",
    usage: ["Individual Box (Offset Printing)"],
    reference: "Individual Box Lantana / 301 series",
  },
};

function getMarketFromPrefix(rawFormat, value) {
  if (!value) return null;

  if (rawFormat === "UPC_A") {
    return "Amerika Serikat / Kanada (UPC)";
  }

  if (rawFormat !== "EAN_13") return null;

  const prefix = parseInt(value.slice(0, 3), 10);
  if (Number.isNaN(prefix)) return null;

  const match = GS1_MARKET_RANGES.find(
    (r) => prefix >= r.range[0] && prefix <= r.range[1],
  );
  return match ? match.market : "Prefix tidak dikenali / reserved GS1";
}

// Prefix GS1 country code buat Jepang (dipakai buat bedain JAN vs EAN)
const JAN_PREFIXES = ["45", "49"];

/**
 * Resolve raw format hasil decode ke key yang sesuai di BARCODE_REFERENCE.
 * Khusus EAN_13 dicek dulu prefix-nya, karena JAN Code = EAN_13 dengan
 * prefix negara Jepang, bukan format terpisah secara teknis.
 */
export function resolveBarcodeType(rawFormat, value) {
  if (rawFormat === "EAN_13") {
    const prefix = (value || "").slice(0, 2);
    if (JAN_PREFIXES.includes(prefix)) {
      return "JAN_CODE";
    }
    return "EAN_13";
  }
  return rawFormat;
}

/**
 * Lookup lengkap: format + value -> detail referensi (atau null kalau
 * formatnya belum ada di tabel, misal ITF, AZTEC, PDF_417, dll)
 */
export function getBarcodeInfo(rawFormat, value) {
  const resolvedType = resolveBarcodeType(rawFormat, value);
  const info = BARCODE_REFERENCE[resolvedType] || null;
  const market = getMarketFromPrefix(rawFormat, value);
  return { resolvedType, info, market };
}
