import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary is not configured in env" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploaded = await uploadImageToCloudinary(buffer);
  return NextResponse.json({ imageUrl: uploaded.secure_url });
}
