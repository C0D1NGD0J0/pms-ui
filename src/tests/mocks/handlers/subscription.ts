import { rest } from "msw";

// Mock data
const mockSubscriptionPlans = [
  {
    planId: "essential",
    planName: "Essential",
    description: "Basic plan for small properties",
    pricing: {
      monthly: {
        priceId: "price_essential_monthly",
        lookUpKey: "essential_monthly",
        priceInCents: 0,
        displayPrice: "$0",
      },
      annual: {
        priceId: "price_essential_annual",
        lookUpKey: "essential_annual",
        priceInCents: 0,
        displayPrice: "$0",
      },
    },
    limits: {
      properties: 1,
      units: 10,
      seats: 1,
    },
    features: ["1 property", "10 units", "1 user seat"],
  },
  {
    planId: "growth",
    planName: "Growth",
    description: "Perfect for growing property managers",
    pricing: {
      monthly: {
        priceId: "price_growth_monthly",
        lookUpKey: "growth_monthly",
        priceInCents: 799,
        displayPrice: "$7.99",
      },
      annual: {
        priceId: "price_growth_annual",
        lookUpKey: "growth_annual",
        priceInCents: 76800,
        displayPrice: "$768.00",
      },
    },
    limits: {
      properties: 5,
      units: 50,
      seats: 3,
    },
    seatPricing: {
      lookUpKeys: {
        monthly: "growth_seats_monthly",
        annual: "growth_seats_annual",
      },
      monthly: {
        priceInCents: 799,
        displayPrice: "$7.99",
      },
      annual: {
        priceInCents: 76800,
        displayPrice: "$768.00",
      },
    },
    features: ["5 properties", "50 units", "3 user seats", "Additional seats available"],
  },
  {
    planId: "portfolio",
    planName: "Portfolio",
    description: "For professional property management companies",
    pricing: {
      monthly: {
        priceId: "price_portfolio_monthly",
        lookUpKey: "portfolio_monthly",
        priceInCents: 599,
        displayPrice: "$5.99",
      },
      annual: {
        priceId: "price_portfolio_annual",
        lookUpKey: "portfolio_annual",
        priceInCents: 144000,
        displayPrice: "$1,440.00",
      },
    },
    limits: {
      properties: 999,
      units: 999,
      seats: 10,
    },
    seatPricing: {
      lookUpKeys: {
        monthly: "portfolio_seats_monthly",
        annual: "portfolio_seats_annual",
      },
      monthly: {
        priceInCents: 599,
        displayPrice: "$5.99",
      },
      annual: {
        priceInCents: 144000,
        displayPrice: "$1,440.00",
      },
    },
    features: ["Unlimited properties", "Unlimited units", "10 user seats", "Additional seats available"],
  },
];

// In-memory state for testing
const subscriptionState = {
  currentPlan: "growth",
  additionalSeats: 2,
  usage: {
    properties: 3,
    units: 15,
    seats: 4, // 3 included + 1 additional occupied
  },
};

