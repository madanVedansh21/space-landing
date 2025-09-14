import {Schema,model,models } from "mongoose";

const AllRawData = new Schema({
    rank: { type: Number, required: true },
    gw_event_id: { type: String, required: true },
    grb_event_id: { type: String, required: true },
    confidence_score: { type: Number, required: true },
    time_diff_sec: { type: Number, required: true },
    time_diff_hours: { type: Number, required: true },
    angular_sep_deg: { type: Number, required: true },
    within_error_circle: { type: Boolean, required: true },
    temporal_score: { type: Number, required: true },
    spatial_score: { type: Number, required: true },
    significance_score: { type: Number, required: true },
    gw_time: { type: Date, required: true },
    grb_time: { type: Date, required: true },
    gw_ra: { type: Number, required: true },
    gw_dec: { type: Number, required: true },
    grb_ra: { type: Number, required: true },
    grb_dec: { type: Number, required: true },
    gw_snr: { type: Number, required: true },
    grb_flux: { type: Number, required: true },
    gw_pos_error: { type: Number, required: true },
    grb_pos_error: { type: Number, required: true },
    combined_error_deg: { type: Number, required: true }
});

const AllRawDataModel = models.AllRawData || model("AllRawData", AllRawData);

export default AllRawDataModel;
