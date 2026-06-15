import { useState, useRef, useCallback } from "react";
import JSZip from "jszip"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VolumeData {
  id: string;
  seriesid: string;
  entered: string;
  published: boolean;
  title: string;
  number: number;
  summary: string | null;
  images: string[];
  pagenum: number[];
}

interface Page {
  id: string; // internal stable key
  url: string;
  pagenum: number;
  isInserted?: boolean; // user-added local file
  localFile?: File;
  localPreview?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPages(data: VolumeData): Page[] {
  return data.images.map((url, i) => ({
    id: `orig-${i}`,
    url,
    pagenum: data.pagenum[i] ?? i,
  }));
}

function zeroPad(n: number, len = 3) {
  return String(n).padStart(len, "0");
}

async function fetchAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.blob();
}

function mimeToExt(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

// ─── EPUB builder (Kindle-compatible graphic novel) ───────────────────────────

async function buildEpub(
  pages: Page[],
  title: string,
  volumeNumber: number,
  onProgress: (p: number, msg: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  // mimetype (must be first, uncompressed)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  const oebps = zip.folder("OEBPS")!;
  const images = oebps.folder("images")!;
  const text = oebps.folder("text")!;

  const imageItems: { id: string; href: string; mediaType: string }[] = [];
  const spineItems: string[] = [];

  // Fetch / embed each page image
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const label = `page_${zeroPad(i + 1)}`;
    onProgress(
      Math.round((i / pages.length) * 70),
      `Embedding page ${i + 1} of ${pages.length}…`
    );

    let blob: Blob;
    let ext = "jpg";
    if (page.localFile) {
      blob = page.localFile;
      ext = mimeToExt(page.localFile.type);
    } else {
      blob = await fetchAsBlob(page.url);
      ext = mimeToExt(blob.type);
    }

    const imgFilename = `${label}.${ext}`;
    const mediaType = `image/${ext === "jpg" ? "jpeg" : ext}`;
    images.file(imgFilename, blob);
    imageItems.push({ id: label, href: `images/${imgFilename}`, mediaType });

    // XHTML page wrapper — Kindle fixed-layout style
    const xhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta charset="UTF-8"/>
  <title>${title} – Page ${i + 1}</title>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; }
    img { width: 100%; height: 100%; object-fit: contain; display: block; }
  </style>
</head>
<body>
  <img src="../images/${imgFilename}" alt="Page ${i + 1}"/>
</body>
</html>`;
    const xhtmlFile = `${label}.xhtml`;
    text.file(xhtmlFile, xhtml);
    spineItems.push(label);
  }

  onProgress(72, "Writing OPF package…");

  // content.opf
  const manifestItems = [
    ...imageItems.map(
      (img) =>
        `    <item id="${img.id}-img" href="${img.href}" media-type="${img.mediaType}"/>`
    ),
    ...spineItems.map(
      (id) =>
        `    <item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`
    ),
    `    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`,
  ].join("\n");

  const spineElements = spineItems
    .map((id) => `    <itemref idref="${id}"/>`)
    .join("\n");

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
         unique-identifier="BookId"
         version="3.0"
         prefix="rendition: http://www.idpf.org/vocab/rendition/#">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">urn:uuid:${crypto.randomUUID()}</dc:identifier>
    <meta name="fixed-layout" content="true"/>
    <meta name="original-resolution" content="1072x1448"/>
    <meta name="book-type" content="comic"/>
    <meta name="RegionMagnification" content="false"/>
    <meta property="rendition:layout">pre-paginated</meta>
    <meta property="rendition:orientation">portrait</meta>
    <meta property="rendition:spread">none</meta>
  </metadata>
  <manifest>
${manifestItems}
  </manifest>
  <spine toc="ncx">
${spineElements}
  </spine>
</package>`;

  oebps.file("content.opf", opf);

  // toc.ncx
  const navPoints = spineItems
    .map(
      (id, i) => `    <navPoint id="nav-${i}" playOrder="${i + 1}">
      <navLabel><text>Page ${i + 1}</text></navLabel>
      <content src="text/${id}.xhtml"/>
    </navPoint>`
    )
    .join("\n");

  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="BookId"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="${pages.length}"/>
    <meta name="dtb:maxPageNumber" content="${pages.length}"/>
  </head>
  <docTitle><text>${title}</text></docTitle>
  <navMap>
${navPoints}
  </navMap>
</ncx>`;

  oebps.file("toc.ncx", ncx);

  // META-INF/container.xml
  const metaInf = zip.folder("META-INF")!;
  metaInf.file(
    "container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf"
              media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  onProgress(90, "Compressing EPUB…");
  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
  onProgress(100, "Done.");
  return blob;
}

// ─── ZIP builder ──────────────────────────────────────────────────────────────

async function buildZip(
  pages: Page[],
  title: string,
  volumeNumber: number,
  onProgress: (p: number, msg: string) => void
): Promise<Blob> {
  const zip = new JSZip();
  const safeTitle = title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().replace(/ +/g, "_");
  const folder = zip.folder(`${safeTitle}_Vol${zeroPad(volumeNumber)}`)!;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    onProgress(
      Math.round((i / pages.length) * 85),
      `Downloading page ${i + 1} of ${pages.length}…`
    );

    let blob: Blob;
    let ext = "jpg";
    if (page.localFile) {
      blob = page.localFile;
      ext = mimeToExt(page.localFile.type);
    } else {
      blob = await fetchAsBlob(page.url);
      ext = mimeToExt(blob.type);
    }

    const filename = `${safeTitle}_Vol${zeroPad(volumeNumber)}_Page${zeroPad(i + 1)}.${ext}`;
    folder.file(filename, blob);
  }

  onProgress(95, "Compressing ZIP…");
  const result = await zip.generateAsync({ type: "blob" });
  onProgress(100, "Done.");
  return result;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InsertZoneProps {
  afterIndex: number; // -1 = prepend
  onInsert: (afterIndex: number, files: FileList) => void;
}

function InsertZone({ afterIndex, onInsert }: InsertZoneProps) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHover(false);
    if (e.dataTransfer.files.length) onInsert(afterIndex, e.dataTransfer.files);
  };

  return (
    <div className="flex items-center justify-center w-12 flex-shrink-0 group relative">
      <button
        className={`h-full min-h-[160px] w-3 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center
          ${hover || open ? "w-10 bg-primary/20 border-2 border-primary border-dashed" : "bg-base-300/40 hover:bg-primary/10"}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); }}
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={handleDrop}
        onClick={() => setOpen(true)}
        title="Insert pages here"
      >
        {hover && (
          <span className="text-primary font-bold text-lg leading-none select-none">+</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 top-1/2 -translate-y-1/2 left-full ml-2 bg-base-100 border border-base-300 rounded-xl shadow-2xl p-4 w-56 flex flex-col gap-3">
          <p className="text-xs font-semibold text-base-content/70 uppercase tracking-widest">Insert pages here</p>
          <div
            className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center text-xs text-base-content/50 hover:border-primary hover:text-primary transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) { onInsert(afterIndex, e.dataTransfer.files); setOpen(false); } }}
            onClick={() => inputRef.current?.click()}
          >
            Drop images<br/>or click to browse
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) { onInsert(afterIndex, e.target.files); setOpen(false); }
            }}
          />
          <button className="btn btn-xs btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

