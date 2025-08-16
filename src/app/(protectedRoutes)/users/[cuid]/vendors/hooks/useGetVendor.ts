import { useEffect, useState } from "react";

export interface VendorDetail {
  id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    initials: string;
  };
  vendorInfo: {
    companyName: string;
    businessType: string;
    status: 'active' | 'inactive';
    rating: number;
    reviewCount: number;
  };
  statistics: {
    totalRevenue: string;
    totalProjects: number;
    activeProjects: number;
    onTimeRate: string;
    responseTime: string;
    repeatRate: string;
  };
  tags: Array<{
    type: 'achievement' | 'permission';
    label: string;
    icon?: string;
  }>;
  services: Array<{
    id: string;
    name: string;
    category: string;
    categoryIcon: string;
    rate: string;
    availability: string;
    responseTime: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    property: string;
    date: string;
    status: 'completed' | 'in-progress';
    amount: string;
  }>;
  performance: {
    avgResponseTime: string;
    completionRate: string;
    customerRating: string;
    repeatRate: string;
  };
  reviews: Array<{
    id: string;
    reviewer: string;
    property: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  contact: {
    primary: {
      name: string;
      phone: string;
      email: string;
    };
    office: {
      address: string;
      city: string;
      hours: string;
    };
  };
}

// Mock vendor data matching the HTML structure
const mockVendorData: VendorDetail = {
  id: "vendor-2022-001",
  personalInfo: {
    fullName: "ACME Maintenance Co.",
    email: "mike@acmemaintenance.com",
    phoneNumber: "+1 (555) 987-6543",
    initials: "AC",
  },
  vendorInfo: {
    companyName: "ACME Maintenance Co.",
    businessType: "HVAC & Electrical Services",
    status: "active",
    rating: 4.8,
    reviewCount: 23,
  },
  statistics: {
    totalRevenue: "$285K",
    totalProjects: 47,
    activeProjects: 23,
    onTimeRate: "98%",
    responseTime: "2.5h",
    repeatRate: "85%",
  },
  tags: [
    { type: 'achievement', label: 'Verified', icon: 'bx bx-check-circle' },
    { type: 'permission', label: 'Licensed', icon: 'bx bx-shield' },
    { type: 'permission', label: 'Insured', icon: 'bx bx-shield-alt-2' },
    { type: 'permission', label: '24/7 Service', icon: 'bx bx-time' },
    { type: 'achievement', label: 'Top Rated', icon: 'bx bx-award' },
  ],
  services: [
    {
      id: "hvac-repair",
      name: "HVAC Repair & Maintenance",
      category: "HVAC",
      categoryIcon: "bx bx-wind",
      rate: "$85/hr",
      availability: "24/7 Available",
      responseTime: "2-4 hours"
    },
    {
      id: "electrical-work",
      name: "Electrical Work",
      category: "Electrical",
      categoryIcon: "bx bx-plug",
      rate: "$95/hr",
      availability: "Business Hours",
      responseTime: "Same Day"
    },
    {
      id: "emergency-services",
      name: "Emergency Services",
      category: "Emergency",
      categoryIcon: "bx bx-error",
      rate: "$150/hr",
      availability: "24/7 Available",
      responseTime: "1 hour"
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "HVAC System Upgrade",
      property: "Harbor Heights, Unit 12A-15C",
      date: "Nov 2, 2024",
      status: "completed",
      amount: "$12,500"
    },
    {
      id: "project-2",
      title: "Electrical Panel Replacement",
      property: "Sunset Apartments, Building A",
      date: "Oct 28, 2024",
      status: "completed",
      amount: "$8,900"
    },
    {
      id: "project-3",
      title: "Emergency Generator Installation",
      property: "Pine View Condos, Basement",
      date: "Nov 20, 2024",
      status: "in-progress",
      amount: "$15,200"
    }
  ],
  performance: {
    avgResponseTime: "2.5h",
    completionRate: "98%",
    customerRating: "4.8/5",
    repeatRate: "85%",
  },
  reviews: [
    {
      id: "review-1",
      reviewer: "Sarah Wilson",
      property: "Harbor Heights",
      rating: 5,
      comment: "Excellent work on our HVAC system upgrade. The team was professional and efficient.",
      date: "Nov 5, 2024"
    },
    {
      id: "review-2",
      reviewer: "James Davis",
      property: "Sunset Apartments",
      rating: 5,
      comment: "Quick response time for our electrical emergency. Very satisfied with the service.",
      date: "Oct 30, 2024"
    }
  ],
  contact: {
    primary: {
      name: "Mike Johnson",
      phone: "+1 (555) 987-6543",
      email: "mike@acmemaintenance.com"
    },
    office: {
      address: "456 Industrial Ave, Suite 200",
      city: "New York, NY 10001",
      hours: "Mon-Fri: 8AM-6PM"
    }
  }
};

export const useGetVendor = (cuid: string, vendorId: string) => {
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, return mock data regardless of IDs
        // In real implementation, this would make an API call
        setVendor(mockVendorData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vendor');
      } finally {
        setIsLoading(false);
      }
    };

    if (cuid && vendorId) {
      fetchVendor();
    }
  }, [cuid, vendorId]);

  return {
    vendor,
    isLoading,
    error,
    refetch: () => {
      if (cuid && vendorId) {
        setVendor(null);
        setIsLoading(true);
        setError(null);
      }
    }
  };
};