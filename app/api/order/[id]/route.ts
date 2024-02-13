import { findOrderByParams } from "@/lib/actions/order.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const foundOrder = await findOrderByParams(params.id);

    if (!foundOrder) {
      return NextResponse.json({ message: "Order not found", status: 404 });
    }

    return NextResponse.json({ message: "OK", order: foundOrder });
  } catch (error) {
    console.error("Error finding order:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
