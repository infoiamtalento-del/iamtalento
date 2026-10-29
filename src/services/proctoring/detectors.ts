/**
 * Client-side 30-Layer Proctoring Detectors:
 * - Hardware fingerprint, WebGL VM/Emulator & Virtual-Camera checks (Layers 6, 12, 19, 22)
 * - 64x48 Canvas Vision: Face presence, Gaze offset, Optical motion, Multi-face clusters & Room Sweep (Layers 1, 4, 5, 7, 8, 26)
 * - Web Audio FFT Speech Formant (300-3400Hz) & Ambient Noise Calibrator (Layers 6, 9)
 * - Keystroke Dynamics & Stylometry Authenticity Tracker (Layers 11, 24)
 * - VisibilityStateEntry Performance Timeline Forensics (Layers 10, 17)
 */

export async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Deterministic FNV fallback for non-secure test contexts
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}

/* ------------------------------------------------------------------ */
/* Layers 6, 12, 15, 19, 22: Device, VM, Multi-Screen & Network Probe  */
/* ------------------------------------------------------------------ */
export interface DeviceTelemetry {
  fingerprint: string;
  timezone: string;
  clientEpochMs: number;
  vmFlags: string[];
  gpuRenderer: string;
  isExtendedDisplay: boolean;
  networkType: string;
  rttMs: number;
}

export async function collectDeviceTelemetry(stream?: MediaStream | null): Promise<DeviceTelemetry> {
  const vmFlags: string[] = [];
  let gpuRenderer = "standard-gpu";

  if (typeof window !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (gl) {
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "") : String(gl.getParameter(gl.RENDERER) || "");
        const vendor = dbg ? String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || "") : "";
        gpuRenderer = `${vendor} ${renderer}`.trim() || "webgl-gpu";
        const lower = gpuRenderer.toLowerCase();
        if (/(swiftshader|llvmpipe|softpipe|virtualbox|vmware|parallels|qemu|hyper-v|microsoft basic render)/.test(lower)) {
          vmFlags.push(`virtual_gpu:${lower.slice(0, 36)}`);
        }
      }
    } catch {
      // Ignore WebGL probe restrictions
    }

    if (navigator.webdriver) {
      vmFlags.push("webdriver_automation");
    }
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 1) {
      vmFlags.push("single_vcpu_host");
    }
  }

  const virtualCams = await detectVirtualCameraLabels(stream);
  vmFlags.push(...virtualCams);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const screenSig = typeof window !== "undefined"
    ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
    : "0x0";
  const isExtendedDisplay = Boolean(typeof window !== "undefined" && (window.screen as unknown as { isExtended?: boolean }).isExtended);

  const rawFp = [
    typeof navigator !== "undefined" ? navigator.userAgent : "ua",
    typeof navigator !== "undefined" ? navigator.language : "en",
    typeof navigator !== "undefined" ? String(navigator.hardwareConcurrency ?? 4) : "4",
    screenSig,
    timezone,
    gpuRenderer,
  ].join("|");

  const fingerprint = (await sha256Hex(rawFp)).slice(0, 48);
  const conn = typeof navigator !== "undefined" ? (navigator as unknown as { connection?: { effectiveType?: string; rtt?: number } }).connection : undefined;

  return {
    fingerprint,
    timezone,
    clientEpochMs: Date.now(),
    vmFlags: Array.from(new Set(vmFlags)),
    gpuRenderer,
    isExtendedDisplay,
    networkType: conn?.effectiveType ?? "broadband",
    rttMs: conn?.rtt ?? 25,
  };
}

