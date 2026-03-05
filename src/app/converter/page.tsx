"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Download,
  Image as ImageIcon,
  FileType,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ZoomIn,
  Maximize2,
  PauseCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type OutputFormat = "png" | "jpg" | "webp" | "ico" | "svg";

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  originalType: string;
  previewUrl: string;
  outputFormat: OutputFormat;
  outputUrl?: string;
  outputSize?: number;
  status: "pending" | "converting" | "done" | "error";
  error?: string;
  width?: number;
  height?: number;
}

const FORMAT_OPTIONS: { value: OutputFormat; label: string; desc: string; mime: string }[] = [
  { value: "png", label: "PNG", desc: "Transparent, haute qualité", mime: "image/png" },
  { value: "jpg", label: "JPG", desc: "Compressé, photos", mime: "image/jpeg" },
  { value: "webp", label: "WebP", desc: "Moderne, léger, web", mime: "image/webp" },
  { value: "ico", label: "ICO", desc: "Favicon 32×32 & 16×16", mime: "image/x-icon" },
  { value: "svg", label: "SVG", desc: "Scalable, qualité parfaite", mime: "image/svg+xml" },
];

const ACCEPTED_INPUT = "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml,image/tiff,image/x-icon";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function canvasToIcoBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    const sizes = [32, 16];
    const images: { data: Uint8Array; w: number; h: number }[] = [];

    for (const size of sizes) {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(canvas, 0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size);
      const bmp = new Uint8Array(40 + imgData.data.length);
      const dv = new DataView(bmp.buffer);
      dv.setUint32(0, 40, true);
      dv.setInt32(4, size, true);
      dv.setInt32(8, size * 2, true);
      dv.setUint16(12, 1, true);
      dv.setUint16(14, 32, true);
      dv.setUint32(20, imgData.data.length, true);
      for (let y = size - 1; y >= 0; y--) {
        for (let x = 0; x < size; x++) {
          const src = (y * size + x) * 4;
          const dst = 40 + ((size - 1 - y) * size + x) * 4;
          bmp[dst] = imgData.data[src + 2];
          bmp[dst + 1] = imgData.data[src + 1];
          bmp[dst + 2] = imgData.data[src];
          bmp[dst + 3] = imgData.data[src + 3];
        }
      }
      images.push({ data: bmp, w: size, h: size });
    }

    const headerSize = 6 + images.length * 16;
    let offset = headerSize;
    const totalSize = headerSize + images.reduce((s, img) => s + img.data.length, 0);
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, images.length, true);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const entryOffset = 6 + i * 16;
      view.setUint8(entryOffset, img.w < 256 ? img.w : 0);
      view.setUint8(entryOffset + 1, img.h < 256 ? img.h : 0);
      view.setUint8(entryOffset + 2, 0);
      view.setUint8(entryOffset + 3, 0);
      view.setUint16(entryOffset + 4, 1, true);
      view.setUint16(entryOffset + 6, 32, true);
      view.setUint32(entryOffset + 8, img.data.length, true);
      view.setUint32(entryOffset + 12, offset, true);
      new Uint8Array(buffer, offset).set(img.data);
      offset += img.data.length;
    }

    resolve(new Blob([buffer], { type: "image/x-icon" }));
  });
}

