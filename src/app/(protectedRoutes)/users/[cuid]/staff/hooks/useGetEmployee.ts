import { useEffect, useState } from "react";

export interface EmployeeDetail {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar?: string;
    initials: string;
  };
  employeeInfo: {
    employeeId: string;
    jobTitle: string;
    department: string;
    reportsTo: string;
    hireDate: string;
    employmentType: string;
    status: 'active' | 'inactive';
    tenure: string;
    directManager: string;
  };
  statistics: {
    propertiesManaged: number;
    unitsManaged: number;
    tasksCompleted: number;
    onTimeRate: string;
    rating: string;
    activeTasks: number;
  };
  skills: string[];
  tags: Array<{
    type: 'employment' | 'achievement' | 'permission';
    label: string;
    icon?: string;
  }>;
  about: string;
  properties: Array<{
    id: string;
    name: string;
    location: string;
    units: number;
    occupancy: string;
    occupancyRate: number;
    since: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    property: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    status: 'in-progress' | 'pending' | 'completed';
  }>;
  performance: {
    taskCompletionRate: string;
    tenantSatisfaction: string;
    avgOccupancyRate: string;
    avgResponseTime: string;
    monthlyTrends: Array<{
      month: string;
      tasksCompleted: number;
      avgResponseTime: string;
      tenantRating: string;
      performanceScore: number;
    }>;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    icon: string;
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
    emergency: {
      name: string;
      phone: string;
      relationship: string;
    };
    manager: {
      name: string;
      phone: string;
      email: string;
    };
  };
}

