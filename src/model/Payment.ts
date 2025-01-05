import mongoose, { Document, Schema, Model } from 'mongoose';
import { IConference } from './Conference'; // Import the Conference interface
import { User } from './User'; // Import the User interface

// Define the interface for the Payment document
export interface IPayment extends Document {
    conferenceId: mongoose.Types.ObjectId | IConference; // Reference to the Conference model
    userId: mongoose.Types.ObjectId | User; // Reference to the User model
    amount: number; // Payment amount
    //currency: string;
    paymentType: 'upfront' | 'invoice'; // Payment type
    status: 'pending' | 'paid' | 'failed'; // Payment status
    stripePaymentId: string; // Stripe payment ID
    invoiceUrl?: string; // Link to download the invoice
    createdAt: Date; // Payment creation timestamp
    updatedAt: Date; // Payment update timestamp
}

// Define the schema
const PaymentSchema: Schema<IPayment> = new Schema(
    {
        conferenceId: {
            type: Schema.Types.ObjectId,
            ref: 'Conference', // Reference to the Conference model
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        // currency: {
        //     type: String,
        //     required: true,
        //     enum: ['usd','eur','gbp'],
        //     default: 'usd',
        // },
        paymentType: {
            type: String,
            enum: ['upfront', 'invoice'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        stripePaymentId: {
            type: String,
            required: true,
            unique: true,
        },
        invoiceUrl: {
            type: String,
            required: false, // Optional field
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Create the model
const PaymentModel = (mongoose.models.Payment as mongoose.Model<IPayment>) || mongoose.model<IPayment>('Payment', PaymentSchema);

export default PaymentModel;