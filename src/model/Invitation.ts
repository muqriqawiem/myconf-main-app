import mongoose, { Schema, Document } from "mongoose";

export interface IInvitation extends Document {
    conferenceId: mongoose.Types.ObjectId;
    recipientEmail: string;
    senderId: mongoose.Types.ObjectId;
    message: string;
    status: "Sent" | "Accepted" | "Declined";
    createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>({
    conferenceId: { type: Schema.Types.ObjectId, ref: "Conference", required: true },
    recipientEmail: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    status: { type: String, enum: ["Sent", "Accepted", "Declined"], default: "Sent" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invitation ||
    mongoose.model<IInvitation>("Invitation", InvitationSchema);