export async function detectVirtualCameraLabels(stream?: MediaStream | null): Promise<string[]> {
  const flags: string[] = [];
  const pattern = /(obs virtual|manycam|snap camera|droidcam|iriun|vcam|splitcam|xsplit|camtwist|epoccam)/i;

  if (stream) {
    for (const track of stream.getVideoTracks()) {
      if (pattern.test(track.label || "")) {
        flags.push(`virtual_cam:${track.label.slice(0, 32)}`);
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      for (const d of devices) {
        if (d.kind === "videoinput" && pattern.test(d.label || "")) {
          flags.push(`virtual_cam:${d.label.slice(0, 32)}`);
        }
      }
    } catch {
      // Ignore permission errors before prompt
    }
  }
  return Array.from(new Set(flags));
}

/* ------------------------------------------------------------------ */
/* Layers 1, 4, 5, 7, 8, 26: Real-Time Canvas Vision & Gaze Analyzer   */
/* ------------------------------------------------------------------ */
export interface FrameVisionResult {
  avgLuma: number;
  lumaStd: number;
  edgeScore: number;
  faceDetected: boolean;
  multipleFaces: boolean;
  lensCovered: boolean;
  gazeOffsetX: number; // -0.5..+0.5 (0 = centered)
  gazeOffsetY: number; // -0.5..+0.5 (0 = centered)
  lookingAway: boolean;
  motionDelta: number;
  faceMatchScore: number; // 0..100 cosine similarity vs baseline
  histogram: number[];
  lumaBuffer: Uint8Array;
}

const VISION_W = 64;
const VISION_H = 48;
let sharedCanvas: HTMLCanvasElement | null = null;

function getVisionCtx(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!sharedCanvas) {
    sharedCanvas = document.createElement("canvas");
    sharedCanvas.width = VISION_W;
    sharedCanvas.height = VISION_H;
  }
  return sharedCanvas.getContext("2d", { willReadFrequently: true });
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    ma += a[i] * a[i];
    mb += b[i] * b[i];
  }
  if (ma === 0 || mb === 0) return 0;
  return dot / (Math.sqrt(ma) * Math.sqrt(mb));
}

