// "use client";
import EventForm from "@/components/shared/EventForm";
import { isAdmin } from "@/constants";
import { auth } from "@clerk/nextjs";

const CreateEvent = async () => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;
  const userIsAdmin = await isAdmin();

  return (
    <>
      {userIsAdmin ? (
        <>
          <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
            <h3 className="wrapper h3-bold text-center sm:text-left">
              Create Event
            </h3>
          </section>

          <div className="wrapper my-8">
            <EventForm userId={userId} type="Create" />
          </div>
        </>
      ) : (
        <div className="wrapper my-8">
          <h1>Sorry, you are not authorized to create events</h1>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
