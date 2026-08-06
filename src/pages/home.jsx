import { useEffect, useRef, useState, useCallback } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  BarcodeFormat,
} from "@zxing/library";
import {
  ScanLine,
  Video,
  VideoOff,
  Upload,
  Trash2,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";
import { getBarcodeInfo } from "../utils/Utils";

const TYPE_STYLES = {
  QR_CODE: "text-cyan-300 border-cyan-300/40 bg-cyan-300/10",
  EAN_13: "text-emerald-300 border-emerald-300/40 bg-emerald-300/10",
  JAN_CODE: "text-amber-300 border-amber-300/40 bg-amber-300/10",
  UPC_A: "text-violet-300 border-violet-300/40 bg-violet-300/10",
  CODE_39: "text-sky-300 border-sky-300/40 bg-sky-300/10",
  CODE_128: "text-slate-300 border-slate-300/40 bg-slate-300/10",
  CODABAR: "text-pink-300 border-pink-300/40 bg-pink-300/10",
  DATA_MATRIX: "text-indigo-300 border-indigo-300/40 bg-indigo-300/10",
};

export default function Home() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    const loadDevices = async () => {
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        tempStream.getTracks().forEach((t) => t.stop());

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter((d) => d.kind === "videoinput");

        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          const backCam = videoDevices.find((d) =>
            d.label.toLowerCase().includes("back"),
          );
          setSelectedDeviceId((backCam || videoDevices[0]).deviceId);
        }
      } catch (err) {
        setError(
          "Gagal akses kamera. Cek permission browser (izinkan akses camera).",
        );
      }
    };

    loadDevices();

    return () => {
      readerRef.current?.reset();
    };
  }, []);

  const handleDecoded = useCallback((rawFormat, value) => {
    const { resolvedType, info, market } = getBarcodeInfo(rawFormat, value);

    const result = {
      format: resolvedType,
      rawValue: value,
      info,
      market,
      scannedAt: new Date().toLocaleTimeString(),
    };

    setLastResult(result);
    setHistory((prev) => [result, ...prev].slice(0, 20));
  }, []);

  const startScan = useCallback(() => {
    if (!selectedDeviceId || !readerRef.current) return;
    setError("");
    setIsScanning(true);

    readerRef.current.decodeFromVideoDevice(
      selectedDeviceId,
      videoRef.current,
      (result, err) => {
        if (result) {
          const formatValue = result.getBarcodeFormat
            ? result.getBarcodeFormat()
            : result.format;
          const rawFormat = BarcodeFormat[formatValue] || String(formatValue);
          handleDecoded(rawFormat, result.getText());
        }
        if (err && !(err instanceof NotFoundException)) {
          setError(err.message || "Gagal decode barcode.");
        }
      },
    );
  }, [selectedDeviceId, handleDecoded]);

  const stopScan = useCallback(() => {
    readerRef.current?.reset();
    setIsScanning(false);
  }, []);

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (isScanning) stopScan();

      setError("");
      const imageUrl = URL.createObjectURL(file);
      const imageReader = new BrowserMultiFormatReader();

      imageReader
        .decodeFromImageUrl(imageUrl)
        .then((result) => {
          const formatValue = result.getBarcodeFormat
            ? result.getBarcodeFormat()
            : result.format;
          const rawFormat = BarcodeFormat[formatValue] || String(formatValue);
          handleDecoded(rawFormat, result.getText());
        })
        .catch(() => {
          setError(
            "Gagal baca barcode dari gambar. Pastikan foto jelas, tidak blur/miring, dan barcode utuh dalam frame.",
          );
        })
        .finally(() => {
          URL.revokeObjectURL(imageUrl);
          e.target.value = "";
        });
    },
    [isScanning, stopScan, handleDecoded],
  );

  const clearHistory = () => {
    setHistory([]);
    setLastResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Oswald:wght@500;600;700&display=swap');
        .font-scan-display { font-family: 'Oswald', sans-serif; }
        .font-scan-mono { font-family: 'Space Mono', monospace; }
        @keyframes scanline-sweep {
          0% { top: 2%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 96%; opacity: 0; }
        }
        .scanline-beam {
          animation: scanline-sweep 2.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scanline-beam { animation: none; opacity: 0.6; top: 50%; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-5">
        <p className="font-scan-mono text-[10px] tracking-[0.25em] text-cyan-400/70 uppercase mb-1">
          Scanline // Factory QC
        </p>
        <h1 className="font-scan-display text-2xl sm:text-3xl font-semibold text-stone-100 uppercase tracking-tight">
          Barcode Market Identifier
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Arahkan kamera ke barcode/QR, atau upload gambar dari file manager.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* ===== Kolom kiri: viewport scanner ===== */}
        <div className="bg-[#12161A] border border-white/10 rounded-2xl p-4">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
            />

            {/* Reticle corners */}
            {[
              "top-3 left-3 border-t-2 border-l-2",
              "top-3 right-3 border-t-2 border-r-2",
              "bottom-3 left-3 border-b-2 border-l-2",
              "bottom-3 right-3 border-b-2 border-r-2",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute w-6 h-6 border-cyan-400/60 ${pos}`}
              />
            ))}

            {/* Laser scanline, cuma muncul pas aktif scan */}
            {isScanning && (
              <div
                className="scanline-beam absolute left-0 right-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #46E0C5, transparent)",
                  boxShadow: "0 0 8px 1px #46E0C5",
                }}
                aria-hidden="true"
              />
            )}

            {!isScanning && devices.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-stone-500 text-sm font-scan-mono">
                NO CAMERA DETECTED
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <select
              className="bg-[#0E1113] border border-white/10 text-stone-200 text-sm rounded-lg px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-40"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              disabled={isScanning}
            >
              {devices.length === 0 && (
                <option>Tidak ada kamera terdeteksi</option>
              )}
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
                </option>
              ))}
            </select>

            {!isScanning ? (
              <button
                className="flex items-center gap-2 bg-cyan-400 text-[#0E1113] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-40"
                onClick={startScan}
                disabled={!selectedDeviceId}
              >
                <Video size={16} /> Mulai Scan
              </button>
            ) : (
              <button
                className="flex items-center gap-2 bg-red-500/90 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
                onClick={stopScan}
              >
                <VideoOff size={16} /> Stop Scan
              </button>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              className="flex items-center gap-2 border border-white/15 text-stone-300 text-sm px-4 py-2 rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} /> Upload Gambar
            </button>

            <button
              className="flex items-center gap-2 text-stone-500 text-sm px-3 py-2 rounded-lg hover:bg-white/5 hover:text-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ml-auto"
              onClick={clearHistory}
            >
              <Trash2 size={16} /> Clear Log
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 mt-3 border-l-2 border-amber-400 bg-amber-400/10 text-amber-200 text-sm rounded-r-lg px-3 py-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Manifest log */}
          {history.length > 0 && (
            <div className="mt-5">
              <p className="font-scan-mono text-[10px] tracking-[0.2em] text-stone-500 uppercase mb-2">
                Scan Log
              </p>
              <div className="max-h-56 overflow-y-auto rounded-lg border border-white/10 divide-y divide-white/5">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-scan-mono text-stone-400 hover:bg-white/5"
                  >
                    <span className="text-stone-600 shrink-0">
                      {h.scannedAt}
                    </span>
                    <span
                      className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] ${
                        TYPE_STYLES[h.format] ||
                        "text-stone-400 border-white/15 bg-white/5"
                      }`}
                    >
                      {h.format}
                    </span>
                    <span className="text-stone-300 truncate flex-1">
                      {h.rawValue}
                    </span>
                    <span className="text-stone-500 shrink-0">
                      {h.market || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== Kolom kanan: hasil sebagai label ticket ===== */}
        <div>
          {lastResult ? (
            lastResult.info ? (
              <div className="relative bg-[#F0EBDD] text-[#1C1A15] rounded-lg p-5 shadow-xl">
                {/* strip barcode dekoratif */}
                <div
                  className="h-4 w-full mb-4 rounded-sm opacity-80"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, #1C1A15 0 2px, transparent 2px 5px)",
                  }}
                  aria-hidden="true"
                />

                {lastResult.market && (
                  <div className="font-scan-display absolute -top-3 -right-3 rotate-[-8deg] border-2 border-[#C1442D] text-[#C1442D] bg-[#F0EBDD] px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">
                    Dest: {lastResult.market}
                  </div>
                )}

                <div className="mb-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded border text-[11px] font-scan-mono ${
                      TYPE_STYLES[lastResult.format] ||
                      "text-stone-700 border-stone-400 bg-stone-200"
                    }`}
                  >
                    {lastResult.format}
                  </span>
                </div>

                <dl className="font-scan-mono text-sm space-y-2">
                  <div className="flex justify-between gap-2 border-b border-dotted border-[#1C1A15]/30 pb-1">
                    <dt className="text-[#1C1A15]/60">Type</dt>
                    <dd className="text-right">{lastResult.info.name}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-dotted border-[#1C1A15]/30 pb-1">
                    <dt className="text-[#1C1A15]/60">Reference</dt>
                    <dd className="text-right">{lastResult.info.reference}</dd>
                  </div>
                  <div className="border-b border-dotted border-[#1C1A15]/30 pb-1">
                    <dt className="text-[#1C1A15]/60 mb-1">Usage</dt>
                    <dd>
                      <ul className="list-disc list-inside space-y-0.5">
                        {lastResult.info.usage.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2 pt-1 text-xs">
                    <dt>Value Scan</dt>
                    <dd className="text-right break-all text-red-600">
                      {lastResult.rawValue}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="bg-[#12161A] border border-amber-400/30 rounded-2xl p-5 text-sm text-amber-200">
                <p className="font-scan-mono text-xs uppercase tracking-widest mb-1 text-amber-400/70">
                  Not catalogued
                </p>
                Format <b>{lastResult.format}</b> terdeteksi, tapi belum ada di
                tabel referensi.
                <p className="text-stone-500 text-xs mt-2 break-all font-scan-mono">
                  {lastResult.rawValue}
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl p-10 h-full text-stone-600">
              <PackageSearch size={28} className="mb-3" />
              <p className="text-sm font-scan-mono">
                Belum ada barcode ter-scan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
