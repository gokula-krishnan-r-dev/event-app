import { auth } from "@clerk/nextjs";

export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "List you event",
    route: "/list/event",
    // isAdmin: false,
  },
  {
    label: "Create Event",
    route: "/events/create",
    // isAdmin: true,
  },
  {
    label: "My Profile",
    route: "/profile",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};

export const adminIds = [
  "65c5b532f816c22adc60d2b5",
  "65c4b79b570d10171ed6901d",
];

export const isAdmin = async () => {
  try {
    const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId as string;
    return adminIds.includes(userId);
    // return true;
  } catch (error) {
    console.error("Error fetching sessionClaims:", error);
    return false; // Default to false if there's an error or user is not an admin
  }
};
