import { HttpResponse, http } from "msw";

export const authHandlers = [
  // Login endpoint - single account
  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    // Single account user
    if (email === "single@example.com" && password === "password123") {
      return HttpResponse.json(
        {
          success: true,
          msg: "Login successful",
          accounts: [
            {
              cuid: "client-123",
              clientDisplayName: "Test Company",
            },
          ],
          activeAccount: {
            cuid: "client-123",
            clientDisplayName: "Test Company",
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

    // Multiple accounts user
    if (email === "multi@example.com" && password === "password123") {
      return HttpResponse.json(
        {
          success: true,
          msg: "Multiple accounts found",
          accounts: [
            {
              cuid: "client-123",
              clientDisplayName: "Company A",
            },
            {
              cuid: "client-456",
              clientDisplayName: "Company B",
            },
            {
              cuid: "client-789",
              clientDisplayName: "Company C",
            },
          ],
          activeAccount: null,
        },
        { status: 200 }
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
  http.get("/api/v1/auth/:cuid/me", async ({ params }) => {
    const { cuid } = params;

    if (cuid === "client-123") {
      return HttpResponse.json(
        {
          success: true,
          data: {
            user: {
              uid: "user-123",
              email: "single@example.com",
              firstName: "Test",
              lastName: "User",
              role: "admin",
            },
            client: {
              cuid: "client-123",
              companyName: "Test Company",
            },
            permissions: ["read:users", "create:properties"],
          },
        },
        { status: 200 }
      );
    }

    if (cuid === "client-456") {
      return HttpResponse.json(
        {
          success: true,
          data: {
            user: {
              uid: "user-456",
              email: "multi@example.com",
              firstName: "Multi",
              lastName: "Account",
              role: "manager",
            },
            client: {
              cuid: "client-456",
              companyName: "Company B",
            },
            permissions: ["read:users"],
          },
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }),

  // Logout endpoint
  http.delete("/api/v1/auth/:cuid/logout", async () => {
    return HttpResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  }),
];
