"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface StoreData {
  storeType?: "EXTERNAL" | "INTERNAL";
  storeName?: string;
  storeDescription?: string;
  storeLogo?: string;
  email?: string;
  phone?: string;
  storeAddress?: string;
  storeLocationState?: string;
  storeLocationCity?: string;
  storeTimeOpen?: string;
  storeTimeClose?: string;
}

interface StorePreviewProps {
  storeData: StoreData;
}

export function StorePreview({ storeData }: StorePreviewProps) {
  const isEcommerce = storeData.storeType === "EXTERNAL";
  const hasData = Object.keys(storeData).length > 1;

  return (
    <Card className="h-full border-2">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {isEcommerce ? (
              <ShoppingCart className="w-4 h-4 text-primary" />
            ) : (
              <Building2 className="w-4 h-4 text-primary" />
            )}
          </div>
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!hasData ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              {isEcommerce ? (
                <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
              ) : (
                <Building2 className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <p className="text-sm">Your store preview will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Store Type Badge */}
            <AnimatePresence>
              {storeData.storeType && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Badge variant="outline" className="text-xs">
                    {isEcommerce ? (
                      <>
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        E-commerce Store
                      </>
                    ) : (
                      <>
                        <Building2 className="w-3 h-3 mr-1" />
                        Business Listing
                      </>
                    )}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Store Logo */}
            <AnimatePresence>
              {storeData.storeLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-center"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-border">
                    <Image
                      src={storeData.storeLogo}
                      alt="Store logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Store Name */}
            <AnimatePresence>
              {storeData.storeName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2 text-center"
                >
                  <h3 className="text-2xl font-bold text-foreground">
                    {storeData.storeName}
                  </h3>
                  {storeData.storeDescription && (
                    <p className="text-sm text-muted-foreground leading-relaxed text-left">
                      {storeData.storeDescription}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact Info */}
            <AnimatePresence>
              {(storeData.email || storeData.phone) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 pt-4 border-t"
                >
                  <h4 className="text-sm font-semibold text-foreground">
                    Contact Information
                  </h4>
                  {storeData.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {storeData.email}
                      </span>
                    </div>
                  )}
                  {storeData.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {storeData.phone}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Location */}
            <AnimatePresence>
              {storeData.storeAddress && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 pt-4 border-t"
                >
                  <h4 className="text-sm font-semibold text-foreground">
                    Location
                  </h4>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-muted-foreground">
                      <p>{storeData.storeAddress}</p>
                      {storeData.storeLocationCity &&
                        storeData.storeLocationState && (
                          <p className="mt-1">
                            {storeData.storeLocationCity},{" "}
                            {storeData.storeLocationState}
                          </p>
                        )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hours */}
            <AnimatePresence>
              {storeData.storeTimeOpen && storeData.storeTimeClose && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 pt-4 border-t"
                >
                  <h4 className="text-sm font-semibold text-foreground">
                    Operating Hours
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {storeData.storeTimeOpen} - {storeData.storeTimeClose}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
