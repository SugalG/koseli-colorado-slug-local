import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

//  fetch all images or filter by album
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const albumId = searchParams.get("albumId");

    const where = albumId ? { albumId } : {};
    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        album: true, // optional: returns album name if exists
      },
    });

    return NextResponse.json(images);
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// upload image (with optional albumId)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const caption = formData.get("caption");
    const image = formData.get("image");
    const albumId = formData.get("albumId"); 

    if (!image) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const upload = await cloudinary.uploader.upload(base64Image, {
      folder: albumId ? `koseli/gallery/${albumId}` : "koseli/gallery",
    });

    const created = await prisma.galleryImage.create({
      data: {
        caption,
        imageUrl: upload.secure_url,
        albumId: albumId || null, 
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

//  DELETE 
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    // Extract Cloudinary public ID
    const match = image.imageUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    const publicId = match ? match[1] : null;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
