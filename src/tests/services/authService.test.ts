import axios from "axios";
import { HttpResponse, http } from "msw";
import { server } from "@tests/mocks/server";

// Setup axios instance to use in tests
const api = axios.create({
  baseURL: "https://api.example.com",
});

describe("Auth Service", () => {
  // Test login functionality
  describe("login", () => {
    it("should login successfully and return user data with token", async () => {
      const loginData = {
        email: "user@example.com",
        password: "password123",
      };

      // The response is already handled by our default handlers in the mock server

      const response = await api.post("/auth/login", loginData);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        user: {
          id: "1",
          email: "user@example.com",
          name: "Test User",
        },
        token: "mock-jwt-token",
      });
    });

    it("should handle login failure", async () => {
      // Override the handler just for this test
      server.use(
        http.post("https://api.example.com/auth/login", () => {
          return HttpResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
          );
        })
      );

      const loginData = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      try {
        await api.post("/auth/login", loginData);
        // Should not reach here
        fail("Expected request to fail");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(401);
          expect(error.response?.data).toEqual({
            message: "Invalid credentials",
          });
        } else {
          fail("Expected axios error");
        }
      }
    });
  });

  // Test user registration
  describe("register", () => {
    beforeEach(() => {
      // Setup a handler for registration
      server.use(
        http.post("https://api.example.com/auth/register", () => {
          return HttpResponse.json(
            {
              user: {
                id: "2",
                email: "new@example.com",
                name: "New User",
              },
              message: "Registration successful",
            },
            { status: 201 }
          );
        })
      );
    });

    it("should register a new user successfully", async () => {
      const registerData = {
        name: "New User",
        email: "new@example.com",
        password: "securepass",
      };

      const response = await api.post("/auth/register", registerData);

      expect(response.status).toBe(201);
      expect(response.data).toEqual({
        user: {
          id: "2",
          email: "new@example.com",
          name: "New User",
        },
        message: "Registration successful",
      });
    });
  });
});
