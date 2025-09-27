import { getStoreUrl } from "@/lib/utils";
import { Twitter, Linkedin, Dribbble } from "lucide-react";
import Link from "next/link";
import { FeaturedVendor } from "@/lib/types";
import WrapContent from "./WrapContent";
const TopSellersSection = ({ vendors }: { vendors: FeaturedVendor[] }) => {
  const hasSocialLinks = vendors.some(
    (vendor) => vendor.twitter || vendor.whatsapp || vendor.facebook
  );
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <WrapContent>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Top Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {vendors.map((vendor) => (
            <div key={vendor.name} className="flex flex-col items-center">
              <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg">
                <img
                  src={vendor.image || "/placeholder.svg"}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{vendor.name}</h3>
              <Link
                href={getStoreUrl(
                  vendor.stores[0].storeUrl,
                  vendor.stores[0].storeType
                )}
              >
                <p className="text-muted-foreground mb-3 underline decoration-dotted decoration-gray-300 decoration-2 hover:decoration-gray-500 transition-colors">
                  {vendor.stores[0].storeName}
                </p>
              </Link>
              {hasSocialLinks && (
                <SocialLinks
                  twitter={vendor.twitter}
                  linkedin={vendor.whatsapp}
                  dribbble={vendor.facebook}
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
  dribbble,
}: {
  twitter?: string;
  linkedin?: string;
  dribbble?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={twitter ?? ""}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Twitter className="size-5" />
        <span className="sr-only">Twitter</span>
      </Link>
      <Link
        href={linkedin ?? ""}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Linkedin className="size-5" />
        <span className="sr-only">LinkedIn</span>
      </Link>
      <Link
        href={dribbble ?? ""}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Dribbble className="size-5" />
        <span className="sr-only">Dribbble</span>
      </Link>
    </div>
  );
}

export default TopSellersSection;
