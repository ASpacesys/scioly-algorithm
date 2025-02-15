import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send file to FastAPI backend
    const fastApiResponse = await fetch("http://127.0.0.1:8000/upload/", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: buffer,
    });

    if (!fastApiResponse.ok) {
      return NextResponse.json({ error: "FastAPI request failed" }, { status: 500 });
    }

    // Get output file from FastAPI
    const outputFile = await fastApiResponse.blob();
    return new Response(outputFile, {
      headers: {
        "Content-Disposition": "attachment; filename=team_assignments.xlsx",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
