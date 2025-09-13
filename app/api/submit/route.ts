import { NextResponse } from "next/server";
import CorrelatedData from "@/lib/models/correlated.models";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Send data to Python service
    const pythonRes = await fetch("http://localhost:5000/correlate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!pythonRes.ok) {
      return NextResponse.json({ error: "Python service error" }, { status: 500 });
    }

    const correlatedData = await pythonRes.json();

    // Store in DB (example, adjust as per your schema)
    await connectToDatabase();
    const saved = await CorrelatedData.create({ input: body, result: correlatedData });

    return NextResponse.json({ success: true, data: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
