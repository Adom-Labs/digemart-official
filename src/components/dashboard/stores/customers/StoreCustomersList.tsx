"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  SortAsc,
  SortDesc,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useStoreCustomers,
  useExportCustomers,
} from "@/lib/api/hooks/store-customers";
import { StoreCustomer, StoreCustomerQuery } from "@/lib/api/store-customers";
import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoreCustomersListProps {
  storeId: number;
}

export function StoreCustomersList({ storeId }: StoreCustomersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] =
    useState<StoreCustomerQuery["sortBy"]>("totalSpent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [minSpent, setMinSpent] = useState<number | undefined>();
  const [minOrders, setMinOrders] = useState<number | undefined>();
  const [selectedCustomer, setSelectedCustomer] =
    useState<StoreCustomer | null>(null);

  const queryParams = useMemo(
    (): StoreCustomerQuery => ({
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      sortBy,
      sortOrder,
      minSpent,
      minOrders,
    }),
    [currentPage, pageSize, searchTerm, sortBy, sortOrder, minSpent, minOrders]
  );

  const {
    data: customersData,
    isLoading,
    error,
  } = useStoreCustomers(storeId, queryParams);

  const exportMutation = useExportCustomers();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (field: StoreCustomerQuery["sortBy"]) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const result = await exportMutation.mutateAsync({
        storeId,
        query: queryParams,
      });

      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = result.downloadUrl;
      link.download = `store-${storeId}-customers-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMinSpent(undefined);
    setMinOrders(undefined);
    setSortBy("totalSpent");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const getSortIcon = (field: StoreCustomerQuery["sortBy"]) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filters skeleton */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Table skeleton */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !customersData) {
    return (
      <Card>
        <CardContent className="p-16 text-center">
          <div className="text-red-600 mb-4">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Failed to load customers. Please try again.</p>
          </div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const { data: customers, total, totalPages } = customersData;
  const hasFilters = searchTerm || minSpent || minOrders;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer List ({total.toLocaleString()} customers)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <Download className="w-4 h-4 mr-2" />
              {exportMutation.isPending ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as StoreCustomerQuery["sortBy"])
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSpent">Total Spent</SelectItem>
                <SelectItem value="totalOrders">Total Orders</SelectItem>
                <SelectItem value="lastOrderAt">Last Order</SelectItem>
                <SelectItem value="firstOrderAt">First Order</SelectItem>
                <SelectItem value="createdAt">Join Date</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasFilters && (
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Customers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Minimum Spent ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={minSpent || ""}
                      onChange={(e) =>
                        setMinSpent(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Minimum Orders
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minOrders || ""}
                      onChange={(e) =>
                        setMinOrders(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="flex-1"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Customer Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("totalOrders")}
                >
                  <div className="flex items-center gap-1">
                    Orders
                    {getSortIcon("totalOrders")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("totalSpent")}
                >
                  <div className="flex items-center gap-1">
                    Total Spent
                    {getSortIcon("totalSpent")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("lastOrderAt")}
                >
                  <div className="flex items-center gap-1">
                    Last Order
                    {getSortIcon("lastOrderAt")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Customer Since
                    {getSortIcon("createdAt")}
                  </div>
                </TableHead>
                <TableHead>Marketing</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={customer.user.image || undefined} />
                        <AvatarFallback>
                          {customer.user.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.user.name || "Anonymous Customer"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>ID: {customer.id}</span>
                          {customer.user.phone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {customer.user.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {customer.totalOrders}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        ${customer.totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      ${(customer.totalSpent / customer.totalOrders).toFixed(2)}{" "}
                      avg
                    </p>
                  </TableCell>
                  <TableCell>
                    {customer.lastOrderAt ? (
                      <div>
                        <p className="text-sm">
                          {formatDistanceToNow(new Date(customer.lastOrderAt), {
                            addSuffix: true,
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(
                            new Date(customer.lastOrderAt),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {formatDistanceToNow(new Date(customer.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(customer.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.marketingConsent ? "default" : "secondary"
                      }
                      className={
                        customer.marketingConsent
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {customer.marketingConsent ? "Opted In" : "Opted Out"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customer Details</DialogTitle>
                        </DialogHeader>
                        <CustomerDetailsModal customer={customer} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {customers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-600">
              {hasFilters
                ? "Try adjusting your search or filter criteria."
                : "Your customers will appear here once they start placing orders."}
            </p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, total)} of {total} customers
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Customer Details Modal Component
function CustomerDetailsModal({ customer }: { customer: StoreCustomer }) {
  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Avatar className="w-16 h-16">
          <AvatarImage src={customer.user.image || undefined} />
          <AvatarFallback className="text-lg">
            {customer.user.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {customer.user.name || "Anonymous Customer"}
          </h3>
          <p className="text-gray-600">Customer ID: {customer.id}</p>
          <div className="flex items-center gap-4 mt-2">
            {customer.user.phone && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {customer.user.phone}
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Customer since{" "}
              {format(new Date(customer.createdAt), "MMM d, yyyy")}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {customer.totalOrders}
          </div>
          <div className="text-sm text-blue-700">Total Orders</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${customer.totalSpent.toFixed(2)}
          </div>
          <div className="text-sm text-green-700">Total Spent</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            ${(customer.totalSpent / customer.totalOrders).toFixed(2)}
          </div>
          <div className="text-sm text-purple-700">Average Order</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {customer.lastOrderAt
              ? formatDistanceToNow(new Date(customer.lastOrderAt), {
                  addSuffix: true,
                })
              : "Never"}
          </div>
          <div className="text-sm text-orange-700">Last Order</div>
        </div>
      </div>

      {/* Customer Preferences */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Preferences & Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">
              Marketing Preferences
            </h5>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Marketing Consent</span>
                <Badge
                  variant={customer.marketingConsent ? "default" : "secondary"}
                  className={
                    customer.marketingConsent
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {customer.marketingConsent ? "Opted In" : "Opted Out"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Order History</h5>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>First Order:</span>
                <span>
                  {customer.firstOrderAt
                    ? format(new Date(customer.firstOrderAt), "MMM d, yyyy")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Order:</span>
                <span>
                  {customer.lastOrderAt
                    ? format(new Date(customer.lastOrderAt), "MMM d, yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Customer Data */}
      {customer.preferences && Object.keys(customer.preferences).length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Store Preferences</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(customer.preferences, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" className="flex-1">
          <Mail className="w-4 h-4 mr-2" />
          Send Email
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Orders
        </Button>
      </div>
    </div>
  );
}
