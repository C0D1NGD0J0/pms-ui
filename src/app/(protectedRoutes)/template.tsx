"use client";
import { Loading } from "@components/Loading";
import { EventTypes } from "@services/events";
import { Skeleton } from "@components/Skeleton";
import { useAuthActions } from "@store/auth.store";
import { useEffect, useState, Suspense } from "react";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useIdleDetector, usePublish } from "@hooks/index";
import { useSearchParams, useRouter } from "next/navigation";

function AuthTemplateContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const publish = usePublish();
  const { setClient } = useAuthActions();
  const [loaderMessage, setLoaderMessage] = useState("Authenticating");
  const [isProcessingInvite, setIsProcessingInvite] = useState(false);
  const isIdle: boolean = useIdleDetector(10);
  const {
    isLoggedIn,
    refreshUser,
    user,
    isLoading: isAuthLoading,
  } = useCurrentUser();

  // Handle invite completion logic
  useEffect(() => {
    const fromInvite = searchParams.get("fromInvite");
    const accountCuid = searchParams.get("accountCuid");
    const accountName = searchParams.get("accountName");

    if (fromInvite === "true" && accountCuid && accountName) {
      setLoaderMessage("Setting up your account...");
      const setupAuthFromInvite = async () => {
        try {
          setIsProcessingInvite(true);
          const selectedAccount = {
            cuid: accountCuid,
            displayName: accountName,
          };

          publish(EventTypes.GET_CURRENT_USER, selectedAccount);
          router.replace("/dashboard");
        } catch (error) {
          void error;
          setIsProcessingInvite(false);
          router.push("/login?error=invite-setup-failed");
        }
      };

      setupAuthFromInvite();
    }
  }, [searchParams, setClient, publish, router]);

  // Hide loading when auth setup is complete
  useEffect(() => {
    if (isProcessingInvite && user && !isAuthLoading) {
      setIsProcessingInvite(false);
    }
  }, [isProcessingInvite, user, isAuthLoading]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isIdle && !isLoggedIn) {
      timeoutId = setTimeout(() => {
        setLoaderMessage("Idle session detected");
        return push("/login");
      }, 5000);
    }

    if (!isLoggedIn) {
      timeoutId = setTimeout(() => {
        setLoaderMessage("Login required to access this page.");
        return push("/login");
      }, 5000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIdle, isLoggedIn]);

  if (isLoggedIn && isIdle) {
    return (
      <Loading
        size="fullscreen"
        description="User inactivity detected"
        customBtn={
          <button
            className="btn btn-rounded btn-sm btn-primary"
            onClick={() => refreshUser()}
          >
            resume session
          </button>
        }
      />
    );
  }

  if (!isLoggedIn || isProcessingInvite) {
    return <Loading size="fullscreen" description={loaderMessage} />;
  }

  return <>{children}</>;
}

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Skeleton active paragraph={{ rows: 8 }} />}>
      <AuthTemplateContent>{children}</AuthTemplateContent>
    </Suspense>
  );
}
