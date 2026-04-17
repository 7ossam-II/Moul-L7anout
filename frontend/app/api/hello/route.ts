import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("http://localhost:5000/"); // your backend URL
  const data = await res.text(); // or .json() if backend sends JSON
  return NextResponse.json({ message: data });
}