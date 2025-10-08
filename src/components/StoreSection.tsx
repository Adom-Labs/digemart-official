import { StoreDiscoveryDto } from "@/lib/api";
import WrapContent from "./WrapContent";
import StoreGrid from "./StoreGrid";

export default function StoresSection({ stores }: { stores: StoreDiscoveryDto[] }) {
  return (
    <WrapContent>
      <StoreGrid
        stores={stores}
        title="Featured Stores"
        subtitle="Explore our collection of top-rated stores with unique products"
        showViewAllButton={true}
        viewAllUrl="/findyourplug/stores"
        showTags={'none'}
      />
    </WrapContent>
  );
}
