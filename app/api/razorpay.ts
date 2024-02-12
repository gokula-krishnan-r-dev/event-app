import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: "Hello from Next.js!" });
}

// import { NextResponse } from "next/server";

// const Razorpay = require("razorpay");
// const shortid = require("shortid");

// export async function POST(req: Request) {
//   if (req.method === "POST") {
//     // Initialize razorpay object
//     const razorpay = new Razorpay({
//       key_id: "rzp_test_RGjPwk7SFRRAIW",
//       key_secret: "UuCWTM3Hx3Wov6y07jlf1woS",
//     });

//     const payment_capture = 1;
//     const amount = 1 * 100; // amount in paisa. In our case it's INR 1
//     const currency = "INR";
//     const options = {
//       amount: amount.toString(),
//       currency,
//       receipt: shortid.generate(),
//       payment_capture,
//       notes: {
//         // These notes will be added to your transaction. So you can search it within their dashboard.
//         // Also, it's included in webhooks as well. So you can automate it.
//         paymentFor: "example_ebook",
//         userId: "user_id_here",
//         productId: "your_product_id",
//       },
//     };

//     try {
//       // const response = await razorpay.orders.create(options);
//       NextResponse.json({
//         demo: "demo",
//       });
//     } catch (err) {
//       console.log(err);
//       NextResponse.json({ message: "Error", error: err });
//     }
//   } else {
//     NextResponse.json({ message: "Method not allowed" });
//   }
// }
