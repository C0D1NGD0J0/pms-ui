import axios from "@configs/axios";
import { PaginateResult, FilteredUser } from "@interfaces/user.interface";

import { mockEmployees } from "../../data/mockEmployees";

export interface IEmployeeFilterParams {
  search?: string;
  department?: string;
  role?: string;
  status?: "active" | "inactive" | "pending";
  page?: number;
  limit?: number;
  sortBy?: "name" | "department" | "role" | "startDate";
  sortOrder?: "asc" | "desc";
}

export interface IEmployeeResponse {
  data: {
    users: FilteredUser[];
    pagination: PaginateResult;
  };
}

class EmployeeService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/users`;

  constructor() {}

  async getEmployees(cuid: string, params?: IEmployeeFilterParams): Promise<IEmployeeResponse> {
    try {
      // For now, use mock data - later this will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      let filteredEmployees = [...mockEmployees];
      
      // Apply search filter
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredEmployees = filteredEmployees.filter(emp => 
          emp.fullName?.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          emp.employeeInfo?.jobTitle?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply department filter
      if (params?.department) {
        filteredEmployees = filteredEmployees.filter(emp => 
          emp.employeeInfo?.department === params.department
        );
      }
      
      // Apply role filter
      if (params?.role) {
        filteredEmployees = filteredEmployees.filter(emp => 
          emp.roles.includes(params.role as any)
        );
      }
      
      // Apply status filter
      if (params?.status) {
        if (params.status === "active") {
          filteredEmployees = filteredEmployees.filter(emp => emp.isActive);
        } else if (params.status === "inactive") {
          filteredEmployees = filteredEmployees.filter(emp => !emp.isActive);
        }
      }
      
      // Apply sorting
      if (params?.sortBy && params?.sortOrder) {
        filteredEmployees.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (params.sortBy) {
            case "name":
              aValue = a.fullName || "";
              bValue = b.fullName || "";
              break;
            case "department":
              aValue = a.employeeInfo?.department || "";
              bValue = b.employeeInfo?.department || "";
              break;
            case "role":
              aValue = a.employeeInfo?.jobTitle || "";
              bValue = b.employeeInfo?.jobTitle || "";
              break;
            case "startDate":
              aValue = new Date(a.employeeInfo?.startDate || a.createdAt);
              bValue = new Date(b.employeeInfo?.startDate || b.createdAt);
              break;
            default:
              return 0;
          }
          
          if (params.sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
      
      return {
        data: {
          users: paginatedEmployees,
          pagination: {
            total: filteredEmployees.length,
            page,
            limit,
            pages: Math.ceil(filteredEmployees.length / limit),
            hasNextPage: endIndex < filteredEmployees.length,
            hasPrevPage: page > 1,
          } as PaginateResult,
        },
      };
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  }

  async getEmployee(cuid: string, employeeId: string): Promise<FilteredUser> {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/employee/${employeeId}`,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw error;
    }
  }

  async updateEmployee(cuid: string, employeeId: string, data: Partial<FilteredUser>): Promise<FilteredUser> {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/employee/${employeeId}`,
        data,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  }

  async updateEmployeeStatus(cuid: string, employeeId: string, isActive: boolean): Promise<FilteredUser> {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/employee/${employeeId}/status`,
        { isActive },
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error updating employee status:", error);
      throw error;
    }
  }
}

export const employeeService = new EmployeeService();