import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Accept at least two CSV files (count all File entries)
    const filesToSend: File[] = [];
    for (const [, value] of formData.entries()) {
      if (value instanceof File) {
        filesToSend.push(value);
      }
    }
    if (filesToSend.length < 2) {
      return NextResponse.json({ error: "At least two CSV files are required" }, { status: 400 });
    }

    // Prepare FormData to send to external Python server as a list under 'files'
    const outForm = new FormData();
    filesToSend.forEach(file => {
      outForm.append('files', file, file.name);
    });

  // Send to external Python server (updated URL)
  const pythonRes = await fetch("https://kd-tree-ctrl-hack-production.up.railway.app/correlate", {
      method: "POST",
      body: outForm,
    });

    if (!pythonRes.ok) {
      return NextResponse.json({ error: "Python service error" }, { status: 500 });
    }

    // Expecting a multipart response: CSV file and JSON data
    // Try to parse as multipart/mixed
    const contentType = pythonRes.headers.get("content-type") || "";
    if (contentType.startsWith("multipart/")) {
      // Parse multipart response
      const boundary = contentType.split("boundary=")[1];
      const buffer = Buffer.from(await pythonRes.arrayBuffer());
      // Use a simple parser for multipart (or use a library if available)
      // For now, just return the raw buffer and content-type
      return new Response(buffer, {
        status: 200,
        headers: {
          "content-type": contentType,
        },
      });
    } else if (contentType.includes("application/json")) {
      // Only JSON returned
      const json = await pythonRes.json();
      return NextResponse.json(json);
    } else if (contentType.includes("text/csv")) {
      // Only CSV returned
      const csv = await pythonRes.text();
      return new Response(csv, {
        status: 200,
        headers: {
          "content-type": "text/csv",
        },
      });
    } else {
      // Unknown response
      const data = await pythonRes.text();
      return new Response(data, { status: 200 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
