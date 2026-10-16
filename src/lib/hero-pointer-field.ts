type Stamp = { x: number; y: number; time: number };

const LIFETIME_MS = 1100;
const RADIUS_PX = 16;
const SPACING_PX = 8;
const MAX_STAMPS = 48;

/** A bounded, cell-resolution glow field; never a per-screen-pixel stamp loop. */
export class HeroPointerField {
  readonly canvas = document.createElement("canvas");
  private readonly context = this.canvas.getContext("2d", { alpha: false });
  private stamps: Stamp[] = [];
  private last: Stamp | null = null;
  private wasActive = false;
  private width = 1;
  private height = 1;

  resize(width: number, height: number, columns: number, rows: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = columns;
    this.canvas.height = rows;
    this.wasActive = true;
  }

  add(x: number, y: number, time: number) {
    const next = { x, y, time };
    const previous = this.last;
    const distance = previous ? Math.hypot(x - previous.x, y - previous.y) : 0;
    if (previous && distance < SPACING_PX && time - previous.time < 60) return;

    const steps = previous ? Math.min(12, Math.max(1, Math.ceil(distance / SPACING_PX))) : 1;
    for (let step = 1; step <= steps; step++) {
      const mix = step / steps;
      this.stamps.push(previous ? {
        x: previous.x + (x - previous.x) * mix,
        y: previous.y + (y - previous.y) * mix,
        time: previous.time + (time - previous.time) * mix,
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
    if (!context) return { changed: false, active: false };
    this.stamps = this.stamps.filter((stamp) => time - stamp.time < LIFETIME_MS);
    const active = this.stamps.length > 0;
    if (!active && !this.wasActive) return { changed: false, active: false };

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#000";
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    context.setTransform(this.canvas.width / this.width, 0, 0, this.canvas.height / this.height, 0, 0);
    // Screen compositing is a soft union: 1 - (1-a)(1-b), never an additive flash.
    context.globalCompositeOperation = "screen";
    for (const stamp of this.stamps) {
      const life = Math.max(0, 1 - (time - stamp.time) / LIFETIME_MS);
      const radius = RADIUS_PX * (0.35 + 0.65 * life);
      const gradient = context.createRadialGradient(stamp.x, stamp.y, 0, stamp.x, stamp.y, radius);
      gradient.addColorStop(0, `rgba(255,255,255,${life})`);
      gradient.addColorStop(0.35, `rgba(255,255,255,${life})`);
      // Approximate smoothstep falloff with intermediate stops in the small field.
      gradient.addColorStop(0.675, `rgba(255,255,255,${life * 0.5})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(stamp.x - radius, stamp.y - radius, radius * 2, radius * 2);
    }
    this.wasActive = active;
    return { changed: true, active };
  }
}
