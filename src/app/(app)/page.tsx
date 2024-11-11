'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

export default function Home() {
  return (
      <div className="flex flex-col justify-center items-center relative">
        <div className="text-center m-2">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl">
            Dive into the World of Anonymous Coversation
          </h1>
          <p className="my-2 font-medium">
            Explore Mystry Message - Where your identity remains a secret
          </p>
        </div>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-[250px] text-center rounded" 
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="">
                  <Card>
                    <CardHeader className="font-semibold p-3">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-2 h-32">
                      <p className="text-2xl font-semibold">{message.content}</p>

                      <span className="mt-2 font-medium">
                        {message.received}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
  );
}
