type FlyOptions = {
  color?: string;
  size?: number;
  durationMs?: number;
  kind?: "dot" | "heart" | "product";
  imageUrl?: string;
};

export function animateFlyToTarget(
  source: HTMLElement,
  targetSelector: string,
  options: FlyOptions = {}
) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const target = document.querySelector<HTMLElement>(targetSelector);
  if (!target) return;

  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const size = options.size ?? 14;
  const kind = options.kind ?? "dot";
  const durationMs =
    options.durationMs ??
    (kind === "heart" ? 6000 : kind === "product" ? 1450 : 900);
  const color = options.color ?? "#F92D0A";

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  const flyNode = document.createElement("span");
  const productSize = Math.max(42, size * 3);
  const nodeSize = kind === "product" ? productSize : size;
  flyNode.style.position = "fixed";
  flyNode.style.left = `${startX - nodeSize / 2}px`;
  flyNode.style.top = `${startY - nodeSize / 2}px`;
  flyNode.style.width = `${nodeSize}px`;
  flyNode.style.height = `${nodeSize}px`;
  flyNode.style.zIndex = "80";
  flyNode.style.pointerEvents = "none";
  flyNode.style.display = "grid";
  flyNode.style.placeItems = "center";
  flyNode.style.willChange = "transform, opacity";

  if (kind === "heart") {
    flyNode.textContent = "\u2665";
    flyNode.style.color = "#ff3b63";
    flyNode.style.fontSize = `${size + 12}px`;
    flyNode.style.lineHeight = "1";
    flyNode.style.filter = "saturate(1.2)";
    flyNode.style.textShadow = [
      "0 0 8px rgba(255,68,108,0.95)",
      "0 0 16px rgba(255,76,120,0.78)",
      "0 0 30px rgba(255,64,110,0.5)",
      "0 8px 18px rgba(255,58,98,0.32)"
    ].join(", ");
  } else if (kind === "product") {
    flyNode.style.borderRadius = "14px";
    flyNode.style.padding = "3px";
    flyNode.style.background =
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(225,232,241,0.96))";
    flyNode.style.border = "1px solid rgba(255,255,255,0.9)";
    flyNode.style.boxShadow =
      "0 20px 34px -16px rgba(33,14,20,0.72), 0 0 0 5px rgba(251,133,0,0.18)";

    const img = document.createElement("img");
    img.src = options.imageUrl || "";
    img.alt = "";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "11px";
    img.style.background = "rgba(255,255,255,0.65)";
    flyNode.appendChild(img);
  } else {
    flyNode.style.borderRadius = "9999px";
    flyNode.style.background = color;
    flyNode.style.boxShadow = "0 0 0 6px rgba(249,45,10,0.15)";
  }

  document.body.appendChild(flyNode);

  const start = performance.now();
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.hypot(dx, dy);
  const travel = Math.max(320, Math.min(760, distance * 1.15));
  const side = dx >= 0 ? 1 : -1;
  const arcHeight = Math.max(140, Math.min(280, travel * 0.46));
  const ctrl1X = startX + dx * 0.25 + side * travel * 0.18;
  const ctrl1Y = startY - arcHeight;
  const ctrl2X = startX + dx * 0.72 - side * travel * 0.12;
  const ctrl2Y = endY - arcHeight * 0.48;

  const bezierPoint = (
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    t: number
  ) => {
    const u = 1 - t;
    return (
      u * u * u * p0 +
      3 * u * u * t * p1 +
      3 * u * t * t * p2 +
      t * t * t * p3
    );
  };

  const easeInOut = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    const ease = easeInOut(t);
    let x = bezierPoint(startX, ctrl1X, ctrl2X, endX, ease);
    let y = bezierPoint(startY, ctrl1Y, ctrl2Y, endY, ease);

    const safeDistance = Math.max(1, distance);
    const perpX = -dy / safeDistance;
    const perpY = dx / safeDistance;
    const doubleCurve =
      Math.sin(t * Math.PI * 2) *
      (kind === "heart" ? 64 : kind === "product" ? 36 : 24) *
      (1 - t * 0.18);
    x += perpX * doubleCurve;
    y += perpY * doubleCurve;

    const grow = Math.sin(Math.min(1, t * 1.08) * Math.PI);
    const midBoost = kind === "heart" ? 2.6 : kind === "product" ? 1.6 : 1.4;
    const endBoost =
      kind === "heart"
        ? Math.max(0, (t - 0.82) / 0.18) * 1.35
        : kind === "product"
          ? Math.max(0, (t - 0.85) / 0.15) * 0.3
          : 0;
    const baseScale = kind === "product" ? 0.6 : 0.5;
    const shrink = kind === "product" ? 0.78 : 0.95;
    const scale = Math.max(
      0.26,
      baseScale + midBoost * grow - shrink * easeOut(t) + endBoost
    );
    const opacity =
      kind === "heart"
        ? Math.max(0.35, 1 - t * 0.55)
        : kind === "product"
          ? Math.max(0.3, 1 - t * 0.72)
          : 1 - t * 0.9;
    const rotate = side * Math.sin(t * Math.PI * 1.25) * (kind === "product" ? 12 : 18);

    flyNode.style.transform = `translate3d(${x - startX}px, ${y - startY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
    flyNode.style.opacity = `${opacity}`;

    if (t < 1) {
      window.requestAnimationFrame(tick);
    } else {
      flyNode.remove();
      target.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.28)" },
          { transform: "scale(0.93)" },
          { transform: "scale(1)" }
        ],
        { duration: 360, easing: "ease-out" }
      );
    }
  };

  window.requestAnimationFrame(tick);
}