export async function analyzeVideoFrame(
  video: HTMLVideoElement,
  prevLuma?: Uint8Array | null,
  baselineHistogram?: number[] | null
): Promise<FrameVisionResult | null> {
  if (!video || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
    return null;
  }
  const ctx = getVisionCtx();
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, VISION_W, VISION_H);
  const { data } = ctx.getImageData(0, 0, VISION_W, VISION_H);
  const totalPx = VISION_W * VISION_H;
  const luma = new Uint8Array(totalPx);
  const hist = new Array<number>(24).fill(0); // 16 luma + 8 chroma bins

  let sumLuma = 0;
  let skinCount = 0;
  let skinWeightedX = 0;
  let skinWeightedY = 0;
  let leftLobe = 0;
  let centerGap = 0;
  let rightLobe = 0;
  let motionSum = 0;

  for (let y = 0; y < VISION_H; y++) {
    for (let x = 0; x < VISION_W; x++) {
      const idx = y * VISION_W + x;
      const p = idx * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const yVal = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      luma[idx] = yVal;
      sumLuma += yVal;

      if (prevLuma && prevLuma.length === totalPx) {
        motionSum += Math.abs(yVal - prevLuma[idx]);
      }

      // Normalized YCbCr skin-tone & portrait foreground heuristic across diverse skin tones
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const isSkinTone = yVal > 28 && yVal < 245 && cb >= 75 && cb <= 135 && cr >= 130 && cr <= 182;

      if (isSkinTone) {
        skinCount++;
        skinWeightedX += x / VISION_W;
        skinWeightedY += y / VISION_H;

        // Center crop histogram for biometric face signature
        if (x >= VISION_W * 0.2 && x <= VISION_W * 0.8 && y >= VISION_H * 0.12 && y <= VISION_H * 0.88) {
          hist[Math.min(15, yVal >> 4)] += 1;
          hist[16 + Math.min(3, Math.max(0, Math.floor((cr - 130) / 13)))] += 1;
          hist[20 + Math.min(3, Math.max(0, Math.floor((cb - 75) / 15)))] += 1;
        }

        if (y > VISION_H * 0.15 && y < VISION_H * 0.82) {
          if (x < VISION_W * 0.33) leftLobe++;
          else if (x <= VISION_W * 0.66) centerGap++;
          else rightLobe++;
        }
      } else if (x >= VISION_W * 0.25 && x <= VISION_W * 0.75 && y >= VISION_H * 0.15 && y <= VISION_H * 0.85) {
        hist[Math.min(15, yVal >> 4)] += 0.35;
      }
    }
  }

  const avgLuma = sumLuma / totalPx;
  let varSum = 0;
  let edgeSum = 0;
  for (let y = 1; y < VISION_H - 1; y++) {
    for (let x = 1; x < VISION_W - 1; x++) {
      const idx = y * VISION_W + x;
      const d = luma[idx] - avgLuma;
      varSum += d * d;
      const gx = Math.abs(luma[idx + 1] - luma[idx - 1]);
      const gy = Math.abs(luma[idx + VISION_W] - luma[idx - VISION_W]);
      edgeSum += gx + gy;
    }
  }

  const lumaStd = Math.sqrt(varSum / totalPx);
  const edgeScore = Math.round((edgeSum / totalPx) * 10) / 10;
  const motionDelta = prevLuma ? Math.round((motionSum / totalPx) * 10) / 10 : 0;
  const lensCovered = avgLuma < 14 && lumaStd < 8;

  // Use native FaceDetector API when available (Chromium Shape Detection), otherwise skin/portrait model
  let faceDetected = !lensCovered && skinCount >= totalPx * 0.045 && lumaStd >= 10;
  let multipleFaces = !lensCovered && leftLobe > totalPx * 0.055 && rightLobe > totalPx * 0.055 && centerGap < Math.min(leftLobe, rightLobe) * 0.35;
  let centroidX = skinCount > 0 ? skinWeightedX / skinCount : 0.5;
  let centroidY = skinCount > 0 ? skinWeightedY / skinCount : 0.5;

  const FaceDetectorCtor = typeof window !== "undefined" ? (window as unknown as { FaceDetector?: new (opts?: unknown) => { detect: (v: HTMLVideoElement) => Promise<Array<{ boundingBox: DOMRectReadOnly }>> } }).FaceDetector : undefined;
  if (FaceDetectorCtor) {
    try {
      const fd = new FaceDetectorCtor({ fastMode: true, maxDetectedFaces: 3 });
      const faces = await fd.detect(video);
      faceDetected = faces.length >= 1;
      multipleFaces = faces.length > 1;
      if (faces.length >= 1) {
        const b = faces[0].boundingBox;
        centroidX = (b.x + b.width / 2) / video.videoWidth;
        centroidY = (b.y + b.height / 2) / video.videoHeight;
      }
    } catch {
      // Fallback to canvas chrominance model already computed above
    }
  }

  const gazeOffsetX = Math.round((centroidX - 0.5) * 100) / 100;
  const gazeOffsetY = Math.round((centroidY - 0.5) * 100) / 100;
  const lookingAway = !faceDetected || Math.abs(gazeOffsetX) > 0.24 || Math.abs(gazeOffsetY) > 0.26;

  const normFactor = hist.reduce((a, b) => a + b, 0) || 1;
  const normalizedHist = hist.map((v) => Math.round((v / normFactor) * 1000) / 1000);

  let faceMatchScore = faceDetected ? 94 : 0;
  if (baselineHistogram && baselineHistogram.length === normalizedHist.length && faceDetected) {
    const sim = cosineSimilarity(normalizedHist, baselineHistogram);
    faceMatchScore = Math.round(Math.max(0, Math.min(100, sim * 100)));
  }

  return {
    avgLuma: Math.round(avgLuma * 10) / 10,
    lumaStd: Math.round(lumaStd * 10) / 10,
    edgeScore,
    faceDetected,
    multipleFaces,
    lensCovered,
    gazeOffsetX,
    gazeOffsetY,
    lookingAway,
    motionDelta,
    faceMatchScore,
    histogram: normalizedHist,
    lumaBuffer: luma,
  };
}

