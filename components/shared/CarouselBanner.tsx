import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselBanner({ children }: any) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full px-12 max-w-full"
    >
      <CarouselContent>{children}</CarouselContent>
      <CarouselPrevious className="!ml-28 text-white" />
      <CarouselNext className="!mr-28 text-white" />
    </Carousel>
  );
}
