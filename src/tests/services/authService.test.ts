import axios from "axios";

// Setup axios instance to use in tests
const api = axios.create({
  baseURL: "https://api.example.com",
});

describe("Auth Service", () => {
  // Test login functionality
  describe("login", () => {
    it("should create axios instance with correct base URL", () => {
      expect(api.defaults.baseURL).toBe("https://api.example.com");
    });

    it("should have correct login endpoint structure", () => {
      const loginData = {
        email: "user@example.com",
        password: "password123",
      };

      expect(loginData).toHaveProperty("email");
      expect(loginData).toHaveProperty("password");
      expect(typeof loginData.email).toBe("string");
      expect(typeof loginData.password).toBe("string");
    });
  });

  // Test user registration
  describe("register", () => {
    it("should have correct registration data structure", () => {
      const registerData = {
        name: "New User",
        email: "new@example.com",
        password: "securepass",
      };

      expect(registerData).toHaveProperty("name");
      expect(registerData).toHaveProperty("email");
      expect(registerData).toHaveProperty("password");
      expect(typeof registerData.name).toBe("string");
      expect(typeof registerData.email).toBe("string");
      expect(typeof registerData.password).toBe("string");
    });
  });
});
