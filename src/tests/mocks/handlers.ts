import { HttpResponse, http } from "msw";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";

export const handlers = [
  // Auth handlers
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json(
      {
        user: {
          id: "1",
          email: "user@example.com",
          name: "Test User",
        },
        token: "mock-jwt-token",
      },
      { status: 200 }
    );
  }),

  // Property handlers
  http.get(`${API_URL}/properties`, () => {
    return HttpResponse.json(
      {
        properties: [
          {
            id: "1",
            title: "Beach Villa",
            description: "Beautiful beachfront property",
            price: 1500000,
            location: "Miami, FL",
            bedrooms: 4,
            bathrooms: 3,
            area: 2500,
          },
          {
            id: "2",
            title: "Mountain Cabin",
            description: "Cozy cabin in the mountains",
            price: 750000,
            location: "Aspen, CO",
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
          },
        ],
      },
      { status: 200 }
    );
  }),
];
