"use client";
import { useEffect, useState, useMemo } from "react";
import { FilteredUser } from "@interfaces/user.interface";
import { IPaginationQuery } from "@interfaces/utils.interface";

export interface FilterOption {
  label: string;
  value: string;
}

interface UseGetVendorsReturn {
  vendors: FilteredUser[];
  sortOptions: FilterOption[];
  pagination: IPaginationQuery;
  totalCount: number;
  handleSortChange: (sort: "asc" | "desc") => void;
  handlePageChange: (page: number) => void;
  handleSortByChange: (sortBy: string) => void;
  isLoading: boolean;
}

// Mock vendor data matching the HTML design
const mockVendorsData: FilteredUser[] = [
  {
    id: "vendor-1",
    email: "info@cityplumbing.com",
    displayName: "City Plumbing Co.",
    fullName: "Mark Johnson",
    phoneNumber: "(212) 555-1234",
    roles: ["vendor"],
    isConnected: true,
    createdAt: "2023-01-15T00:00:00.000Z",
    isActive: true,
    userType: "vendor",
    vendorInfo: {
      companyName: "City Plumbing Co.",
      serviceType: "Plumbing",
      contactPerson: "Mark Johnson",
      rating: 4.5,
      reviewCount: 23,
      completedJobs: 45,
      averageResponseTime: "2.1 days",
      averageServiceCost: 275,
    },
  },
  {
    id: "vendor-2",
    email: "info@electrapro.com",
    displayName: "ElectraPro Services",
    fullName: "Sarah Chen",
    phoneNumber: "(646) 555-7890",
    roles: ["vendor"],
    isConnected: true,
    createdAt: "2023-02-10T00:00:00.000Z",
    isActive: true,
    userType: "vendor",
    vendorInfo: {
      companyName: "ElectraPro Services",
      serviceType: "Electrical",
      contactPerson: "Sarah Chen",
      rating: 4.0,
      reviewCount: 18,
      completedJobs: 32,
      averageResponseTime: "1.8 days",
      averageServiceCost: 320,
    },
  },
  {
    id: "vendor-3",
    email: "service@climatesystems.com",
    displayName: "Climate Systems Inc.",
    fullName: "Robert Miller",
    phoneNumber: "(917) 555-4321",
    roles: ["vendor"],
    isConnected: true,
    createdAt: "2023-01-20T00:00:00.000Z",
    isActive: true,
    userType: "vendor",
    vendorInfo: {
      companyName: "Climate Systems Inc.",
      serviceType: "HVAC",
      contactPerson: "Robert Miller",
      rating: 4.9,
      reviewCount: 31,
      completedJobs: 67,
      averageResponseTime: "1.2 days",
      averageServiceCost: 385,
    },
  },
  {
    id: "vendor-4",
    email: "info@securitymasters.com",
    displayName: "Security Masters",
    fullName: "David Wilson",
    phoneNumber: "(212) 555-8765",
    roles: ["vendor"],
    isConnected: true,
    createdAt: "2023-03-05T00:00:00.000Z",
    isActive: true,
    userType: "vendor",
    vendorInfo: {
      companyName: "Security Masters",
      serviceType: "Security",
      contactPerson: "David Wilson",
      rating: 3.5,
      reviewCount: 12,
      completedJobs: 24,
      averageResponseTime: "2.3 days",
      averageServiceCost: 195,
    },
  },
  {
    id: "vendor-5",
    email: "jennifer@apexpainters.com",
    displayName: "Apex Painters",
    fullName: "Jennifer Lopez",
    phoneNumber: "(347) 555-9087",
    roles: ["vendor"],
    isConnected: true,
    createdAt: "2023-02-28T00:00:00.000Z",
    isActive: true,
    userType: "vendor",
    vendorInfo: {
      companyName: "Apex Painters",
      serviceType: "Painting",
      contactPerson: "Jennifer Lopez",
      rating: 4.2,
      reviewCount: 19,
      completedJobs: 38,
      averageResponseTime: "1.5 days",
      averageServiceCost: 240,
    },
  },
  {
    id: "vendor-6",
    email: "service@locksmithexpress.com",
    displayName: "Locksmith Express",
    fullName: "Michael Brown",
    phoneNumber: "(646) 555-2341",
    roles: ["vendor"],
    isConnected: true,
    createdAt: "2023-01-08T00:00:00.000Z",
    isActive: true,
    userType: "vendor",
    vendorInfo: {
      companyName: "Locksmith Express",
      serviceType: "Locksmith",
      contactPerson: "Michael Brown",
      rating: 4.3,
      reviewCount: 16,
      completedJobs: 29,
      averageResponseTime: "0.8 days",
      averageServiceCost: 145,
    },
  },
  {
    id: "vendor-7",
    email: "james@fixitall.com",
    displayName: "Fix-It-All Handyman",
    fullName: "James Taylor",
    phoneNumber: "(917) 555-4567",
    roles: ["vendor"],
    isConnected: true,
    createdAt: "2023-01-30T00:00:00.000Z",
    isActive: true,
    userType: "vendor",
    vendorInfo: {
      companyName: "Fix-It-All Handyman",
      serviceType: "General",
      contactPerson: "James Taylor",
      rating: 4.1,
      reviewCount: 22,
      completedJobs: 41,
      averageResponseTime: "2.0 days",
      averageServiceCost: 210,
    },
  },
];

