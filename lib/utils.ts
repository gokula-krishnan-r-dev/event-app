import { type ClassValue, clsx } from "clsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { twMerge } from "tailwind-merge";
import qs from "query-string";

import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return formattedPrice;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}
export const handleError = (error: unknown) => {
  console.error(error);
  // throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export const downloadPDF = async () => {
  const capture: any = document.querySelector("#actual-receipt");

  try {
    const canvas = await html2canvas(capture, {
      imageTimeout: 100,
      scale: 1.5, // Adjust scale as needed for better quality
    });

    // Convert the canvas data to a data URL
    const imgDataUrl = canvas.toDataURL("image/png");

    // Display the image in an <img> tag
    const imgElement = document.createElement("img");
    imgElement.src = imgDataUrl;
    document.body.appendChild(imgElement);

    // Set custom size for PDF (in mm)
    const pdfWidth = 210; // A4 width
    const pdfHeight = 397; // A4 height
    const imgWidth = canvas.width * 0.264583; // Convert canvas width to mm (1 inch = 25.4 mm)
    const imgHeight = canvas.height * 0.264583; // Convert canvas height to mm

    // Create a new jsPDF instance with custom size
    const doc = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);

    // Calculate the positioning to center the content on the page
    const xPosition = (pdfWidth - imgWidth) / 2;
    const yPosition = (pdfHeight - imgHeight) / 2;

    // Add the captured image to the PDF
    doc.addImage(imgDataUrl, "PNG", xPosition, yPosition, imgWidth, imgHeight);

    // Convert the PDF to a data URL
    const pdfDataUrl = doc.output("dataurlstring");

    // Create a link element with the data URL
    const link = document.createElement("a");
    link.href = pdfDataUrl;

    // Set attributes for opening in a new tab and triggering download
    link.target = "_blank";
    link.download = "receipt.pdf";

    // Trigger a click event to open the link in a new tab and start the download
    link.click();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
