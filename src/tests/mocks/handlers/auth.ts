import { HttpResponse, http } from "msw";

export const authHandlers = [
  // Login endpoint
  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (email === "test@example.com" && password === "password123") {
      return HttpResponse.json(
        {
          success: true,
          message: "Login successful",
          data: {
            user: {
              uid: "test-user-123",
              email: "test@example.com",
              firstName: "Test",
              lastName: "User",
              role: "admin",
              isActive: true,
            },
            client: {
              cuid: "test-client-123",
              companyName: "Test Company",
              isActive: true,
            },
            permissions: ["read:users", "create:properties", "edit:properties"],
          },
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": "auth-token=mock-jwt-token; HttpOnly; Path=/",
          },
        }
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 }
    );
  }),

  // Register endpoint
  http.post("/api/v1/auth/signup", async ({ request }) => {
    const body = await request.json();
    const { email, firstName, lastName } = body as {
      email: string;
      firstName: string;
      lastName: string;
    };

    return HttpResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          user: {
            uid: "new-user-123",
            email,
            firstName,
            lastName,
          },
        },
      },
      { status: 201 }
    );
  }),

  // Forgot password endpoint
  http.post("/api/v1/auth/forgot_password", async ({ request }) => {
    await request.json();

    return HttpResponse.json(
      {
        success: true,
        message: "Password reset email sent successfully",
      },
      { status: 200 }
    );
  }),

  // Reset password endpoint
  http.post(
    "/api/v1/auth/reset_password/:token",
    async ({ request, params }) => {
      await request.json();
      const { token } = params;

      if (token === "valid-reset-token") {
        return HttpResponse.json(
          {
            success: true,
            message: "Password reset successfully",
          },
          { status: 200 }
        );
      }

      return HttpResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }
  ),

  // Account activation endpoint
  http.post("/api/v1/auth/account_activation/:cuid", async ({ params }) => {
    const { cuid } = params;

    if (cuid === "valid-activation-code") {
      return HttpResponse.json(
        {
          success: true,
          message: "Account activated successfully",
          data: {
            user: {
              uid: "activated-user-123",
              email: "activated@example.com",
              isActive: true,
            },
          },
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: "Invalid activation code",
      },
      { status: 400 }
    );
  }),

  // Validate invitation token
  http.get("/api/v1/invite/validate/:cuid", async ({ params }) => {
    const { cuid } = params;

    if (cuid === "valid-invite-token") {
      return HttpResponse.json(
        {
          success: true,
          data: {
            invitation: {
              id: "invite-123",
              email: "invited@example.com",
              role: "staff",
              clientName: "Test Company",
              inviterName: "Admin User",
              expiresAt: new Date(
                Date.now() + 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          },
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: "Invalid or expired invitation",
      },
      { status: 400 }
    );
  }),

  // Accept invitation endpoint
  http.post("/api/v1/invite/accept/:cuid", async ({ request, params }) => {
    const body = await request.json();
    const { email, firstName, lastName } = body as {
      email: string;
      firstName: string;
      lastName: string;
    };
    const { cuid } = params;

    if (cuid === "valid-invite-token") {
      return HttpResponse.json(
        {
          success: true,
          message: "Account created successfully",
          data: {
            user: {
              uid: "invited-user-123",
              email,
              firstName,
              lastName,
              role: "staff",
            },
            client: {
              cuid: "test-client-123",
              companyName: "Test Company",
            },
          },
        },
        { status: 201 }
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: "Invalid invitation token",
      },
      { status: 400 }
    );
  }),

  // Decline invitation endpoint
  http.post("/api/v1/invite/decline/:cuid", async () => {
    return HttpResponse.json(
      {
        success: true,
        message: "Invitation declined successfully",
      },
      { status: 200 }
    );
  }),

  // Current user endpoint
  http.get("/api/v1/auth/currentuser/:cuid", async ({ params }) => {
    const { cuid } = params;

    return HttpResponse.json(
      {
        success: true,
        data: {
          user: {
            uid: "current-user-123",
            email: "current@example.com",
            firstName: "Current",
            lastName: "User",
            role: "admin",
          },
          client: {
            cuid,
            companyName: "Test Company",
          },
          permissions: ["read:users", "create:properties"],
        },
      },
      { status: 200 }
    );
  }),

  // Logout endpoint
  http.post("/api/v1/auth/logout", async () => {
    return HttpResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  }),
];
