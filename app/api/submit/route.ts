import { NextResponse } from "next/server";
import CorrelatedData from "@/lib/models/correlated.models";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the file as a buffer
    const arrayBuffer = await file.arrayBuffer();
    const csvBuffer = Buffer.from(arrayBuffer);

    // Send the CSV file to the Python service
    const pythonRes = await fetch("http://localhost:5000/correlate", {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: csvBuffer,
    });

    if (!pythonRes.ok) {
      return NextResponse.json({ error: "Python service error" }, { status: 500 });
    }

    const correlatedData = await pythonRes.json();

    // Store in DB (example, adjust as per your schema)
    await connectToDatabase();
    const saved = await CorrelatedData.create({ input: {}, result: correlatedData });

    return NextResponse.json({ success: true, data: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
