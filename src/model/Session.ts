import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  papers: mongoose.Types.ObjectId[]; // Array of Paper IDs
  conferenceTitle: string; // Associated Conference Title
}

const SessionSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  papers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paper' }],
  conferenceTitle: { type: String, required: true },
});

const SessionModel = (mongoose.models.Session as mongoose.Model<ISession>) || mongoose.model<ISession>('Session', SessionSchema);

export default SessionModel;