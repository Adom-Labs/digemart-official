import { Sparkles, Tag } from "lucide-react";
import Image from "next/image";
import { StoreData } from "../types";
import { formatTime } from "../utils";

interface StorePreviewProps {
  data: StoreData;
}

export const StorePreview = ({ data }: StorePreviewProps) => (
  <div className="bg-card border rounded-xl p-6 h-full overflow-y-auto">
    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-primary" />
      Store Preview
    </h3>

    <div className="space-y-4">
      {/* Logo */}
      {data.storeLogo && (
        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border relative">
          <Image
            src={data.storeLogo}
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Store Name & Subdomain */}
      {data.storeName && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Store Name</p>
          <p className="font-semibold text-lg">{data.storeName}</p>
          {data.subdomain && (
            <p className="text-xs text-muted-foreground mt-1">
              {data.subdomain}.digemart.com
            </p>
          )}
        </div>
      )}

      {/* Category */}
      {data.storeCategoryId && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Category</p>
          <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            <Tag className="w-3 h-3 mr-1" />
            Category #{data.storeCategoryId}
          </span>
        </div>
      )}

      {/* Description */}
      {data.storeDescription && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{data.storeDescription}</p>
        </div>
      )}

      {/* Hero Section */}
      {(data.storeHeroHeadline || data.storeHeroImage) && (
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <p className="text-xs text-muted-foreground mb-1">Hero Section</p>
          {data.storeHeroImage && (
            <div className="aspect-video rounded-lg overflow-hidden border relative">
              <Image
                src={data.storeHeroImage}
                alt="Hero"
                fill
                className="object-cover"
              />
            </div>
          )}
          {data.storeHeroHeadline && (
            <p className="font-semibold text-sm">{data.storeHeroHeadline}</p>
          )}
          {data.storeHeroTagline && (
            <p className="text-xs text-muted-foreground">
              {data.storeHeroTagline}
            </p>
          )}
        </div>
      )}

      {/* Cover Photo */}
      {data.storeCoverPhoto && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Cover Photo</p>
          <div className="aspect-video rounded-lg overflow-hidden border relative">
            <Image
              src={data.storeCoverPhoto}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Theme */}
      {data.selectedTheme && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Theme</p>
          <div className="flex items-center gap-2">
            {data.selectedTheme.preview && (
              <div className="w-12 h-12 rounded border overflow-hidden relative">
                <Image
                  src={data.selectedTheme.preview}
                  alt={data.selectedTheme.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{data.selectedTheme.name}</p>
              <p className="text-xs text-muted-foreground">
                {data.selectedTheme.category}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info */}
      {data.email && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Email</p>
          <p className="text-sm">{data.email}</p>
        </div>
      )}

      {data.phone && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Phone</p>
          <p className="text-sm">{data.phone}</p>
        </div>
      )}

      {/* Location */}
      {data.storeAddress && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Location</p>
          <p className="text-sm">
            {data.storeAddress}, {data.storeLocationCity},{" "}
            {data.storeLocationState}
          </p>
        </div>
      )}

      {/* Operating Hours */}
      {data.storeTimeOpen && data.storeTimeClose && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Operating Hours</p>
          <p className="text-sm">
            {data.weekOpen && data.weekClose && (
              <span className="block">
                {data.weekOpen} - {data.weekClose}
              </span>
            )}
            <span>
              {formatTime(data.storeTimeOpen)} -{" "}
              {formatTime(data.storeTimeClose)}
            </span>
          </p>
        </div>
      )}
    </div>
  </div>
);
