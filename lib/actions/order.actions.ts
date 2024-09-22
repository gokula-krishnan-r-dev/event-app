"use server";
import nodemailer from "nodemailer";
import Stripe from "stripe";
var QRCode = require("qrcode");
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import Event from "../database/models/event.model";
import { ObjectId } from "mongodb";
import User from "../database/models/user.model";
import { getEventById } from "./event.actions";
import { getUserById } from "./user.actions";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order: any) => {
  try {
    await connectToDatabase();
    const qrCodeURL = `https://booking-backend-omega.vercel.app/order/${order.eventId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeURL);
    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
      qrCodeImage: qrCodeImage,
    });
    sendOrderConfirmationEmail(newOrder, order.eventId);
    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "gokulakrishnanr812@gmail.com",
    pass: "aecm enny mitt ebgy",
  },
});
const sendOrderConfirmationEmail = async (order: any, eventId: any) => {
  console.log(order, "order");

  try {
    // const qrCodeURL = `https://booking-backend-omega.vercel.app/order/${eventId}`;
    // const qrCodeImage = await QRCode.toDataURL(qrCodeURL);
    const qrCodeURL = `https://booking-backend-omega.vercel.app/order/${eventId}`;
    const foundUser: any = await User.findById(order.buyer);
    const foundEvent: any = await Event.findById(eventId);
    // Define the email content
    const mailOptions = {
      from: "gokulakrishnanr812@gmail.com",
      to: foundUser.email,
      subject: `Registration Successful | ${foundEvent?.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p style="font-size: 16px;">Dear ${order?.buyerName},</p>
          <p style="font-size: 16px;">Thank you for your order! Your order ID is ${order?.ticket_Id}.</p>
          <p style="font-size: 16px;">Please find your event details below:</p>
          <p style="font-size: 16px;">Event Title: ${foundEvent?.title}</p>
          <p style="font-size: 16px;">Date: </p>
          <p style="font-size: 16px;">Location: ${foundEvent?.location}</p>
          <p style="font-size: 16px;">Make sure to attend the event on time!</p>
          <p style="font-size: 16px;">Event Link: <a href="${qrCodeURL}" style="color: #007bff;">${qrCodeURL}</a></p>
          <img src="${order?.qrCodeImage}" alt="Event QR Code" style="height: 110px; max-width: 100%; width: 110px; margin-top: 10px;">
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    handleError(error);
  }
};

export const findOrderByParams = async (params: any) => {
  try {
    await connectToDatabase();

    const foundOrder = await Order.findById(params);

    if (!foundOrder) {
      // Handle the case where no order is found based on the specified criteria
      return null;
    }

    const event: any = foundOrder.event;
    const buyer: any = foundOrder.buyer;

    const Findevent = await getEventById(event);
    const buyerInfo = await getUserById(buyer);

    // Create a new object containing the order details, event details, and buyer details
    const result = {
      order: JSON.parse(JSON.stringify(foundOrder)),
      event: Findevent,
      buyer: buyerInfo,
    };

    return result;
  } catch (error) {
    handleError(error);
  }
};
// GET ORDERS BY EVENT
export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    await connectToDatabase();

    if (!eventId) throw new Error("Event ID is required");
    const eventObjectId = new ObjectId(eventId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: "$buyer",
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: "$event.title",
          eventId: "$event?._id",
          buyer: {
            $concat: ["$buyer.firstName", " ", "$buyer.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: userId };

    const orders = await Order.distinct("event?._id")
      .find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    const ordersCount = await Order.distinct("event?._id").countDocuments(
      conditions
    );

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