interface PageThumbProps {
  page: Page;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function PageThumb({ page, index, selected, onSelect, onRemove }: PageThumbProps) {
  const src = page.localPreview ?? page.url;

  return (
    <div
      className={`relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-150 group
        ${selected ? "ring-4 ring-primary shadow-xl scale-105" : "ring-1 ring-base-300 hover:ring-2 hover:ring-primary/50 hover:scale-[1.02]"}`}
      style={{ width: 120, height: 170 }}
      onClick={onSelect}
    >
      <img
        src={src}
        alt={`Page ${index + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {page.isInserted && (
        <div className="absolute top-1 left-1 badge badge-primary badge-xs font-bold">NEW</div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1 px-2">
        <span className="text-white text-xs font-mono">{index + 1}</span>
      </div>
      {page.isInserted && (
        <button
          className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          title="Remove page"
        >✕</button>
      )}
    </div>
  );
}

// ─── Modal / lightbox ──────────────────────────────────────────────────────────

interface LightboxProps {
  pages: Page[];
  current: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

function Lightbox({ pages, current, onClose, onNavigate }: LightboxProps) {
  const page = pages[current];
  const src = page.localPreview ?? page.url;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 btn btn-circle btn-ghost text-white text-xl z-10" onClick={onClose}>✕</button>

      <button
        className="absolute left-4 btn btn-circle btn-ghost text-white text-2xl disabled:opacity-20"
        disabled={current === 0}
        onClick={(e) => { e.stopPropagation(); onNavigate(current - 1); }}
      >‹</button>

      <div className="flex flex-col items-center gap-3 max-h-screen p-12" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={`Page ${current + 1}`}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        />
        <span className="text-white/60 text-sm font-mono">Page {current + 1} of {pages.length}</span>
      </div>

      <button
        className="absolute right-4 btn btn-circle btn-ghost text-white text-2xl disabled:opacity-20"
        disabled={current === pages.length - 1}
        onClick={(e) => { e.stopPropagation(); onNavigate(current + 1); }}
      >›</button>
    </div>
  );
}

// ─── Progress modal ────────────────────────────────────────────────────────────

function ProgressModal({ progress, message }: { progress: number; message: string }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center">
      <div className="bg-base-100 rounded-2xl p-8 shadow-2xl w-80 flex flex-col gap-4">
        <p className="font-semibold text-base-content">Exporting…</p>
        <progress className="progress progress-primary w-full" value={progress} max={100}></progress>
        <p className="text-sm text-base-content/60">{message}</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface VolumeConstructorProps {
  data: VolumeData;
}

export default function VolumeConstructor({ data }: VolumeConstructorProps) {
  const [pages, setPages] = useState<Page[]>(() => buildPages(data));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState("");

  const handleInsert = useCallback((afterIndex: number, files: FileList) => {
    const newPages: Page[] = Array.from(files).map((file, i) => {
      const preview = URL.createObjectURL(file);
      return {
        id: `inserted-${Date.now()}-${i}`,
        url: preview,
        pagenum: afterIndex + 1 + i,
        isInserted: true,
        localFile: file,
        localPreview: preview,
      };
    });

    setPages((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, ...newPages);
      return next;
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
    setSelectedIdx(null);
  }, []);

  const handleExport = async (type: "zip" | "epub") => {
    setExporting(true);
    setExportProgress(0);
    setExportMessage("Starting…");
    try {
      const onProgress = (p: number, msg: string) => {
        setExportProgress(p);
        setExportMessage(msg);
      };

      const safeTitle = data.title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().replace(/ +/g, "_");

      if (type === "zip") {
        const blob = await buildZip(pages, data.title, data.number, onProgress);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeTitle}_Vol${zeroPad(data.number)}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = await buildEpub(pages, data.title, data.number, onProgress);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeTitle}_Vol${zeroPad(data.number)}.epub`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert("Export failed. Check console for details.");
    } finally {
      setExporting(false);
    }
  };

  const totalInserted = pages.filter((p) => p.isInserted).length;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col font-sans">
      {/* ── Header ── */}
      <div className="navbar bg-base-100 border-b border-base-300 px-6 gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="badge badge-outline badge-lg font-mono text-xs">Vol. {zeroPad(data.number)}</span>
            <h1 className="text-xl font-bold text-base-content truncate">{data.title}</h1>
            {data.published && <span className="badge badge-success badge-sm">Published</span>}
          </div>
          <p className="text-xs text-base-content/40 mt-0.5 font-mono">
            {pages.length} pages total
            {totalInserted > 0 && (
              <span className="ml-2 text-primary font-semibold">+{totalInserted} inserted</span>
            )}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-sm gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </label>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-xl shadow-2xl w-52 border border-base-300 mt-2 z-50">
              <li>
                <button onClick={() => handleExport("zip")} className="flex items-start gap-3 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12L19 8" />
                  </svg>
                  <div>
                    <div className="font-semibold text-sm">Download ZIP</div>
                    <div className="text-xs text-base-content/50">Named image files</div>
                  </div>
                </button>
              </li>
              <li>
                <button onClick={() => handleExport("epub")} className="flex items-start gap-3 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <div className="font-semibold text-sm">Download EPUB</div>
                    <div className="text-xs text-base-content/50">Kindle graphic novel</div>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Instructions banner ── */}
      <div className="bg-base-100/60 border-b border-base-300 px-6 py-2 flex items-center gap-3 text-xs text-base-content/50">
        <span>
          <strong className="text-base-content/70">Hover between pages</strong> to insert new pages there.
        </span>
        <span>•</span>
        <span><strong className="text-base-content/70">Click a page</strong> to preview it full-size.</span>
        <span>•</span>
        <span><strong className="text-base-content/70">Inserted pages</strong> can be removed with the × button.</span>
      </div>

