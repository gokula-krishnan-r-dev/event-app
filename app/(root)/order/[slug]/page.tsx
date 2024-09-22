"use client";
import QRCode from "react-qr-code";
import { formatDateTime } from "@/lib/utils";
import React from "react";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  var loading = false;
  var order: any = [];
  const response = fetch(
    `https://booking-backend-omega.vercel.app/api/order/${params.slug}`,
    {
      next: { revalidate: 10 },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data, "data");
      order = data.order;
      return data;
    })
    .catch((error) => {
      console.error("Error fetching order:", error);
    });
  const response2 = await response;
  const handleDownloadPDF = async () => {
    const { downloadPDF } = await import("@/lib/utils");

    downloadPDF();
  };

  return (
    <main className="ticket-system  flex items-center justify-center ">
      <div id="actual-receipt" className="top">
        {/* <h1 className="title">Wait a second, your ticket is being printed</h1> */}
        <div className="printer"></div>
        <div className="receipts-wrapper">
          <div className="receipts">
            <div className="receipt">
              <Link href={`/events/${order?.event?._id}`}>
                <img
                  src={order?.event?.imageUrl}
                  alt=""
                  className="rounded-2xl"
                />
              </Link>

              <div className="flex flex-col">
                <Link href={`/events/${order?.event?._id}`}>
                  <h2 className="text-xl font-semibold mt-4">
                    {order?.event?.title}
                  </h2>
                </Link>
                <p className="text-base font-normal line-clamp-2 text-gray-600 mb-3">
                  {order?.event?.description}
                </p>
                <div className="flex gap-2 pb-3">
                  <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
                    {order?.event?.isFree ? "FREE" : `$${order?.event?.price}`}
                  </span>
                  <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
                    {order?.event?.category?.name}
                  </p>
                </div>
              </div>
              <div className="details">
                <div className="item">
                  <span>Ticket:</span>
                  <h3>{order?.buyer?.username}</h3>
                </div>
                <div className="item">
                  <span>Ticket No.</span>
                  <h3>{order?.order?.ticket_Id}</h3>
                </div>
                <div className="item">
                  <span>Starting Time : </span>
                  <p className="p-medium-16 p-medium-18 text-grey-500">
                    {formatDateTime(order?.event?.startDateTime).dateTime}
                  </p>
                </div>
                <div className="item">
                  <span>ending Time : </span>
                  <p className="p-medium-16 p-medium-18 text-grey-500">
                    {formatDateTime(order?.event?.endDateTime).dateTime}
                  </p>
                </div>

                <div className="item">
                  <span>organizer</span>
                  <p className="p-medium-14 md:p-medium-16 text-grey-600">
                    {order?.event?.organizer?.firstName}
                    {order?.event?.organizer?.lastName}
                  </p>
                </div>
                <div className="item">
                  <span>Number of Ticket : </span>
                  <p className="p-medium-16 p-medium-18 text-grey-500">
                    {order?.order?.ticket_number}
                  </p>
                </div>
                <div className="item">
                  <span>Location</span>
                  <h3>{order?.event?.location}</h3>
                </div>
              </div>
            </div>
            <div className="receipt padding-8 qr-code">
              <QRCode
                style={{ height: "110px", maxWidth: "100%", width: "110px" }}
                value={`https://booking-backend-omega.vercel.app/order/${order?.event?._id}`}
                viewBox={`0 0 256 256`}
              />
              {/* <svg
                className="qr"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 29.938 29.938"
              >
                <path d="M7.129 15.683h1.427v1.427h1.426v1.426H2.853V17.11h1.426v-2.853h2.853v1.426h-.003zm18.535 12.83h1.424v-1.426h-1.424v1.426zM8.555 15.683h1.426v-1.426H8.555v1.426zm19.957 12.83h1.427v-1.426h-1.427v1.426zm-17.104 1.425h2.85v-1.426h-2.85v1.426zm12.829 0v-1.426H22.81v1.426h1.427zm-5.702 0h1.426v-2.852h-1.426v2.852zM7.129 11.406v1.426h4.277v-1.426H7.129zm-1.424 1.425v-1.426H2.852v2.852h1.426v-1.426h1.427zm4.276-2.852H.002V.001h9.979v9.978zM8.555 1.427H1.426v7.127h7.129V1.427zm-5.703 25.66h4.276V22.81H2.852v4.277zm14.256-1.427v1.427h1.428V25.66h-1.428zM7.129 2.853H2.853v4.275h4.276V2.853zM29.938.001V9.98h-9.979V.001h9.979zm-1.426 1.426h-7.127v7.127h7.127V1.427zM0 19.957h9.98v9.979H0v-9.979zm1.427 8.556h7.129v-7.129H1.427v7.129zm0-17.107H0v7.129h1.427v-7.129zm18.532 7.127v1.424h1.426v-1.424h-1.426zm-4.277 5.703V22.81h-1.425v1.427h-2.85v2.853h2.85v1.426h1.425v-2.853h1.427v-1.426h-1.427v-.001zM11.408 5.704h2.85V4.276h-2.85v1.428zm11.403 11.405h2.854v1.426h1.425v-4.276h-1.425v-2.853h-1.428v4.277h-4.274v1.427h1.426v1.426h1.426V17.11h-.004zm1.426 4.275H22.81v-1.427h-1.426v2.853h-4.276v1.427h2.854v2.853h1.426v1.426h1.426v-2.853h5.701v-1.426h-4.276v-2.853h-.002zm0 0h1.428v-2.851h-1.428v2.851zm-11.405 0v-1.427h1.424v-1.424h1.425v-1.426h1.427v-2.853h4.276v-2.853h-1.426v1.426h-1.426V7.125h-1.426V4.272h1.426V0h-1.426v2.852H15.68V0h-4.276v2.852h1.426V1.426h1.424v2.85h1.426v4.277h1.426v1.426H15.68v2.852h-1.426V9.979H12.83V8.554h-1.426v2.852h1.426v1.426h-1.426v4.278h1.426v-2.853h1.424v2.853H12.83v1.426h-1.426v4.274h2.85v-1.426h-1.422zm15.68 1.426v-1.426h-2.85v1.426h2.85zM27.086 2.853h-4.275v4.275h4.275V2.853zM15.682 21.384h2.854v-1.427h-1.428v-1.424h-1.427v2.851zm2.853-2.851v-1.426h-1.428v1.426h1.428zm8.551-5.702h2.853v-1.426h-2.853v1.426zm1.426 11.405h1.427V22.81h-1.427v1.426zm0-8.553h1.427v-1.426h-1.427v1.426zm-12.83-7.129h-1.425V9.98h1.425V8.554z" />
              </svg> */}
              <div className="description">
                <h2> {order?.event?.title}</h2>
                <p className="p-medium-16 p-medium-18 text-grey-500">
                  {formatDateTime(order?.event?.startDateTime).dateTime}
                </p>
                <div className="item">
                  <h3>{order?.order?.ticket_Id}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="p-6 py-3 bg-white rounded-2xl mt-8 shadow-md text-lg font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out"
        onClick={handleDownloadPDF}
      >
        Download
      </button>
    </main>
  );
}