function canvasToSvg(canvas: HTMLCanvasElement): string {
  const w = canvas.width;
  const h = canvas.height;
  const dataUrl = canvas.toDataURL("image/png");
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><image width="${w}" height="${h}" xlink:href="${dataUrl}" /></svg>`;
}

async function convertFile(file: ConvertedFile, sourceImg: HTMLImageElement, quality: number, resizeW?: number, resizeH?: number): Promise<{ url: string; size: number }> {
  const canvas = document.createElement("canvas");
  const w = resizeW || sourceImg.naturalWidth;
  const h = resizeH || sourceImg.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  if (file.outputFormat === "jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }

  ctx.drawImage(sourceImg, 0, 0, w, h);

  if (file.outputFormat === "ico") {
    const blob = await canvasToIcoBlob(canvas);
    return { url: URL.createObjectURL(blob), size: blob.size };
  }

  if (file.outputFormat === "svg") {
    const svgStr = canvasToSvg(canvas);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    return { url: URL.createObjectURL(blob), size: blob.size };
  }

  const mimeMap: Record<string, string> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" };
  const mime = mimeMap[file.outputFormat] || "image/png";

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ url: URL.createObjectURL(blob), size: blob.size });
        }
      },
      mime,
      quality / 100
    );
  });
}

export default function ConverterPage() {
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/2250708454592");

  useEffect(() => {
    fetch("/api/content/settings")
      .then((r) => r.json())
      .then((data) => {
        const features = data.features || {};
        setFeatureEnabled(features.converter !== undefined ? !!features.converter : true);
        if (data.site?.whatsapp) setWhatsappUrl(`https://wa.me/${(data.site.whatsapp as string).replace(/\D/g, "")}`);
      })
      .catch(() => setFeatureEnabled(true));
  }, []);

  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(90);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [resizeW, setResizeW] = useState(512);
  const [resizeH, setResizeH] = useState(512);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: ConvertedFile[] = Array.from(fileList)
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          originalName: f.name,
          originalSize: f.size,
          originalType: f.type,
          previewUrl: URL.createObjectURL(f),
          outputFormat,
          status: "pending" as const,
        }));
      setFiles((prev) => [...prev, ...newFiles]);
    },
    [outputFormat]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f?.outputUrl) URL.revokeObjectURL(f.outputUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const convertAll = async () => {
    setIsConverting(true);
    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      const f = updated[i];
      if (f.status === "done") continue;
      updated[i] = { ...f, status: "converting", outputFormat };
      setFiles([...updated]);

      try {
        const startTime = Date.now();
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Impossible de charger l'image"));
          img.src = f.previewUrl;
        });

        const rw = resizeEnabled ? resizeW : undefined;
        const rh = resizeEnabled ? resizeH : undefined;
        const result = await convertFile({ ...f, outputFormat }, img, quality, rw, rh);

        const elapsed = Date.now() - startTime;
        if (elapsed < 5000) await new Promise((r) => setTimeout(r, 5000 - elapsed));

        updated[i] = { ...updated[i], status: "done", outputUrl: result.url, outputSize: result.size, width: img.naturalWidth, height: img.naturalHeight };
      } catch (err) {
        updated[i] = { ...updated[i], status: "error", error: (err as Error).message };
      }
      setFiles([...updated]);
    }
    setIsConverting(false);
  };

  const downloadFile = (f: ConvertedFile) => {
    if (!f.outputUrl) return;
    const ext = f.outputFormat;
    const name = f.originalName.replace(/\.[^.]+$/, "") + "." + ext;
    const a = document.createElement("a");
    a.href = f.outputUrl;
    a.download = name;
    a.click();
  };

  const downloadAll = () => {
    files.filter((f) => f.status === "done").forEach((f) => downloadFile(f));
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.outputUrl) URL.revokeObjectURL(f.outputUrl);
    });
    setFiles([]);
  };

  const doneCount = files.filter((f) => f.status === "done").length;

  if (featureEnabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (featureEnabled === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center space-y-6">
          <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
            <PauseCircle className="h-10 w-10 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Service en pause</h1>
            <p className="text-muted-foreground">Le convertisseur d&apos;images est temporairement désactivé. Contactez-nous sur WhatsApp pour toute demande.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full gap-2 bg-[#25D366] hover:bg-[#1da851] text-white">
                <MessageCircle className="h-5 w-5" />
                Nous contacter sur WhatsApp
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <FileType className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight flex items-center gap-2">
                    Convertisseur d&apos;images
                    <Badge variant="secondary" className="text-[10px] gap-0.5 font-medium">
                      <Sparkles className="h-2.5 w-2.5" /> Gratuit
                    </Badge>
                  </h1>
                  <p className="text-xs text-muted-foreground">PNG · JPG · WebP · ICO · SVG — 100% client-side</p>
                </div>
              </div>
            </div>
            {doneCount > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs" onClick={downloadAll}>
                  <Download className="h-3.5 w-3.5" /> Tout télécharger ({doneCount})
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Drop zone */}
        <motion.div
          ref={dropRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]"
              : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_INPUT}
            onChange={(e) => e.target.files && addFiles(e.target.files)}
            className="hidden"
          />
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center mx-auto mb-4">
            <Upload className={`h-7 w-7 ${isDragging ? "text-emerald-500" : "text-muted-foreground"}`} />
          </div>
          <h2 className="text-lg font-semibold mb-1">Glissez-déposez vos images ici</h2>
          <p className="text-sm text-muted-foreground">ou cliquez pour sélectionner — PNG, JPG, WebP, GIF, BMP, SVG, TIFF, ICO</p>
          <p className="text-xs text-muted-foreground mt-2">Vos fichiers ne quittent jamais votre appareil. Tout est traité localement.</p>
        </motion.div>

        {files.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            {/* Options bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-card/80 border border-border/50 rounded-2xl">
              {/* Output format */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Format de sortie</label>
                <div className="flex gap-1.5">
                  {FORMAT_OPTIONS.map((fmt) => (
                    <button
                      key={fmt.value}
                      onClick={() => setOutputFormat(fmt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        outputFormat === fmt.value
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      title={fmt.desc}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              {(outputFormat === "jpg" || outputFormat === "webp") && (
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Qualité: {quality}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-32 accent-emerald-500"
                  />
                </div>
              )}

              {/* Resize */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-1.5">
                  <input
                    type="checkbox"
                    checked={resizeEnabled}
                    onChange={(e) => setResizeEnabled(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Redimensionner
                </label>
                {resizeEnabled && (
                  <div className="flex items-center gap-1.5">
                    <input type="number" value={resizeW} onChange={(e) => setResizeW(Number(e.target.value))} className="w-16 h-7 rounded-md border border-input bg-background px-2 text-xs" />
                    <span className="text-xs text-muted-foreground">×</span>
                    <input type="number" value={resizeH} onChange={(e) => setResizeH(Number(e.target.value))} className="w-16 h-7 rounded-md border border-input bg-background px-2 text-xs" />
                    <span className="text-[10px] text-muted-foreground">px</span>
                  </div>
                )}
              </div>

              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive/70" onClick={clearAll}>
                  <Trash2 className="h-3 w-3" /> Tout effacer
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  onClick={convertAll}
                  disabled={isConverting}
                >
                  {isConverting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  Convertir{files.length > 1 ? ` (${files.length})` : ""}
                </Button>
              </div>
            </div>

            {/* File list */}
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 p-3 bg-card/80 border border-border/50 rounded-xl"
                  >
                    {/* Preview thumbnail */}
                    <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.previewUrl} alt={f.originalName} className="h-full w-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{f.originalName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{formatBytes(f.originalSize)}</span>
                        {f.width && <span className="text-[10px] text-muted-foreground">{f.width}×{f.height}</span>}
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-[10px] uppercase">{f.outputFormat || outputFormat}</Badge>
                        {f.outputSize && (
                          <span className="text-[10px] text-emerald-600 font-semibold">{formatBytes(f.outputSize)}</span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 shrink-0">
                      {f.status === "pending" && (
                        <span className="text-[10px] text-muted-foreground">En attente</span>
                      )}
                      {f.status === "converting" && (
                        <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                      )}
                      {f.status === "done" && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadFile(f)}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {f.status === "error" && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-[10px] text-destructive">{f.error}</span>
                        </div>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFile(f.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Features section */}
        {files.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ImageIcon, title: "PNG / JPG / WebP", desc: "Convertissez entre tous les formats d'images courants avec contrôle de qualité." },
              { icon: FileType, title: "Favicon ICO", desc: "Générez des favicons .ico (16×16 & 32×32) depuis n'importe quelle image." },
              { icon: ZoomIn, title: "Redimensionner", desc: "Redimensionnez vos images à n'importe quelle taille en un clic." },
              { icon: Maximize2, title: "SVG Scalable", desc: "Convertissez vos images en SVG scalable, qualité parfaite à toute taille." },
            ].map((feat, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border/50 bg-card/50">
                <feat.icon className="h-8 w-8 text-emerald-500 mb-3" />
                <h3 className="text-sm font-bold mb-1">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Privacy notice */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 100% client-side — Vos fichiers ne sont jamais envoyés à un serveur. Tout le traitement se fait dans votre navigateur.
          </p>
        </div>
      </div>
    </div>
  );
}
