import { NextResponse } from "next/server";
import { getImageSpec } from "@/lib/image-data";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const spec = getImageSpec(id);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${spec.c1}'/><stop offset='100%' stop-color='${spec.c2}'/></linearGradient></defs>
<rect width='1200' height='800' fill='url(#g)'/>
<circle cx='980' cy='120' r='180' fill='rgba(255,255,255,0.12)'/>
<circle cx='170' cy='690' r='230' fill='rgba(255,255,255,0.09)'/>
<rect x='60' y='480' width='640' height='180' rx='20' fill='rgba(0,0,0,0.20)'/>
<text x='92' y='565' fill='white' font-size='58' font-family='Arial' font-weight='700'>${spec.title}</text>
<text x='92' y='620' fill='rgba(255,255,255,0.88)' font-size='30' font-family='Arial'>${spec.subtitle}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}

