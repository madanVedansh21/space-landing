import { NextResponse } from "next/server";
import CorrelatedData from "@/lib/models/correlated.models";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Collect all CSV files
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('csv_') && value instanceof File) {
        files.push(value);
      }
    }
    
    // Also check for single file upload (backward compatibility)
    const singleFile = formData.get("file") as File;
    if (singleFile && files.length === 0) {
      files.push(singleFile);
    }
    
    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // For now, let's send the first file to maintain compatibility
    // TODO: Update Python service to handle multiple files
    const firstFile = files[0];
    
    // Read the file as a buffer
    const arrayBuffer = await firstFile.arrayBuffer();
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
    const saved = await CorrelatedData.create({ 
      input: { fileCount: files.length, fileNames: files.map(f => f.name) }, 
      result: correlatedData 
    });

    return NextResponse.json({ 
      success: true, 
      data: saved,
      message: `Processed ${files.length} file(s). Currently using first file for correlation.`
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
