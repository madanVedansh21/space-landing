import {Schema,model,models } from "mongoose";

const AllRawDataGw = new Schema({
    event_id: { type: String, required: true },
    source: { type: String, required: true },
    event_type: { type: String, required: true },
    utc_time: { type: Date, required: true },
    ra_deg: { type: Number, required: false },
    dec_deg: { type: Number, required: false },
    pos_error_deg: { type: Number, required: false },
    strength_signal: { type: Number, required: false }
});

const AllRawDataModelGw = models.AllRawDataGw || model("AllRawDataGw", AllRawDataGw);

export default AllRawDataModelGw;