export const subscriptionHandlers = [
  // GET /api/v1/subscriptions/plans
  rest.get("/api/v1/subscriptions/plans", (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: mockSubscriptionPlans,
      })
    );
  }),

  // GET /api/v1/subscriptions/:cuid/plan-usage
  rest.get("/api/v1/subscriptions/:cuid/plan-usage", (req, res, ctx) => {

    const currentPlan = mockSubscriptionPlans.find(
      (p) => p.planId === subscriptionState.currentPlan
    );

    if (!currentPlan) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: "Plan not found",
        })
      );
    }

    const includedSeats = currentPlan.limits.seats;
    const additionalSeats = subscriptionState.additionalSeats;
    const currentSeats = subscriptionState.usage.seats;
    const totalAllowed = includedSeats + additionalSeats;

    return res(
      ctx.json({
        success: true,
        data: {
          plan: {
            name: currentPlan.planName,
            status: "active",
            billingInterval: "monthly",
            startDate: "2025-01-01T00:00:00.000Z",
            endDate: "2025-02-01T00:00:00.000Z",
          },
          usage: subscriptionState.usage,
          limits: currentPlan.limits,
          isLimitReached: {
            properties: subscriptionState.usage.properties >= currentPlan.limits.properties,
            units: subscriptionState.usage.units >= currentPlan.limits.units,
            seats: currentSeats >= totalAllowed,
          },
          seatInfo: {
            includedSeats,
            additionalSeats,
            totalAllowed,
            maxAdditionalSeats: 50,
            additionalSeatPriceCents: currentPlan.seatPricing?.monthly.priceInCents || 0,
            availableForPurchase: 50 - additionalSeats,
          },
        },
      })
    );
  }),

  // POST /api/v1/subscriptions/:cuid/seats
  rest.post("/api/v1/subscriptions/:cuid/seats", async (req, res, ctx) => {
    const { seatDelta } = req.body as { seatDelta: number };

    const currentPlan = mockSubscriptionPlans.find(
      (p) => p.planId === subscriptionState.currentPlan
    );

    if (!currentPlan?.seatPricing) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          message: "Seat pricing not available for this plan",
        })
      );
    }

    const includedSeats = currentPlan.limits.seats;
    const currentSeats = subscriptionState.usage.seats;
    const newAdditionalSeats = subscriptionState.additionalSeats + seatDelta;

    // Validation: cannot remove more than available
    if (seatDelta < 0) {
      const maxCanRemove = Math.max(0, includedSeats + subscriptionState.additionalSeats - currentSeats);
      if (Math.abs(seatDelta) > maxCanRemove) {
        return res(
          ctx.status(400),
          ctx.json({
            success: false,
            message: `Cannot remove ${Math.abs(seatDelta)} seats. You can only remove ${maxCanRemove} seats (currently using ${currentSeats} of ${includedSeats + subscriptionState.additionalSeats} seats).`,
          })
        );
      }
    }

    // Validation: cannot exceed max additional seats
    if (newAdditionalSeats > 50) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          message: "Cannot exceed maximum of 50 additional seats",
        })
      );
    }

    // Update state
    subscriptionState.additionalSeats = newAdditionalSeats;

    const seatPriceCents = currentPlan.seatPricing.monthly.priceInCents;
    const additionalSeatsCost = newAdditionalSeats * seatPriceCents;

    return res(
      ctx.json({
        success: true,
        message: seatDelta > 0 ? "Seats added successfully" : "Seats removed successfully",
        data: {
          additionalSeatsCount: newAdditionalSeats,
          additionalSeatsCost: additionalSeatsCost,
          totalMonthlyPrice: currentPlan.pricing.monthly.priceInCents + additionalSeatsCost,
          currentSeats,
          billingInterval: "monthly" as const,
          paymentGateway: {
            seatItemId: "si_mock_seat_item",
          },
        },
      })
    );
  }),

  // POST /api/v1/subscriptions/:cuid/init-subscription-payment
  rest.post("/api/v1/subscriptions/:cuid/init-subscription-payment", (req, res, ctx) => {
    const { cuid } = req.params;

    return res(
      ctx.json({
        success: true,
        message: "Checkout session created",
        data: {
          checkoutUrl: `https://checkout.stripe.com/c/pay/mock-session-${cuid}`,
          sessionId: `cs_test_mock_session_${cuid}_${Date.now()}`,
        },
      })
    );
  }),

  // DELETE /api/v1/subscriptions/:cuid/cancel-subscription
  rest.delete("/api/v1/subscriptions/:cuid/cancel-subscription", (req, res, ctx) => {
    const { cuid } = req.params;

    return res(
      ctx.json({
        success: true,
        message: "Subscription canceled successfully",
        data: {
          _id: `sub_${cuid}`,
          status: "canceled",
          canceledAt: new Date().toISOString(),
          planName: subscriptionState.currentPlan,
        },
      })
    );
  }),

  // POST /api/v1/subscriptions/:cuid/downgrade-to-essential
  rest.post("/api/v1/subscriptions/:cuid/downgrade-to-essential", (req, res, ctx) => {

    subscriptionState.currentPlan = "essential";
    subscriptionState.additionalSeats = 0;

    return res(
      ctx.json({
        success: true,
        message: "Successfully downgraded to Essential plan",
        data: {
          subscription: {
            planName: "Essential",
            status: "active",
          },
        },
      })
    );
  }),
];

// Helper function to reset subscription state between tests
export function resetSubscriptionState() {
  subscriptionState.currentPlan = "growth";
  subscriptionState.additionalSeats = 2;
  subscriptionState.usage = {
    properties: 3,
    units: 15,
    seats: 4,
  };
}
