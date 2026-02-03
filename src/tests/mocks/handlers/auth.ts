import { rest } from "msw";

export const authHandlers = [
  // Login endpoint - single account
  rest.post("/api/v1/auth/login", (req, res, ctx) => {
    const { email, password } = req.body as { email: string; password: string };

    // Single account user
    if (email === "single@example.com" && password === "password123") {
      return res(
        ctx.status(200),
        ctx.cookie("auth-token", "mock-jwt-token", { httpOnly: true, path: "/" }),
        ctx.json({
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
        })
      );
    }

    // Multiple accounts user
    if (email === "multi@example.com" && password === "password123") {
      return res(
        ctx.status(200),
        ctx.json({
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
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        message: "Invalid credentials",
      })
    );
  }),

  // Register endpoint
  rest.post("/api/v1/auth/signup", (req, res, ctx) => {
    const { email, firstName, lastName } = req.body as {
      email: string;
      firstName: string;
      lastName: string;
    };

    return res(
      ctx.status(201),
      ctx.json({
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
      })
    );
  }),

  // Forgot password endpoint
  rest.post("/api/v1/auth/forgot_password", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: "Password reset email sent successfully",
      })
    );
  }),

  // Reset password endpoint
  rest.post("/api/v1/auth/reset_password/:token", (req, res, ctx) => {
    const { token } = req.params;

    if (token === "valid-reset-token") {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          message: "Password reset successfully",
        })
      );
    }

    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        message: "Invalid or expired reset token",
      })
    );
  }),

  // Account activation endpoint
  rest.post("/api/v1/auth/account_activation/:cuid", (req, res, ctx) => {
    const { cuid } = req.params;

    if (cuid === "valid-activation-code") {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          message: "Account activated successfully",
          data: {
            user: {
              uid: "activated-user-123",
              email: "activated@example.com",
              isActive: true,
            },
          },
        })
      );
    }

    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        message: "Invalid activation code",
      })
    );
  }),

  // Validate invitation token
  rest.get("/api/v1/invite/validate/:cuid", (req, res, ctx) => {
    const { cuid } = req.params;

    if (cuid === "valid-invite-token") {
      return res(
        ctx.status(200),
        ctx.json({
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
        })
      );
    }

    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        message: "Invalid or expired invitation",
      })
    );
  }),

  // Accept invitation endpoint
  rest.post("/api/v1/invite/accept/:cuid", (req, res, ctx) => {
    const { email, firstName, lastName } = req.body as {
      email: string;
      firstName: string;
      lastName: string;
    };
    const { cuid } = req.params;

    if (cuid === "valid-invite-token") {
      return res(
        ctx.status(201),
        ctx.json({
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
        })
      );
    }

    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        message: "Invalid invitation token",
      })
    );
  }),

  // Decline invitation endpoint
  rest.post("/api/v1/invite/decline/:cuid", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: "Invitation declined successfully",
      })
    );
  }),

  // Current user endpoint
  rest.get("/api/v1/auth/:cuid/me", (req, res, ctx) => {
    const { cuid } = req.params;

    if (cuid === "client-123") {
      return res(
        ctx.status(200),
        ctx.json({
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
        })
      );
    }

    if (cuid === "client-456") {
      return res(
        ctx.status(200),
        ctx.json({
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
        })
      );
    }

    return res(
      ctx.status(404),
      ctx.json({
        success: false,
        message: "User not found",
      })
    );
  }),

  // Logout endpoint
  rest.delete("/api/v1/auth/:cuid/logout", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: "Logged out successfully",
      })
    );
  }),
];
