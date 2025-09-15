
import { NextResponse } from "next/server";
import AllRawDataModelGw from "@/lib/models/allDataGw.models";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
    try {
        await connectToDatabase();
        const data = await AllRawDataModelGw.find({});
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}