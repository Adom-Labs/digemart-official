import { Suspense } from "react";
import { redirect } from "next/navigation";
import { StoreAccountDashboard } from "@/components/store/account/StoreAccountDashboard";
import { StorePageSkeleton } from "@/components/store/StorePageSkeleton";
import { getStoreBySubdomain } from "../actions";
import { auth } from "@/auth";

interface StoreAccountPageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function StoreAccountPage({
  params,
}: StoreAccountPageProps) {
  try {
    const session = await auth()

    console.log(session);


    // Redirect to sign in if not authenticated
    if (!session?.user) {
      const { subdomain } = await params;
      redirect(`/auth/signin?callbackUrl=/store/${subdomain}/account`);
    }

    const { subdomain } = await params;
    const store = await getStoreBySubdomain(subdomain);

    if (!store || store.status !== "ACTIVE") {
      redirect(`/store/${subdomain}`);
    }

    return (
      <Suspense fallback={<StorePageSkeleton />}>
        <StoreAccountDashboard store={store} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading store account page:", error);
    const { subdomain } = await params;
    redirect(`/store/${subdomain}`);
  }
}
