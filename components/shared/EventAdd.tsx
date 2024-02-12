"use client";
import React, { useEffect, useState } from "react";

const EventAdd = ({ event, TotalNumber }: any) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const totalPrice = event.isFree ? "FREE" : `₹${event?.price * quantity}`;

  return (
    <section>
      <p>Quantity: {quantity}</p>
      <p>Total Price : {totalPrice}</p>
      <div className="mb-4 mr-4 lg:mb-0">
        <div className="w-28">
          <div className="relative flex flex-row w-full h-10 bg-transparent rounded-lg">
            <button
              onClick={decreaseQuantity}
              className="w-20 h-full text-gray-600 bg-gray-100 border-r rounded-l outline-none cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-300"
            >
              <span className="m-auto text-2xl font-thin">-</span>
            </button>
            <input
              value={quantity}
              type="number"
              className="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-100 outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black"
            />
            <button
              onClick={increaseQuantity}
              className="w-20 h-full text-gray-600 bg-gray-100 border-l rounded-r outline-none cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-300"
            >
              <span className="m-auto text-2xl font-thin">+</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventAdd;
