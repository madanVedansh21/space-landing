import { NextResponse } from "next/server";
import CorrelatedData from "@/lib/models/correlated.models";
import { connectToDatabase } from "@/lib/db";
import Papa from "papaparse";

export async function POST(request: Request) {
	try {
		await connectToDatabase();
		const formData = await request.formData();
		const file = formData.get("file") as File;
		if (!file) {
			return NextResponse.json({ error: "No CSV file uploaded (use 'file' field)" }, { status: 400 });
		}
		const arrayBuffer = await file.arrayBuffer();
		const csvText = Buffer.from(arrayBuffer).toString("utf-8");
		// Parse CSV to JSON
		const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
		if (!parsed.data || !Array.isArray(parsed.data) || parsed.data.length === 0) {
			return NextResponse.json({ error: "CSV parsing failed or no data found" }, { status: 400 });
		}
			// Pre-process: convert string booleans and numbers
			const processed = parsed.data.map((row: Record<string, unknown>) => {
				const out = { ...row };
				// Boolean conversion
				if (typeof out.within_error_circle === "string") {
					out.within_error_circle = out.within_error_circle.toLowerCase() === "true";
				}
				// Number conversion for known fields
				[
					"rank", "confidence_score", "time_diff_sec", "time_diff_hours", "angular_sep_deg",
					"temporal_score", "spatial_score", "significance_score", "gw_ra", "gw_dec", "grb_ra",
					"grb_dec", "gw_snr", "grb_flux", "gw_pos_error", "grb_pos_error", "combined_error_deg"
				].forEach((key) => {
					if (typeof out[key] === "string" && out[key] !== "") {
						const num = Number(out[key]);
						if (!isNaN(num)) out[key] = num;
					}
				});
				return out;
			});
			// Store in MongoDB
			const saved = await CorrelatedData.insertMany(processed);
			return NextResponse.json({ success: true, count: saved.length, data: saved });
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
