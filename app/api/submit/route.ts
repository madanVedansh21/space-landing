import { NextResponse } from "next/server";
import CorrelatedData from "@/lib/models/correlated.models";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // Collect all File objects from the form
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }
    if (files.length < 2) {
      return NextResponse.json({ error: "At least 2 files required" }, { status: 400 });
    }

    // Prepare multipart/form-data for Python service
    const pythonForm = new FormData();
    files.forEach((file, idx) => {
      pythonForm.append(`file${idx}`, file);
    });

    const pythonRes = await fetch("http://localhost:5000/correlate", {
      method: "POST",
      body: pythonForm,
      // Do NOT set Content-Type header; fetch will set it for FormData
    });

    if (!pythonRes.ok) {
      return NextResponse.json({ error: "Python service error" }, { status: 500 });
    }

    const correlatedData = await pythonRes.json();

    await connectToDatabase();
    const saved = await CorrelatedData.create({ input: {}, result: correlatedData });

    return NextResponse.json({ success: true, data: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Submit API error:', err); // <--- Add this line
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
