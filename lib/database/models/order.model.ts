import mongoose from "mongoose";
import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  createdAt: Date;
  razorpay_id: string;
  totalAmount: string;
  isUser?: boolean;
  ticket_number?: string;
  event: string;
  buyer: string;
  ticket_Id: string;
  qrCodeImage: string;
}

export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
};

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  razorpay_id: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: String,
  },
  event: {
    type: String,
  },
  buyer: {
    type: String,
  },
  isUser: {
    type: Boolean,
    default: true,
  },
  ticket_Id: {
    type: String,
    default: () => generateTicketNumber(),
  },
  ticket_number: {
    type: String,
  },
  qrCodeImage: {
    type: String,
  },
});
// Pre-hook to generate and set ticket number
OrderSchema.pre<IOrder>("save", function (next) {
  if (!this.ticket_Id) {
    this.ticket_Id = generateTicketNumber();
  }
  next();
});

function generateTicketNumber(): string {
  // Logic to generate the ticket number
  const randomPart = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `TN${datePart}DLAP${randomPart}`;
}

// const Order = models.Order || model("order", OrderSchema);
const Order =
  (models.Order as mongoose.Model<IOrder>) ||
  model<IOrder>("Order", OrderSchema);

export default Order;