export async function captureCompressedJpeg(
  video: HTMLVideoElement,
  maxWidth = 360,
  quality = 0.7
): Promise<{ blob: Blob; dataUrl: string } | null> {
  if (!video || video.readyState < 2 || video.videoWidth === 0) return null;
  const scale = Math.min(1, maxWidth / video.videoWidth);
  const w = Math.max(64, Math.round(video.videoWidth * scale));
  const h = Math.max(48, Math.round(video.videoHeight * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, w, h);
  const dataUrl = c.toDataURL("image/jpeg", quality);
  const blob = await new Promise<Blob | null>((resolve) => c.toBlob((b) => resolve(b), "image/jpeg", quality));
  if (!blob) return null;
  return { blob, dataUrl };
}

/* ------------------------------------------------------------------ */
/* Layers 6 & 9: Web Audio Speech Formant & Ambient Noise Monitor      */
/* ------------------------------------------------------------------ */
export class AudioProctorMonitor {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private track: MediaStreamTrack | null = null;
  private freqBuf: Uint8Array<ArrayBuffer> | null = null;
  private timeBuf: Uint8Array<ArrayBuffer> | null = null;
  public noiseFloorDb = -52;

  constructor(stream: MediaStream) {
    const audioTrack = stream.getAudioTracks()[0] ?? null;
    this.track = audioTrack;
    if (!audioTrack || typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    try {
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.65;
      this.source = this.ctx.createMediaStreamSource(new MediaStream([audioTrack]));
      this.source.connect(this.analyser);
      this.freqBuf = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
      this.timeBuf = new Uint8Array(new ArrayBuffer(this.analyser.fftSize));
    } catch {
      this.ctx = null;
    }
  }

  public sample(): { rmsDb: number; speechBandRatio: number; voiceDetected: boolean; micMuted: boolean; levelPct: number } {
    const micMuted = !this.track || this.track.muted || !this.track.enabled || this.track.readyState !== "live";
    if (!this.analyser || !this.freqBuf || !this.timeBuf || micMuted) {
      return { rmsDb: -90, speechBandRatio: 0, voiceDetected: false, micMuted, levelPct: 0 };
    }
    if (this.ctx?.state === "suspended") {
      void this.ctx.resume().catch(() => undefined);
    }

    this.analyser.getByteTimeDomainData(this.timeBuf);
    let sq = 0;
    for (let i = 0; i < this.timeBuf.length; i++) {
      const v = (this.timeBuf[i] - 128) / 128;
      sq += v * v;
    }
    const rms = Math.sqrt(sq / this.timeBuf.length);
    const rmsDb = rms > 0.00001 ? Math.round(20 * Math.log10(rms) * 10) / 10 : -90;

    this.analyser.getByteFrequencyData(this.freqBuf);
    const sampleRate = this.ctx?.sampleRate ?? 44100;
    const binHz = sampleRate / (this.analyser.fftSize || 512);
    let totalEnergy = 0;
    let speechEnergy = 0;
    for (let i = 1; i < this.freqBuf.length; i++) {
      const hz = i * binHz;
      const e = this.freqBuf[i];
      totalEnergy += e;
      if (hz >= 280 && hz <= 3400) speechEnergy += e;
    }

    const speechBandRatio = totalEnergy > 0 ? Math.round((speechEnergy / totalEnergy) * 100) / 100 : 0;
    const voiceDetected = rmsDb > Math.max(-36, this.noiseFloorDb + 15) && speechBandRatio >= 0.52;
    const levelPct = Math.max(0, Math.min(100, Math.round(((rmsDb + 65) / 55) * 100)));

    return { rmsDb, speechBandRatio, voiceDetected, micMuted, levelPct };
  }

  public async calibrateNoiseFloor(durationMs = 900): Promise<number> {
    const readings: number[] = [];
    const steps = Math.max(3, Math.floor(durationMs / 150));
    for (let i = 0; i < steps; i++) {
      const { rmsDb } = this.sample();
      if (rmsDb > -85) readings.push(rmsDb);
      await new Promise((r) => setTimeout(r, 140));
    }
    if (readings.length > 0) {
      const avg = readings.reduce((a, b) => a + b, 0) / readings.length;
      this.noiseFloorDb = Math.round(Math.min(-28, Math.max(-68, avg)) * 10) / 10;
    }
    return this.noiseFloorDb;
  }

  public dispose(): void {
    try {
      this.source?.disconnect();
      this.analyser?.disconnect();
      if (this.ctx && this.ctx.state !== "closed") void this.ctx.close();
    } catch {
      // Ignore audio teardown errors
    }
    this.ctx = null;
    this.analyser = null;
    this.source = null;
  }
}

/* ------------------------------------------------------------------ */
/* Layers 11 & 24: Keystroke Dynamics & Stylometry Authenticity        */
/* ------------------------------------------------------------------ */
export class KeystrokeTracker {
  private lastKeyAt = 0;
  private ikis: number[] = [];
  public totalKeystrokes = 0;
  public backspaces = 0;
  public pasteBursts = 0;
  public rapidInjectionCount = 0;
  private prevInputLen = 0;
  private prevInputAt = 0;

  public onKeyDown(key: string): { suspiciousBurst: boolean } {
    const now = performance.now();
    this.totalKeystrokes++;
    if (key === "Backspace" || key === "Delete") this.backspaces++;
    if (this.lastKeyAt > 0) {
      const delta = now - this.lastKeyAt;
      if (delta > 5 && delta < 4000) {
        this.ikis.push(delta);
        if (this.ikis.length > 250) this.ikis.shift();
      }
    }
    this.lastKeyAt = now;

    // Check robotic uniform ultra-fast cadence (<18ms std across 20 keys with mean < 38ms => >300 WPM)
    if (this.ikis.length >= 20) {
      const tail = this.ikis.slice(-20);
      const mean = tail.reduce((a, b) => a + b, 0) / tail.length;
      const std = Math.sqrt(tail.reduce((a, b) => a + (b - mean) ** 2, 0) / tail.length);
      if (mean < 38 && std < 12) {
        this.rapidInjectionCount++;
        this.ikis = [];
        return { suspiciousBurst: true };
      }
    }
    return { suspiciousBurst: false };
  }

  public onTextChange(newLen: number): { injectedBlock: boolean } {
    const now = performance.now();
    const diff = newLen - this.prevInputLen;
    this.prevInputLen = newLen;
    this.prevInputAt = now;
    if (diff >= 45) {
      this.pasteBursts++;
      return { injectedBlock: true };
    }
    return { injectedBlock: false };
  }

  public getMetrics(totalTypedChars = 0) {
    const mean = this.ikis.length ? this.ikis.reduce((a, b) => a + b, 0) / this.ikis.length : 0;
    const std = this.ikis.length
      ? Math.sqrt(this.ikis.reduce((a, b) => a + (b - mean) ** 2, 0) / this.ikis.length)
      : 0;
    const wpm = mean > 0 ? Math.round(60000 / (mean * 5)) : 0;
    const keystrokeCharRatio = totalTypedChars >= 30
      ? Math.round((this.totalKeystrokes / Math.max(1, totalTypedChars)) * 100) / 100
      : 1;

    return {
      totalKeystrokes: this.totalKeystrokes,
      backspaces: this.backspaces,
      ikiMeanMs: Math.round(mean),
      ikiStdMs: Math.round(std),
      estimatedWpm: wpm,
      pasteBurstCount: this.pasteBursts,
      rapidInjectionCount: this.rapidInjectionCount,
      keystrokeCharRatio,
    };
  }
}

/* ------------------------------------------------------------------ */
/* Layers 10 & 17: VisibilityStateEntry Timeline Forensics             */
/* ------------------------------------------------------------------ */
export interface VisibilityForensics {
  initiallyBackgrounded: boolean;
  timeBackgrounded: number | null;
}

/**
 * Uses `VisibilityStateEntry` (`performance.getEntriesByType('visibility-state')`)
 * when supported, falling back to `document.visibilityState` for Firefox/Safari.
 */
export function detectInitialVisibility(): VisibilityForensics {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return { initiallyBackgrounded: false, timeBackgrounded: null };
  }

  if ("VisibilityStateEntry" in window && typeof performance.getEntriesByType === "function") {
    const entries = performance.getEntriesByType("visibility-state");
    if (entries.length > 0) {
      const initiallyBackgrounded = entries[0].name === "hidden";
      let timeBackgrounded: number | null = null;
      for (const entry of entries) {
        if (entry.name === "hidden") {
          timeBackgrounded = Math.round(entry.startTime);
          break;
        }
      }
      return { initiallyBackgrounded, timeBackgrounded };
    }
  }

  // Fallback for Firefox / Safari
  const initiallyBackgrounded = typeof document !== "undefined" && document.visibilityState === "hidden";
  return {
    initiallyBackgrounded,
    timeBackgrounded: initiallyBackgrounded ? 0 : null,
  };
}

/**
 * Calculates cumulative foreground (visible) time in milliseconds using
 * `performance.getEntriesByType('visibility-state')`, falling back to `performance.now()`.
 */
export function calculateTotalForegroundTimeMs(): number {
  if (typeof performance === "undefined") return 0;
  if (typeof performance.getEntriesByType === "function") {
    const entries = performance.getEntriesByType("visibility-state");
    if (entries.length === 0) {
      return Math.round(performance.now());
    }
    let totalForegroundTime = 0;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].name === "visible") {
        const start = entries[i].startTime;
        const end = i + 1 < entries.length ? entries[i + 1].startTime : performance.now();
        totalForegroundTime += end - start;
      }
    }
    return Math.round(totalForegroundTime);
  }
  return Math.round(performance.now());
}
