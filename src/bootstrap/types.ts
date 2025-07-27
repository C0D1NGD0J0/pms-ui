export interface BootstrapInitializer {
  name: string;
  isReady: boolean;
  isLoading?: boolean;
  priority?: number; // Lower numbers initialize first
  error?: string | null;
}

export interface AppBootstrapProps {
  children: React.ReactNode;
  initializerStates?: BootstrapInitializer[];
  fallback?: React.ReactNode;
  enableDebug?: boolean;
}
