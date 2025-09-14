import {connectToDatabase} from "@/lib/db";
import { NextResponse } from "next/server";
import CorrelatedData from "@/lib/models/correlated.models";

// GET /api/correlated
export async function GET() {
	try {
		// Log whether the environment variable is present (do NOT log the value)
		console.log('MONGODB_URI present?', Boolean(process.env.MONGODB_URI));
		await connectToDatabase();
		const data = await CorrelatedData.find({});
		return NextResponse.json({ success: true, data });
	} catch (error) {
		return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
	}
}