      {/* ── Page strip ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex items-center gap-0 px-6 py-8 min-w-max min-h-[280px]">
          {/* Prepend zone */}
          <InsertZone afterIndex={-1} onInsert={handleInsert} />

          {pages.map((page, i) => (
            <div key={page.id} className="flex items-center">
              <PageThumb
                page={page}
                index={i}
                selected={selectedIdx === i}
                onSelect={() => {
                  setSelectedIdx(i);
                  setLightboxIdx(i);
                }}
                onRemove={() => handleRemove(i)}
              />
              <InsertZone afterIndex={i} onInsert={handleInsert} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom summary bar ── */}
      <div className="bg-base-100 border-t border-base-300 px-6 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-6 text-xs text-base-content/50 font-mono">
          <span><span className="text-base-content/80 font-semibold">{data.images.length}</span> original pages</span>
          <span><span className="text-primary font-semibold">{totalInserted}</span> inserted</span>
          <span><span className="text-base-content/80 font-semibold">{pages.length}</span> total in export</span>
        </div>
        <div className="text-xs text-base-content/40 font-mono">
          ZIP filenames: <code>{data.title.replace(/ /g, "_")}_Vol{zeroPad(data.number)}_Page001.jpg …</code>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <Lightbox
          pages={pages}
          current={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNavigate={(i) => setLightboxIdx(i)}
        />
      )}

      {/* ── Export progress ── */}
      {exporting && <ProgressModal progress={exportProgress} message={exportMessage} />}
    </div>
  );
}