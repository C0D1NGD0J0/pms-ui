/**
 * Payment Processor Status
 * Information about property manager's Stripe Connect account status
 */
export interface PaymentProcessor {
  isSetup: boolean; // Does PaymentProcessor record exist?
  chargesEnabled: boolean; // Has PM completed KYC verification?
  needsOnboarding: boolean; // Needs to complete Stripe KYC?
}

/**
 * Create Stripe Connect Account Request
 */
export interface CreateConnectAccountRequest {
  email: string; // Property manager's business email
  country: string; // 2-letter ISO country code (e.g., "US", "CA", "GB")
  businessType: "individual" | "company";
}

/**
 * Create Stripe Connect Account Response
 */
export interface CreateConnectAccountResponse {
  success: boolean;
  data: {
    accountId: string; // Stripe Connect account ID (acct_xxx)
    chargesEnabled: boolean; // false (KYC not done yet)
    payoutsEnabled: boolean; // false
    detailsSubmitted: boolean; // false
  };
}

/**
 * Onboarding Link Response
 */
export interface OnboardingLinkResponse {
  success: boolean;
  data: {
    url: string; // Stripe onboarding URL
    expiresAt: number; // Unix timestamp
  };
}

/**
 * Dashboard Link Response
 */
export interface DashboardLinkResponse {
  success: boolean;
  data: {
    url: string; // Stripe Express dashboard URL
    expiresAt: number; // Unix timestamp
  };
}
