import { notFound } from "next/navigation";
import { Metadata } from "next";
import { StoreProvider } from "@/components/store/StoreProvider";
import { ThemeProvider } from "@/components/store/ThemeProvider";
import { StoreCartProvider } from "@/components/store/cart/StoreCartProvider";
import { StoreAuthProvider } from "@/components/store/auth/StoreAuthProvider";
import { getStoreBySubdomain } from "./actions";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  try {
    const { subdomain } = await params;
    const store = await getStoreBySubdomain(subdomain);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digemart.com";
    const storeUrl = `https://${subdomain}.${new URL(baseUrl).hostname}`;

    return {
      title:
        store.seoConfig?.title ||
        `${store.storeName} - ${store.storeHeroTagline || "Online Store"}`,
      description:
        store.seoConfig?.description ||
        store.storeDescription ||
        `Shop at ${store.storeName}`,
      keywords:
        store.seoConfig?.keywords ||
        [store.storeName, store.storeCategory?.name].filter(Boolean),
      openGraph: {
        title: store.storeName,
        description: store.storeDescription || `Shop at ${store.storeName}`,
        url: storeUrl,
        siteName: store.storeName,
        images: [
          {
            url:
              store.logo || store.storeCoverPhoto || "/default-store-image.jpg",
            width: 1200,
            height: 630,
            alt: `${store.storeName} logo`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: store.storeName,
        description: store.storeDescription || `Shop at ${store.storeName}`,
        images: [
          store.logo || store.storeCoverPhoto || "/default-store-image.jpg",
        ],
      },
      alternates: {
        canonical: storeUrl,
      },
      robots: {
        index: store.status === "ACTIVE" && store.verified,
        follow: store.status === "ACTIVE" && store.verified,
      },
    };
  } catch (error) {
    return {
      title: "Store Not Found",
      description: "The requested store could not be found.",
    };
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  try {
    const { subdomain } = await params;
    const store = await getStoreBySubdomain(subdomain);

    if (!store || store.status !== "ACTIVE") {
      notFound();
    }

    return (
      <StoreProvider store={store}>
        <ThemeProvider theme={store.themeConfig}>
          <StoreAuthProvider>
            <StoreCartProvider storeId={store.id}>
              <div className="store-layout" data-store-id={store.id}>
                {children}
              </div>
            </StoreCartProvider>
          </StoreAuthProvider>
        </ThemeProvider>
      </StoreProvider>
    );
  } catch (error) {
    notFound();
  }
}