// Mock employee data matching the HTML structure
const mockEmployeeData: EmployeeDetail = {
  id: "emp-2022-001",
  personalInfo: {
    firstName: "John",
    lastName: "Smith",
    fullName: "John Smith",
    email: "john.smith@property.com",
    phoneNumber: "+1 (555) 123-4567",
    initials: "JS",
  },
  employeeInfo: {
    employeeId: "EMP-2022-001",
    jobTitle: "Senior Property Manager",
    department: "Operations",
    reportsTo: "Sarah Wilson",
    hireDate: "January 15, 2022",
    employmentType: "Full-Time",
    status: "active",
    tenure: "3 Years",
    directManager: "Sarah Wilson",
  },
  statistics: {
    propertiesManaged: 12,
    unitsManaged: 156,
    tasksCompleted: 47,
    onTimeRate: "98%",
    rating: "4.8",
    activeTasks: 8,
  },
  skills: [
    "Property Management",
    "Tenant Relations", 
    "Maintenance Coordination",
    "Financial Reporting",
    "Lease Administration",
    "Vendor Management",
    "Building Safety",
    "Budget Planning"
  ],
  tags: [
    { type: 'employment', label: 'Full-Time', icon: 'bx bx-check-circle' },
    { type: 'achievement', label: 'Top Performer', icon: 'bx bx-award' },
    { type: 'achievement', label: 'Certified', icon: 'bx bx-shield' },
    { type: 'permission', label: 'Master Key Access', icon: 'bx bx-key' },
    { type: 'permission', label: 'Company Vehicle', icon: 'bx bx-car' },
  ],
  about: "John Smith is a highly experienced property manager with over 10 years in the real estate industry. He specializes in residential property management and has successfully managed portfolios worth over $50 million. John is known for his excellent tenant relations, proactive maintenance approach, and strong financial acumen. He holds certifications in Property Management (CPM) and Real Estate Management (REM).",
  properties: [
    {
      id: "prop-1",
      name: "Sunset Apartments",
      location: "456 Oak Avenue, Downtown",
      units: 24,
      occupancy: "92%",
      occupancyRate: 92,
      since: "Jan 2022"
    },
    {
      id: "prop-2", 
      name: "Pine View Condos",
      location: "789 Pine Street, Midtown",
      units: 18,
      occupancy: "89%",
      occupancyRate: 89,
      since: "Mar 2022"
    },
    {
      id: "prop-3",
      name: "Harbor Heights",
      location: "321 Harbor Drive, Waterfront", 
      units: 36,
      occupancy: "95%",
      occupancyRate: 95,
      since: "Jun 2022"
    },
    {
      id: "prop-4",
      name: "Green Valley Residences",
      location: "100 Valley Road, Suburbs",
      units: 42,
      occupancy: "88%", 
      occupancyRate: 88,
      since: "Sep 2022"
    },
    {
      id: "prop-5",
      name: "Downtown Lofts", 
      location: "555 Main Street, City Center",
      units: 36,
      occupancy: "100%",
      occupancyRate: 100,
      since: "Jan 2023"
    }
  ],
  tasks: [
    {
      id: "task-1",
      title: "Unit 4B Inspection",
      property: "Sunset Apartments",
      priority: "high",
      dueDate: "Nov 22, 2024",
      status: "in-progress"
    },
    {
      id: "task-2", 
      title: "Quarterly Financial Report",
      property: "All Properties",
      priority: "medium",
      dueDate: "Nov 30, 2024",
      status: "pending"
    },
    {
      id: "task-3",
      title: "Tenant Meeting - Building A",
      property: "Harbor Heights",
      priority: "medium", 
      dueDate: "Nov 25, 2024",
      status: "pending"
    },
    {
      id: "task-4",
      title: "HVAC Maintenance Check",
      property: "Pine View Condos",
      priority: "low",
      dueDate: "Dec 1, 2024",
      status: "pending"
    },
    {
      id: "task-5",
      title: "Lease Renewal - Unit 8C",
      property: "Downtown Lofts",
      priority: "high",
      dueDate: "Nov 28, 2024", 
      status: "in-progress"
    }
  ],
  performance: {
    taskCompletionRate: "98%",
    tenantSatisfaction: "4.8/5",
    avgOccupancyRate: "92%",
    avgResponseTime: "12h",
    monthlyTrends: [
      {
        month: "November 2024",
        tasksCompleted: 8,
        avgResponseTime: "10h",
        tenantRating: "4.9/5",
        performanceScore: 95
      },
      {
        month: "October 2024",
        tasksCompleted: 12,
        avgResponseTime: "12h", 
        tenantRating: "4.8/5",
        performanceScore: 92
      },
      {
        month: "September 2024",
        tasksCompleted: 15,
        avgResponseTime: "14h",
        tenantRating: "4.7/5",
        performanceScore: 88
      }
    ]
  },
  documents: [
    {
      id: "doc-1",
      name: "Property Management Certification (CPM)",
      type: "Certification",
      date: "Expires: December 31, 2025",
      icon: "bx bx-certification"
    },
    {
      id: "doc-2",
      name: "Employment Contract",
      type: "Contract",
      date: "Signed: January 15, 2022", 
      icon: "bx bx-file"
    },
    {
      id: "doc-3",
      name: "Background Check Report",
      type: "Background Check",
      date: "Completed: January 10, 2022",
      icon: "bx bx-shield"
    },
    {
      id: "doc-4",
      name: "Performance Review 2024",
      type: "Performance Review",
      date: "Date: October 15, 2024",
      icon: "bx bx-award"
    },
    {
      id: "doc-5",
      name: "Real Estate License",
      type: "License",
      date: "License #: RE-2020-45678 • Expires: June 30, 2025",
      icon: "bx bx-id-card"
    }
  ],
  contact: {
    primary: {
      name: "John Smith",
      phone: "+1 (555) 123-4567", 
      email: "john.smith@property.com"
    },
    office: {
      address: "123 Main Street, Suite 100",
      city: "New York, NY 10001",
      hours: "Mon-Fri: 8AM-5PM"
    },
    emergency: {
      name: "Emily Johnson (Spouse)",
      phone: "+1 (555) 123-4568",
      relationship: "Spouse"
    },
    manager: {
      name: "Sarah Wilson",
      phone: "+1 (555) 987-6543",
      email: "sarah.wilson@property.com"
    }
  }
};

export const useGetEmployee = (cuid: string, employeeId: string) => {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, return mock data regardless of IDs
        // In real implementation, this would make an API call
        setEmployee(mockEmployeeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee');
      } finally {
        setIsLoading(false);
      }
    };

    if (cuid && employeeId) {
      fetchEmployee();
    }
  }, [cuid, employeeId]);

  return {
    employee,
    isLoading,
    error,
    refetch: () => {
      if (cuid && employeeId) {
        setEmployee(null);
        setIsLoading(true);
        setError(null);
      }
    }
  };
};