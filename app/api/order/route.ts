import { createOrder, findOrderByParams } from "@/lib/actions/order.actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Extract data from the request and prepare the order object
    const order = {
      stripeId: data.razorpay_id,
      eventId: data.eventId || "",
      buyerId: data.userId || "",
      totalAmount: data.amount_total
        ? (data.amount_total / 100).toString()
        : "0",
      createdAt: new Date(),
      ticket_number: data.ticket_number,
      razorpay_id: data.razorpay_id,
    };

    // Save the order to the database
    const newOrder = await createOrder(order);

    // Return success response
    return NextResponse.json({ message: "OK", order: newOrder });
  } catch (error) {
    // Handle errors
    console.error("Error processing order:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}

