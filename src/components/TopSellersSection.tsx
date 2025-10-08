import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Dribbble } from "lucide-react";
import { TopVendorDto } from "@/lib/api";
import WrapContent from "./WrapContent";
const TopSellersSection = ({ vendors }: { vendors: TopVendorDto[] }) => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <WrapContent>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Top Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="flex flex-col items-center">
              <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg">
                <Image
                  src={vendor.owner.avatar || "/placeholder.svg"}
                  alt={`${vendor.owner.firstName} ${vendor.owner.lastName}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{vendor.owner.firstName} {vendor.owner.lastName}</h3>
              <Link href={`/findyourplug/stores/${vendor.storeSlug}`}>
                <p className="text-muted-foreground mb-3 underline decoration-dotted decoration-gray-300 decoration-2 hover:decoration-gray-500 transition-colors">
                  {vendor.storeName}
                </p>
              </Link>
              {/* <div className="text-sm text-gray-500 text-center mb-3">
                <p>Products: {vendor.metrics.totalProducts}</p>
                <p>Orders: {vendor.metrics.totalOrders}</p>
                <p>Success Rate: {vendor.metrics.successRate}%</p>
              </div> */}
              {vendor.socialLinks && (
                <SocialLinks
                  twitter={vendor.socialLinks?.twitter}
                  linkedin={vendor.socialLinks?.linkedin}
                  facebook={vendor.socialLinks?.facebook}
                />
              )}
            </div>
          ))}
        </div>
      </WrapContent>
    </section>
  );
};

function SocialLinks({
  twitter,
  linkedin,
  facebook,
}: {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {twitter && (
        <Link
          href={twitter}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Twitter className="size-5" />
          <span className="sr-only">Twitter</span>
        </Link>
      )}
      {linkedin && (
        <Link
          href={linkedin}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Linkedin className="size-5" />
          <span className="sr-only">LinkedIn</span>
        </Link>
      )}
      {facebook && (
        <Link
          href={facebook}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Dribbble className="size-5" />
          <span className="sr-only">Facebook</span>
        </Link>
      )}
    </div>
  );
}

export default TopSellersSection;