export const useGetVendors = (cuid: string): UseGetVendorsReturn => {
  const [vendors, setVendors] = useState<FilteredUser[]>([]);
  const [pagination, setPagination] = useState<IPaginationQuery>({
    page: 1,
    limit: 10,
    sort: "asc",
    sortBy: "companyName",
  });
  const [isLoading, setIsLoading] = useState(false);

  const sortOptions: FilterOption[] = [
    { label: "All Vendors", value: "all" },
    { label: "Plumbing", value: "plumbing" },
    { label: "Electrical", value: "electrical" },
    { label: "HVAC", value: "hvac" },
    { label: "General", value: "general" },
    { label: "Security", value: "security" },
    { label: "Painting", value: "painting" },
    { label: "Locksmith", value: "locksmith" },
  ];

  // Simulate API call
  const fetchVendors = async () => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredVendors = [...mockVendorsData];
      
      // Apply service type filter
      if (pagination.sortBy && pagination.sortBy !== "all") {
        filteredVendors = filteredVendors.filter(vendor =>
          vendor.vendorInfo?.serviceType?.toLowerCase() === pagination.sortBy?.toLowerCase()
        );
      }
      
      // Apply sorting
      if (pagination.sortBy && pagination.sortBy !== "all") {
        filteredVendors.sort((a, b) => {
          const aValue = a.vendorInfo?.companyName || a.displayName;
          const bValue = b.vendorInfo?.companyName || b.displayName;
          
          if (pagination.sort === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        });
      }
      
      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedVendors = filteredVendors.slice(
        startIndex,
        startIndex + pagination.limit
      );
      
      setVendors(paginatedVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cuid) {
      fetchVendors();
    }
  }, [cuid, pagination]);

  const handleSortChange = (sort: "asc" | "desc") => {
    setPagination(prev => ({ ...prev, sort, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSortByChange = (sortBy: string) => {
    setPagination(prev => ({ ...prev, sortBy, page: 1 }));
  };

  const totalCount = useMemo(() => {
    if (pagination.sortBy && pagination.sortBy !== "all") {
      return mockVendorsData.filter(vendor =>
        vendor.vendorInfo?.serviceType?.toLowerCase() === pagination.sortBy?.toLowerCase()
      ).length;
    }
    return mockVendorsData.length;
  }, [pagination.sortBy]);

  return {
    vendors,
    sortOptions,
    pagination,
    totalCount,
    handleSortChange,
    handlePageChange,
    handleSortByChange,
    isLoading,
  };
};