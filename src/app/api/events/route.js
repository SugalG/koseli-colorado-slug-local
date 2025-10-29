import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import slugify from "@/lib/slugify";

export const dynamic = "force-dynamic";

//  CREATE 
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const date = formData.get("date");
    const description = formData.get("description");
    const location = formData.get("location");
    const image = formData.get("image");

    if (!title || !date || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = slugify(title);
    let bannerUrl = null;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;
      const upload = await cloudinary.uploader.upload(base64Image, {
        folder: "koseli/events",
      });
      bannerUrl = upload.secure_url;
    }

    const created = await prisma.event.create({
      data: { title, slug, date: new Date(date), description, location, bannerUrl },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/events error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

//  READ 

// inside src/app/api/events/route.js

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured") === "true";
    const upcoming = searchParams.get("upcoming") === "true";
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "0", 10);

    const where = {};
    if (featured) where.isFeatured = true;
    if (upcoming) where.date = { gte: new Date() };

    // Fetch total count for hasMore logic
    const total = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: upcoming ? "asc" : "desc" },
      skip: skip > 0 ? skip : undefined,
      take: take > 0 ? take : undefined,
    });

    const hasMore = skip + take < total;

    return NextResponse.json({ events, hasMore });
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json(
      { events: [], hasMore: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}




//  UPDATE 
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing event ID" }, { status: 400 });

    const contentType = req.headers.get("content-type") || "";

    //  Toggle featured 
    if (contentType.includes("application/json")) {
      const { isFeatured } = await req.json();

      //  Allow multiple featured events
      const updated = await prisma.event.update({
        where: { id },
        data: { isFeatured },
      });

      return NextResponse.json(updated);
    }

    //  Full update (FormData)
    const formData = await req.formData();
    const title = formData.get("title");
    const date = formData.get("date");
    const description = formData.get("description");
    const location = formData.get("location");
    const image = formData.get("image");

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    let bannerUrl = existing.bannerUrl;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

      if (existing.bannerUrl) {
        const match = existing.bannerUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
        const publicId = match ? match[1] : null;
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      const upload = await cloudinary.uploader.upload(base64Image, {
        folder: "koseli/events",
      });
      bannerUrl = upload.secure_url;
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        slug: slugify(title),
        description,
        location,
        bannerUrl,
        date: new Date(date),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/events error:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

//  DELETE
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing event ID" }, { status: 400 });

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (existing.bannerUrl) {
      const match = existing.bannerUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
      const publicId = match ? match[1] : null;
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/events error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
