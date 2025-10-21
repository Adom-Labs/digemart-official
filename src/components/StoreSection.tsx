import WrapContent from "./WrapContent";
import StoreGrid from "./StoreGrid";
import { Store } from "@/lib/api/types";

export default function StoresSection({ stores }: { stores: Store[] }) {
  return (
    <WrapContent>
      <StoreGrid
        stores={stores}
        title="Featured Stores"
        subtitle="Explore our collection of top-rated stores with unique products"
        showViewAllButton={true}
        viewAllUrl="/findyourplug/plugs"
        showTags={'none'}
      />
    </WrapContent>
  );
}
