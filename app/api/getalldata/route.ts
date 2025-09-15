
import { NextResponse } from "next/server";
import AllRawDataModel from "@/lib/models/allData.models";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
	try {
		await connectToDatabase();
		const data = await AllRawDataModel.find({});
		return NextResponse.json({ success: true, data });
	} catch (error) {
		return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
	}
}