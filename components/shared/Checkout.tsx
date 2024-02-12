"use client";
import React, { useCallback, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Script from "next/script";
import { Button } from "../ui/button";
import useRazorpay from "react-razorpay";
import { createOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({
  event,
  TotalNumber,
  userId,
}: {
  event: any;
  TotalNumber: any;
  userId: any;
}) => {
  const Razorpay = useRazorpay();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);
  const router = useRouter();

  const handlePayment = useCallback(() => {
    const options = {
      key: "rzp_test_9uzFaRoEwyoZoP",
      amount: TotalNumber * event?.price * 100,
      currency: "INR",
      name: "Infease Tickets",
      description: "Infease Tickets for event ",
      image: "/images/logo.png",
      handler: async (res: any) => {
        console.log(res);
        const order: any = {
          eventId: event?._id || "",
          buyerId: userId || "",
          totalAmount: event?.price ? (event?.price / 100).toString() : "0",
          ticket_number: "1",
          razorpay_id: res.razorpay_payment_id,
        };
        const newOrder = await createOrder(order);
        console.log(newOrder, "newOrder");
        router.push(`/order/${newOrder._id}`);
        // alert(res.razorpay_payment_id);
      },
      prefill: {
        name: "Abdur Rasheed",
        email: "abd205200@gmail.com",
        contact: "8973793648",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = (window as any).Razorpay.open(options);
    rzp1.on("payment.failed", function (response: any) {
      alert("Payment failed. Error code: " + response.error.code);
    });
  }, [Razorpay]);

  const onCheckout = async () => {
    const order: any = {
      eventTitle: event.title,
      eventId: event?._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };
    if (event.isFree) {
      const order: any = {
        eventId: event?._id || "",
        buyerId: userId || "",
        totalAmount: event?.price ? (event?.price / 100).toString() : "0",
        ticket_number: "1",
        razorpay_id: userId,
      };
      const newOrder = await createOrder(order);
      console.log(newOrder, "newOrder");
      if (newOrder) {
        router.push(`/order/${newOrder._id}`);
      } else {
        alert("Something went wrong");
      }
    } else {
      await handlePayment();
    }
  };

  return (
    <form action={onCheckout} method="post">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </form>
  );
};

export default Checkout;

const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
// const makePayment = async () => {
//   const res = await initializeRazorpay();

//   if (!res) {
//     alert("Razorpay SDK Failed to load");
//     return;
//   }

//   // Make API call to the serverless API
//   const data = await fetch("/api/razorpay", { method: "POST" }).then((t) =>
//     t.json()
//   );

//   var options = {
//     key: "rzp_test_RGjPwk7SFRRAIW", // Enter the Key ID generated from the Dashboard
//     name: "Manu Arora Pvt Ltd",
//     currency: data.currency,
//     amount: data.amount,
//     order_id: data.id,
//     description: "Thankyou for your test donation",
//     image: "https://manuarora.in/logo.png",
//     handler: function (response: any) {
//       // Validate payment at server - using webhooks is a better idea.
//       alert(response.razorpay_payment_id);
//       alert(response.razorpay_order_id);
//       alert(response.razorpay_signature);
//     },
//     prefill: {
//       name: "Manu Arora",
//       email: "manuarorawork@gmail.com",
//       contact: "9999999999",
//     },
//   };

//   const paymentObject = new window.Razorpay(options);
//   paymentObject.open();
// };
// const makePayment = async ({ productId }: any) => {
//   // Make API call to the serverless API
//   const data = await fetch("/api/razorpay", {
//     method: "POST",
//     headers: {},
//     body: JSON.stringify({ productId }),
//   }).then((t) => t.json());
//   const options = {
//     name: data.name,
//     currency: data.currency,
//     amount: data.amount,
//     order_id: data.id,
//     description: data.amountDesc,
//     // image: logoBase64,
//     handler: function (response: any) {
//       // Validate payment at server - using webhooks is a better idea.
//       // alert(response.razorpay_payment_id);
//       // alert(response.razorpay_order_id);
//       // alert(response.razorpay_signature);
//     },
//     prefill: {
//       name: "John Doe",
//       email: "jdoe@example.com",
//       contact: "9876543210",
//     },
//   };

//   const paymentObject = new window.Razorpay(options);
//   paymentObject.open();

//   paymentObject.on("payment.failed", function (response: any) {
//     alert("Payment failed. Please try again. Contact support for help");
//   });
// };
