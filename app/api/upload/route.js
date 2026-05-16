import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { checkRateLimit } from "@/lib/utils/rate-limit";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Rate Limiting: Max 5 uploads per minute per user
    const isAllowed = checkRateLimit(`upload_${session.user.id}`, 5, 60000);
    if (!isAllowed) {
      return NextResponse.json({ message: "Too many upload requests. Try again in a minute." }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    // Convert file to base64 for ImgBB
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Upload to ImgBB
    const imgbbForm = new URLSearchParams();
    imgbbForm.append("key", process.env.IMGBB_API_KEY);
    imgbbForm.append("image", base64);

    const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbForm,
    });

    const imgbbData = await imgbbRes.json();

    if (!imgbbData.success) {
      return NextResponse.json(
        { message: "ImgBB upload failed", error: imgbbData },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: imgbbData.data.display_url,
      thumb: imgbbData.data.thumb?.url || imgbbData.data.display_url,
      delete_url: imgbbData.data.delete_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
