import { CarouselBanner } from "@/components/shared/CarouselBanner";
import CategoryFilter from "@/components/shared/CategoryFilter";
import CategoryTag from "@/components/shared/CategoryTag";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { CarouselItem } from "@/components/ui/carousel";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  });

  const Srollevents = await getAllEvents({
    query: "",
    category: "",
    page,
    limit: 6,
  });
  if (!events) {
    return <div>loading...</div>;
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <CarouselBanner>
          <>
            {Srollevents?.data.map((event: any, index: any) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Link href={`/events/${event?._id}`} className="">
                  <div className="relative">
                    <img
                      src={event?.imageUrl}
                      className="w-full h-[300px] object-cover rounded-xl"
                      alt=""
                    />
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-white font-semibold text-lg">
                        {event?.title}
                      </h2>
                      {/* {true && (
                        <div className="flex gap-2">
                          <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
                            {event.isFree ? "FREE" : `$${event.price}`}
                          </span>
                          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
                            {event.category.name}
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </>
        </CarouselBanner>
        {/* <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div> */}
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">Based on category {category}</h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <CategoryTag />
        </div>
        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>
        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
}
