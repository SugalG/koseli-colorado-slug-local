import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    await prisma.subscriber.create({ data: { email } });

    return NextResponse.json(
      { message: "✅ Thanks for subscribing!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
