"use client";

import React, { useState } from "react";
import { StoreSubdomainData } from "@/lib/api/subdomain";
import { StoreHeader } from "../navigation/StoreHeader";
import { StoreFooter } from "../navigation/StoreFooter";
import {
  useStoreAuth,
  useStoreCustomerProfile,
} from "../auth/StoreAuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StoreOrderHistory } from "./StoreOrderHistory";
import {
  User,
  Package,
  MapPin,
  Bell,
  Settings,
  Heart,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";

interface StoreAccountDashboardProps {
  store: StoreSubdomainData;
}

export function StoreAccountDashboard({ store }: StoreAccountDashboardProps) {
  const { user, isAuthenticated } = useStoreAuth();
  const { profile, isStoreCustomer, hasStoreProfile, isFirstTimeCustomer } =
    useStoreCustomerProfile();
  const [activeTab, setActiveTab] = useState("overview");

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StoreHeader store={store} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to access your account.
              </p>
              <Button>Sign In</Button>
            </CardContent>
          </Card>
        </div>
        <StoreFooter store={store} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader store={store} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name || user.email}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your account and orders at {store.storeName}
              </p>
            </div>
            {isFirstTimeCustomer && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                New Customer
              </Badge>
            )}
          </div>
        </div>

        {/* Account Overview Cards */}
        {hasStoreProfile && profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.totalOrders}</div>
                <p className="text-xs text-gray-600 mt-1">
                  Since {new Date(profile.firstOrderDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${profile.totalSpent.toFixed(2)}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Avg: ${profile.averageOrderValue.toFixed(2)} per order
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Customer Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-green-600">
                  {profile.totalOrders > 5
                    ? "VIP Customer"
                    : profile.totalOrders > 1
                    ? "Returning Customer"
                    : "New Customer"}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {profile.lastOrderDate
                    ? `Last order: ${new Date(
                        profile.lastOrderDate
                      ).toLocaleDateString()}`
                    : "No orders yet"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Addresses</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your account details for {store.storeName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-gray-600">Email Address</p>
                    </div>
                  </div>

                  {user.name && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-600">Full Name</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="text-sm font-medium">
                      {profile
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "Today"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    View Recent Orders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <StoreOrderHistory storeId={store.id} />
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Addresses
                </CardTitle>
                <CardDescription>
                  Manage your delivery addresses for {store.storeName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No addresses saved
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add a shipping address to make checkout faster
                  </p>
                  <Button>Add Address</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              {/* Marketing Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Marketing Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how {store.storeName} can contact you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive updates about your orders and new products
                      </p>
                    </div>
                    <Badge
                      variant={
                        profile?.preferences?.emailNotifications
                          ? "default"
                          : "secondary"
                      }
                    >
                      {profile?.preferences?.emailNotifications
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing emails</p>
                      <p className="text-sm text-gray-600">
                        Promotional offers and store updates
                      </p>
                    </div>
                    <Badge
                      variant={
                        profile?.preferences?.marketingEmails
                          ? "default"
                          : "secondary"
                      }
                    >
                      {profile?.preferences?.marketingEmails
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Store Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Store Preferences
                  </CardTitle>
                  <CardDescription>
                    Your preferences for shopping at {store.storeName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Preferred shipping method</p>
                      <p className="text-sm text-gray-600">
                        {profile?.preferences?.preferredShippingMethod ||
                          "Not set"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Preferred payment method</p>
                      <p className="text-sm text-gray-600">
                        {profile?.preferences?.preferredPaymentMethod ||
                          "Not set"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <StoreFooter store={store} />
    </div>
  );
}
