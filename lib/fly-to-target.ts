type FlyOptions = {
  color?: string;
  size?: number;
  durationMs?: number;
  kind?: "dot" | "heart" | "product";
  imageUrl?: string;
};

const DEFAULT_FLY_DURATION_MS = 950;

export function animateRemoveFromTarget(
  targetSelector: string,
  options: FlyOptions = {}
) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const target = document.querySelector<HTMLElement>(targetSelector);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const kind = options.kind ?? "dot";
  const size = options.size ?? 14;
  // Keep close to add-effect speed, just a little slower.
  const durationMs = options.durationMs ?? 1180;
  const color = options.color ?? "#F92D0A";

  const node = document.createElement("span");
  const rope = document.createElement("span");
  const nodeSize = kind === "product" ? Math.max(34, size * 2.2) : Math.max(14, size);
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  node.style.position = "fixed";
  node.style.left = `${startX - nodeSize / 2}px`;
  node.style.top = `${startY - nodeSize / 2}px`;
  node.style.width = `${nodeSize}px`;
  node.style.height = `${nodeSize}px`;
  node.style.zIndex = "80";
  node.style.pointerEvents = "none";
  node.style.display = "grid";
  node.style.placeItems = "center";
  node.style.willChange = "transform, opacity";

  if (kind === "heart") {
    node.textContent = "\u2665";
    node.style.color = "#ff3b63";
    node.style.fontSize = `${size + 10}px`;
    node.style.lineHeight = "1";
    node.style.textShadow = "0 0 14px rgba(255,76,120,0.6)";
  } else if (kind === "product") {
    node.style.borderRadius = "10px";
    node.style.background = "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(226,232,240,0.95))";
    node.style.border = "1px solid rgba(255,255,255,0.85)";
    node.style.boxShadow = "0 12px 24px -14px rgba(33,14,20,0.7)";
  } else {
    node.style.borderRadius = "9999px";
    node.style.background = color;
    node.style.boxShadow = "0 0 0 6px rgba(249,45,10,0.15)";
  }

  rope.style.position = "fixed";
  rope.style.left = `${startX}px`;
  rope.style.top = `${startY}px`;
  rope.style.width = "1px";
  rope.style.height = "2px";
  rope.style.transformOrigin = "0 50%";
  rope.style.pointerEvents = "none";
  rope.style.zIndex = "79";
  rope.style.borderRadius = "9999px";
  rope.style.background =
    "linear-gradient(90deg, rgba(255,255,255,0.55), rgba(251,133,0,0.85), rgba(249,45,10,0.25))";
  rope.style.filter = "drop-shadow(0 0 6px rgba(249,45,10,0.45))";

  document.body.appendChild(rope);
  document.body.appendChild(node);

  const start = performance.now();
  const spinSide = Math.random() > 0.5 ? 1 : -1;
  const spin = spinSide * (26 + Math.random() * 30);
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const endX = centerX + (Math.random() - 0.5) * 26;
  const endY = centerY - 6 + (Math.random() - 0.5) * 20;
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const perpX = -dy / distance;
  const perpY = dx / distance;
  const side = dx >= 0 ? 1 : -1;
  const travel = Math.max(300, Math.min(760, distance * 1.08));
  const arcHeight = Math.max(130, Math.min(260, travel * 0.42));
  const ctrl1X = startX + dx * 0.25 + side * travel * 0.16;
  const ctrl1Y = startY - arcHeight;
  const ctrl2X = startX + dx * 0.72 - side * travel * 0.11;
  const ctrl2Y = endY - arcHeight * 0.5;

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

  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const popBurst = (x: number, y: number) => {
    const burstCount = 24;
    for (let i = 0; i < burstCount; i += 1) {
      const p = document.createElement("span");
      const a = (Math.PI * 2 * i) / burstCount;
      const radial = 56 + Math.random() * 74;
      const particleDx = Math.cos(a) * radial;
      const particleDy = Math.sin(a) * radial;
      const s = 6 + Math.random() * 7;

      p.style.position = "fixed";
      p.style.left = `${x - s / 2}px`;
      p.style.top = `${y - s / 2}px`;
      p.style.width = `${s}px`;
      p.style.height = `${s}px`;
      p.style.borderRadius = "9999px";
      p.style.pointerEvents = "none";
      p.style.zIndex = "81";
      p.style.background =
        i % 3 === 0 ? "#FB8500" : i % 3 === 1 ? "#F92D0A" : "rgba(255,255,255,0.95)";
      p.style.boxShadow = "0 0 14px rgba(249,45,10,0.76), 0 0 22px rgba(251,133,0,0.44)";
      p.style.willChange = "transform, opacity";
      document.body.appendChild(p);

      const pStart = performance.now();
      const pDur = 460 + Math.random() * 260;
      const pTick = (now: number) => {
        const t = Math.min(1, (now - pStart) / pDur);
        const ease = 1 - Math.pow(1 - t, 3);
        p.style.transform = `translate3d(${particleDx * ease}px, ${particleDy * ease}px, 0) scale(${1.42 - t * 0.9})`;
        p.style.opacity = `${1 - t}`;
        if (t < 1) {
          window.requestAnimationFrame(pTick);
        } else {
          p.remove();
        }
      };
      window.requestAnimationFrame(pTick);
    }

    const shock = document.createElement("span");
    shock.style.position = "fixed";
    shock.style.left = `${x - 10}px`;
    shock.style.top = `${y - 10}px`;
    shock.style.width = "26px";
    shock.style.height = "26px";
    shock.style.borderRadius = "9999px";
    shock.style.border = "2px solid rgba(255,255,255,0.95)";
    shock.style.boxShadow = "0 0 0 5px rgba(251,133,0,0.5), 0 0 30px rgba(249,45,10,0.56)";
    shock.style.pointerEvents = "none";
    shock.style.zIndex = "81";
    shock.style.willChange = "transform, opacity";
    document.body.appendChild(shock);

    const shockStart = performance.now();
    const shockDur = 480;
    const shockTick = (now: number) => {
      const t = Math.min(1, (now - shockStart) / shockDur);
      const e = 1 - Math.pow(1 - t, 3);
      shock.style.transform = `scale(${1 + e * 6.6})`;
      shock.style.opacity = `${1 - t}`;
      if (t < 1) {
        window.requestAnimationFrame(shockTick);
      } else {
        shock.remove();
      }
    };
    window.requestAnimationFrame(shockTick);
  };

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    const ease = easeInOutCubic(t);
    const curveX = bezierPoint(startX, ctrl1X, ctrl2X, endX, ease);
    const curveY = bezierPoint(startY, ctrl1Y, ctrl2Y, endY, ease);
    const safeDistance = Math.max(1, distance);
    const travelPerpX = -dy / safeDistance;
    const travelPerpY = dx / safeDistance;
    const swirl = Math.sin(t * Math.PI * 2) * (kind === "heart" ? 52 : 34) * (1 - t * 0.16);
    const currentX = curveX + travelPerpX * swirl;
    const currentY = curveY + travelPerpY * swirl;
    const growAtEnd = Math.max(0, (t - 0.78) / 0.22) * (kind === "product" ? 2.5 : 2.05);
    const pulse = Math.sin(t * Math.PI) * 0.24;
    const scale = 0.96 - 0.18 * easeOutQuint(t) + pulse + growAtEnd;
    const opacity = 1 - easeOutQuint(t) * 0.96;
    const x = currentX - startX;
    const y = currentY - startY;

    const ropeDx = currentX - startX;
    const ropeDy = currentY - startY;
    const ropeLen = Math.max(2, Math.hypot(ropeDx, ropeDy));
    const ropeAngle = (Math.atan2(ropeDy, ropeDx) * 180) / Math.PI;

    node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${spin * ease}deg)`;
    node.style.opacity = `${Math.max(0, opacity)}`;
    rope.style.width = `${ropeLen}px`;
    rope.style.transform = `rotate(${ropeAngle}deg)`;
    rope.style.opacity = `${Math.max(0, 0.88 - ease * 0.92)}`;

    if (t < 1) {
      window.requestAnimationFrame(tick);
    } else {
      popBurst(currentX, currentY);
      document.body.animate(
        [
          { filter: "brightness(1)" },
          { filter: "brightness(1.06)" },
          { filter: "brightness(1)" }
        ],
        { duration: 220, easing: "ease-out" }
      );
      node.remove();
      rope.remove();
    }
  };

  window.requestAnimationFrame(tick);
}

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
  const durationMs = options.durationMs ?? DEFAULT_FLY_DURATION_MS;
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
