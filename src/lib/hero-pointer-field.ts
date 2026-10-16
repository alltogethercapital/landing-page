type Stamp = {
  x: number;
  y: number;
  time: number;
  flowX: number;
  flowY: number;
};

const LIFETIME_MS = 1100;
const RADIUS_PX = 22;
const SPACING_PX = 6;
const MAX_STAMPS = 48;
const DRIFT_PX_PER_SECOND = 24;

/** Cell-resolution wake: red is strength, green/blue are signed flow direction. */
export class HeroPointerField {
  readonly canvas = document.createElement("canvas");
  private readonly context = this.canvas.getContext("2d", { alpha: false });
  private stamps: Stamp[] = [];
  private last: Stamp | null = null;
  private wasActive = false;
  private width = 1;
  private height = 1;
  private pixels: ImageData | null = null;
  private strength = new Float32Array(0);
  private flowX = new Float32Array(0);
  private flowY = new Float32Array(0);
  private weights = new Float32Array(0);

  resize(width: number, height: number, columns: number, rows: number) {
    if (
      this.pixels && this.width === width && this.height === height &&
      this.canvas.width === columns && this.canvas.height === rows
    ) return;
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.canvas.width = Math.max(1, Math.floor(columns));
    this.canvas.height = Math.max(1, Math.floor(rows));
    const cells = this.canvas.width * this.canvas.height;
    this.strength = new Float32Array(cells);
    this.flowX = new Float32Array(cells);
    this.flowY = new Float32Array(cells);
    this.weights = new Float32Array(cells);
    this.pixels = this.context?.createImageData(this.canvas.width, this.canvas.height) ?? null;
    this.clear();
  }

  add(x: number, y: number, time: number) {
    const previous = this.last && time - this.last.time < 140 ? this.last : null;
    const distance = previous ? Math.hypot(x - previous.x, y - previous.y) : 0;
    if (previous && distance < SPACING_PX && time - previous.time < 45) return;

    const elapsed = previous ? Math.max(12, time - previous.time) : 16;
    const speed = distance / elapsed * 1000;
    const momentum = Math.min(1, Math.max(0.35, speed / 700));
    const flowX = previous && distance > 0.5 ? (x - previous.x) / distance * momentum : previous?.flowX ?? 0;
    const flowY = previous && distance > 0.5 ? (y - previous.y) / distance * momentum : previous?.flowY ?? -0.35;
    const next = { x, y, time, flowX, flowY };
    const steps = previous ? Math.min(16, Math.max(1, Math.ceil(distance / SPACING_PX))) : 1;
    for (let step = 1; step <= steps; step++) {
      const mix = step / steps;
      this.stamps.push(previous ? {
        x: previous.x + (x - previous.x) * mix,
        y: previous.y + (y - previous.y) * mix,
        time: previous.time + (time - previous.time) * mix,
        flowX,
        flowY,
      } : next);
    }
    if (this.stamps.length > MAX_STAMPS) this.stamps.splice(0, this.stamps.length - MAX_STAMPS);
    this.last = next;
  }

  leave() { this.last = null; }

  clear() {
    this.stamps = [];
    this.last = null;
    this.wasActive = true;
  }

  paint(time: number): { changed: boolean; active: boolean } {
    const context = this.context;
    const image = this.pixels;
    if (!context || !image) return { changed: false, active: false };
    this.stamps = this.stamps.filter((stamp) => time - stamp.time < LIFETIME_MS);
    const active = this.stamps.length > 0;
    if (!active && !this.wasActive) return { changed: false, active: false };

    this.strength.fill(0);
    this.flowX.fill(0);
    this.flowY.fill(0);
    this.weights.fill(0);
    const columns = this.canvas.width;
    const rows = this.canvas.height;
    const cellWidth = this.width / columns;
    const cellHeight = this.height / rows;

    // Only each stamp's small footprint is evaluated, never display pixels.
    for (const stamp of this.stamps) {
      const age = Math.max(0, time - stamp.time);
      const life = Math.max(0, 1 - age / LIFETIME_MS);
      const radius = RADIUS_PX * (0.45 + 0.55 * life);
      const x = stamp.x + stamp.flowX * age / 1000 * DRIFT_PX_PER_SECOND;
      const y = stamp.y + stamp.flowY * age / 1000 * DRIFT_PX_PER_SECOND;
      const firstColumn = Math.max(0, Math.floor((x - radius) / cellWidth));
      const lastColumn = Math.min(columns - 1, Math.ceil((x + radius) / cellWidth));
      const firstRow = Math.max(0, Math.floor((y - radius) / cellHeight));
      const lastRow = Math.min(rows - 1, Math.ceil((y + radius) / cellHeight));
      for (let row = firstRow; row <= lastRow; row++) {
        for (let column = firstColumn; column <= lastColumn; column++) {
          const distance = Math.hypot((column + 0.5) * cellWidth - x, (row + 0.5) * cellHeight - y) / radius;
          if (distance >= 1) continue;
          const edge = Math.min(1, Math.max(0, (distance - 0.35) / 0.65));
          const reach = (1 - edge * edge * (3 - 2 * edge)) * life;
          const cell = row * columns + column;
          this.strength[cell] = 1 - (1 - this.strength[cell]) * (1 - reach);
          this.flowX[cell] += stamp.flowX * reach;
          this.flowY[cell] += stamp.flowY * reach;
          this.weights[cell] += reach;
        }
      }
    }

    for (let cell = 0; cell < this.strength.length; cell++) {
      const offset = cell * 4;
      const weight = this.weights[cell];
      image.data[offset] = Math.round(this.strength[cell] * 255);
      image.data[offset + 1] = Math.round((0.5 + (weight ? this.flowX[cell] / weight : 0) * 0.5) * 255);
      // The field is uploaded upside-down to match the video's GL coordinates.
      image.data[offset + 2] = Math.round((0.5 - (weight ? this.flowY[cell] / weight : 0) * 0.5) * 255);
      image.data[offset + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    this.wasActive = active;
    return { changed: true, active };
  }
}
