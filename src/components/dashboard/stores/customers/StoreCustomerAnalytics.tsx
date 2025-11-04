"use client";

import React from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  Star,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStoreCustomerMetrics } from "@/lib/api/hooks/store-customers";
import { formatDistanceToNow } from "date-fns";

interface StoreCustomerAnalyticsProps {
  storeId: number;
}

export function StoreCustomerAnalytics({
  storeId,
}: StoreCustomerAnalyticsProps) {
  const { data: metrics, isLoading, error } = useStoreCustomerMetrics(storeId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <Card>
        <CardContent className="p-16 text-center">
          <div className="text-red-600 mb-4">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Failed to load customer analytics. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return null;
    const growth = ((current - previous) / previous) * 100;
    const isPositive = growth > 0;

    return (
      <div
        className={`flex items-center text-xs ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {Math.abs(growth).toFixed(1)}%
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">
                Total Customers
              </p>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {metrics.totalCustomers.toLocaleString()}
              </h2>
              {metrics.newCustomersThisMonth > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800"
                >
                  +{metrics.newCustomersThisMonth} this month
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">
                Repeat Customer Rate
              </p>
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {(metrics.repeatCustomerRate * 100).toFixed(1)}%
              </h2>
              <span className="text-sm text-gray-500">
                {metrics.repeatCustomerRate > 0.3
                  ? "Excellent"
                  : metrics.repeatCustomerRate > 0.2
                  ? "Good"
                  : "Needs Improvement"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">
                Avg Order Value
              </p>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">
                ${metrics.averageOrderValue.toFixed(2)}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">
                Avg Customer Value
              </p>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">
                ${metrics.averageCustomerValue.toFixed(2)}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Customer Growth Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {metrics.totalCustomers}
                </p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {metrics.newCustomersThisMonth}
                </p>
                <p className="text-sm text-gray-600">New This Month</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Customer Retention</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${metrics.repeatCustomerRate * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold">
                    {(metrics.repeatCustomerRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Customer growth chart would be displayed here with historical
                  data
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Feature coming soon - requires order history integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Spending Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top Spending Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.topSpendingCustomers &&
            metrics.topSpendingCustomers.length > 0 ? (
              <div className="space-y-3">
                {metrics.topSpendingCustomers
                  .slice(0, 8)
                  .map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm font-medium">
                            {customer.user.name?.charAt(0) || "#"}
                          </div>
                          {index < 3 && (
                            <div
                              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                  ? "bg-gray-400"
                                  : "bg-orange-500"
                              }`}
                            >
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.user.name || "Anonymous Customer"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{customer.totalOrders} orders</span>
                            {customer.lastOrderAt && (
                              <>
                                <span>•</span>
                                <span>
                                  Last order{" "}
                                  {formatDistanceToNow(
                                    new Date(customer.lastOrderAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${customer.totalSpent.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          $
                          {(customer.totalSpent / customer.totalOrders).toFixed(
                            2
                          )}{" "}
                          avg
                        </p>
                      </div>
                    </div>
                  ))}

                {metrics.topSpendingCustomers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No customer spending data available</p>
                    <p className="text-sm">
                      Customer data will appear here once orders are placed
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No customer data available</p>
                <p className="text-sm">
                  Customer analytics will appear here once you have customers
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Customer Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Customer Base
              </h3>
              <p className="text-sm text-blue-700">
                You have <strong>{metrics.totalCustomers}</strong> total
                customers with <strong>{metrics.newCustomersThisMonth}</strong>{" "}
                new customers this month.
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Customer Loyalty
              </h3>
              <p className="text-sm text-green-700">
                Your repeat customer rate is{" "}
                <strong>
                  {(metrics.repeatCustomerRate * 100).toFixed(1)}%
                </strong>
                ,{" "}
                {metrics.repeatCustomerRate > 0.3
                  ? "which is excellent!"
                  : metrics.repeatCustomerRate > 0.2
                  ? "which is good."
                  : "which has room for improvement."}
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">
                Revenue Per Customer
              </h3>
              <p className="text-sm text-purple-700">
                Your average customer value is{" "}
                <strong>${metrics.averageCustomerValue.toFixed(2)}</strong> with
                an average order value of{" "}
                <strong>${metrics.averageOrderValue.toFixed(2)}</strong>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
