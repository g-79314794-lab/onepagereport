import mongoose from 'mongoose';
const ReportSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
