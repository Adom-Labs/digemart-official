"use client";

import React from "react";
import Link from "next/link";
import {
  Settings,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  ExternalLink,
  Palette,
  Layout,
  Star,
  Heart,
  Calendar,
  MapPin,
  Globe,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useStore, useStoreStats, Store } from "@/lib/api/hooks/stores";
import { useStoreRecentActivity } from "@/lib/api/hooks";
import { useStoreCustomerMetrics } from "@/lib/api/hooks/store-customers";
import { formatDistanceToNow } from "date-fns";

interface StoreOverviewProps {
  storeId: number;
}

export function StoreOverview({ storeId }: StoreOverviewProps) {
  const {
    data: store,
    isLoading: storeLoading,
    error: storeError,
  } = useStore(storeId);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useStoreStats(storeId);

  const { data: auditData, isLoading: auditLoading } = useStoreRecentActivity(
    storeId,
    5
  );

  const {
    data: customerMetrics,
    isLoading: customerMetricsLoading,
    error: customerMetricsError,
  } = useStoreCustomerMetrics(storeId);

  if (storeLoading || statsLoading || customerMetricsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (storeError || statsError || !store) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p>Failed to load store information. Please try again.</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const storeUrl = store.subdomain
    ? `${window.location.protocol}//${store.subdomain}.${window.location.host
        .split(".")
        .slice(-2)
        .join(".")}`
    : store.storeUrl;

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-start gap-4">
          {/* Store Logo */}
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.storeName}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="w-8 h-8 text-gray-600" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {store.storeName}
              </h1>
              <Badge className={getStatusColor(store.status)}>
                {store.status}
              </Badge>
              {store.verified && (
                <Badge className="bg-green-600 text-white">✓ Verified</Badge>
              )}
            </div>
            <p className="text-gray-600 mb-2">{store.storeDescription}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {store.storeLocationCity}, {store.storeLocationState}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {new Date(store.createdAt).toLocaleDateString()}
              </div>
              {store.subdomain && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {store.subdomain}.digemart.com
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {storeUrl && (
            <Button variant="outline" asChild>
              <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Store
              </a>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/findyourplug/dashboard/stores/${storeId}/settings`}>
              <Settings className="w-4 h-4 mr-2" />
              Store Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Views</p>
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold">
                {store.views.toLocaleString()}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Likes</p>
              <Heart className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold">
                {store.likes.toLocaleString()}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Rating</p>
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold">
                {store.averageRating.toFixed(1)}
              </h2>
              <span className="text-sm text-gray-500">
                ({store.totalRatings} reviews)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Products</p>
              <Package className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold">{stats?.products || 0}</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Customers</p>
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold">
                {customerMetrics?.totalCustomers?.toLocaleString() || 0}
              </h2>
              {customerMetrics?.newCustomersThisMonth &&
                customerMetrics.newCustomersThisMonth > 0 && (
                  <span className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />+
                    {customerMetrics.newCustomersThisMonth} this month
                  </span>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold">
                ${customerMetrics?.averageOrderValue?.toFixed(2) || "0.00"}
              </h2>
              {customerMetrics?.repeatCustomerRate && (
                <span className="text-xs text-gray-500">
                  {(customerMetrics.repeatCustomerRate * 100).toFixed(0)}%
                  repeat
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            Customers
            {customerMetrics?.totalCustomers &&
              customerMetrics.totalCustomers > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs"
                >
                  {customerMetrics.totalCustomers.toLocaleString()}
                </Badge>
              )}
          </TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link
                    href={`/findyourplug/dashboard/stores/${storeId}/products`}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link
                    href={`/findyourplug/dashboard/stores/${storeId}/appearance`}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Customize Appearance
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link
                    href={`/findyourplug/dashboard/stores/${storeId}/layout`}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Edit Layout
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link
                    href={`/findyourplug/dashboard/stores/${storeId}/customers`}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Customers
                    </div>
                    {customerMetrics?.totalCustomers &&
                      customerMetrics.totalCustomers > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs"
                        >
                          {customerMetrics.totalCustomers.toLocaleString()}
                        </Badge>
                      )}
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link
                    href={`/findyourplug/dashboard/stores/${storeId}/analytics`}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Store Type:
                    </span>
                    <p className="text-gray-900">{store.storeType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-900">
                      {store.storeCategory?.name || "Uncategorized"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{store.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">
                      {store.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-900">{store.storeAddress}</p>
                  </div>
                  {store.storeTimeOpen && store.storeTimeClose && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">
                        Business Hours:
                      </span>
                      <p className="text-gray-900">
                        {store.storeWeekOpen} - {store.storeWeekClose},{" "}
                        {store.storeTimeOpen} - {store.storeTimeClose}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : auditData?.auditLogs && auditData.auditLogs.length > 0 ? (
                <div className="space-y-3">
                  {auditData.auditLogs.map((activity: any, index: number) => (
                    <div
                      key={activity.id || index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {activity.action.replace(/_/g, " ")} {activity.entity}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {activity.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardContent className="p-16 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Product Management</h3>
              <p className="text-gray-600 mb-4">
                Add and manage products for your store
              </p>
              <Button asChild>
                <Link
                  href={`/findyourplug/dashboard/stores/${storeId}/products`}
                >
                  Go to Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customerMetrics ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {customerMetrics.totalCustomers}
                        </p>
                        <p className="text-sm text-gray-600">Total Customers</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {(customerMetrics.repeatCustomerRate * 100).toFixed(
                            1
                          )}
                          %
                        </p>
                        <p className="text-sm text-gray-600">Repeat Rate</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                          ${customerMetrics.averageOrderValue.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Avg Order Value</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">
                          ${customerMetrics.averageCustomerValue.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Avg Customer Value
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Loading customer metrics...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Spending Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Spending Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customerMetrics?.topSpendingCustomers &&
                customerMetrics.topSpendingCustomers.length > 0 ? (
                  <div className="space-y-3">
                    {customerMetrics.topSpendingCustomers
                      .slice(0, 5)
                      .map((customer, index) => (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm font-medium">
                              {customer.user.name?.charAt(0) || "#"}
                            </div>
                            <div>
                              <p className="font-medium">
                                {customer.user.name || "Anonymous Customer"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {customer.totalOrders} orders
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              ${customer.totalSpent.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{index + 1}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No customer data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customer Management Actions */}
          <Card className="mt-6">
            <CardContent className="p-16 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Customer Management</h3>
              <p className="text-gray-600 mb-4">
                View detailed customer analytics, manage customer relationships,
                and export customer data
              </p>
              <Button asChild>
                <Link
                  href={`/findyourplug/dashboard/stores/${storeId}/customers`}
                >
                  Go to Customer Management
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardContent className="p-16 text-center">
              <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Store Appearance</h3>
              <p className="text-gray-600 mb-4">
                Customize your store's theme, colors, and layout
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link
                    href={`/findyourplug/dashboard/stores/${storeId}/appearance`}
                  >
                    Customize Theme
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link
                    href={`/findyourplug/dashboard/stores/${storeId}/layout`}
                  >
                    Edit Layout
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardContent className="p-16 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Store Analytics</h3>
              <p className="text-gray-600 mb-4">
                View detailed analytics and performance insights
              </p>
              <Button asChild>
                <Link
                  href={`/findyourplug/dashboard/stores/${storeId}/analytics`}
                >
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
