import ReviewCard from "./ReviewCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import WrapContent from "./WrapContent";

const reviews = [
  {
    name: "Sarah Chen",
    quote:
      "As a small business owner, this marketplace has transformed how I reach customers. The platform is intuitive, secure, and has helped me grow my sales by 40% in just three months. The support team is incredibly responsive too.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    pos: "Owner, Artisan Crafts Co.",
  },
  {
    name: "Marcus Rodriguez",
    quote:
      "I've tried several online marketplaces, but this one stands out for its user-friendly interface and strong community of sellers. The commission rates are fair, and the analytics tools help me make better business decisions. Highly recommended!",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    pos: "Founder, Digital Essentials",
  },
  {
    name: "Emily Thompson",
    quote:
      "The verification process gives both buyers and sellers peace of mind. I appreciate how the platform handles payments securely and provides excellent dispute resolution. It's made running my online store so much easier.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    pos: "Independent Seller",
  },
];

const Reviews = () => {
  return (
    <div className="bg-base-200 py-10" id="review-div">
      <WrapContent>
        <div className="py-8 px-4 mx-auto max-w-(--breakpoint-xl) text-center lg:py-16 lg:px-6">
          <div className="mx-auto max-w-(--breakpoint-sm)">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              What Our Customers Say
            </h2>
            <p className="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
              Hear from satisfied customers who have experienced our marketplace
              platform. Their success stories inspire us to keep improving.
            </p>
          </div>
          <Carousel
            opts={{
              align: "center",
              loop: true,
              containScroll: "trimSnaps",
            }}
          >
            <CarouselContent>
              {reviews.map(({ name, pos, quote, img }) => {
                return (
                  <CarouselItem key={name} className="px-2">
                    <ReviewCard name={name} pos={pos} quote={quote} img={img} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-30px] top-1/2 -translate-y-1/2 fill-black" />
            <CarouselNext className="absolute right-[-30px] top-1/2 -translate-y-1/2 fill-black" />
          </Carousel>
        </div>
      </WrapContent>
    </div>
  );
};

export default Reviews;
