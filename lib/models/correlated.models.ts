import {Schema,model,models } from "mongoose";

const correlatedDataSchema = new Schema({
  rank: { type: Number, required: false },
  gw_event_id: { type: String, required: false },
  grb_event_id: { type: String, required: false },
  confidence_score: { type: Number, required: false },
  time_diff_sec: { type: Number, required: false },
  time_diff_hours: { type: Number, required: false },
  angular_sep_deg: { type: Number, required: false },
  within_error_circle: { type: Boolean, required: false },
  temporal_score: { type: Number, required: false },
  spatial_score: { type: Number, required: false },
  significance_score: { type: Number, required: false },
  gw_time: { type: Date, required: false },
  grb_time: { type: Date, required: false },
  gw_ra: { type: Number, required: false },
  gw_dec: { type: Number, required: false },
  grb_ra: { type: Number, required: false },
  grb_dec: { type: Number, required: false },
  gw_snr: { type: Number, required: false },
  grb_flux: { type: Number, required: false },
  gw_pos_error: { type: Number, required: false },
  grb_pos_error: { type: Number, required: false },
  combined_error_deg: { type: Number, required: false }
}, { strict: false });

const CorrelatedData = models.CorrelatedData || model("CorrelatedData", correlatedDataSchema);

export default CorrelatedData;
