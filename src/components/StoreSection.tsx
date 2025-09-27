import { FeaturedStore } from "@/lib/types";
import WrapContent from "./WrapContent";
import StoreGrid from "./StoreGrid";

export default function StoresSection({ stores }: { stores: FeaturedStore[] }) {
  return (
    <WrapContent>
      <StoreGrid
        stores={stores}
        title="Featured Stores"
        subtitle="Explore our collection of top-rated stores with unique products"
        showViewAllButton={true}
        viewAllUrl="/findyourplug/stores"
      />
    </WrapContent>
  );
}
