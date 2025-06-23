import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // Simulate saving to a database 
  console.log("Page data to save:", body);

  return NextResponse.json({ message: "Page saved successfully!" });
}
