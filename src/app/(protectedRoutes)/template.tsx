"use client";
import { useEffect, Suspense } from "react";
import { Loading } from "@components/Loading";
import { EventTypes } from "@services/events";
import { Skeleton } from "@components/Skeleton";
import { useAuthActions } from "@store/auth.store";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useIdleDetector, usePublish } from "@hooks/index";
import { useLoadingManager } from "@hooks/useLoadingManager";
import { useSearchParams, useRouter } from "next/navigation";

function AuthTemplateContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const publish = usePublish();
  const { setClient } = useAuthActions();
  const { setProcessingInvite, setIdleSession, loadingMessage, isLoading } =
    useLoadingManager();
  const isIdle: boolean = useIdleDetector(10);
  const {
    isLoggedIn,
    refreshUser,
    user,
    isLoading: isAuthLoading,
  } = useCurrentUser();

  useEffect(() => {
    const fromInvite = searchParams.get("fromInvite");
    const accountCuid = searchParams.get("accountCuid");
    const accountName = searchParams.get("accountName");

    if (fromInvite === "true" && accountCuid && accountName) {
      const setupAuthFromInvite = async () => {
        try {
          setProcessingInvite(true);
          const selectedAccount = {
            cuid: accountCuid,
            displayName: accountName,
          };

          publish(EventTypes.GET_CURRENT_USER, selectedAccount);
          router.replace("/dashboard");
        } catch (error) {
          void error;
          setProcessingInvite(false);
          router.push("/login?error=invite-setup-failed");
        }
      };

      setupAuthFromInvite();
    }
  }, [searchParams, setClient, publish, router, setProcessingInvite]);

  useEffect(() => {
    if (isLoading && user && !isAuthLoading) {
      setProcessingInvite(false);
    }
  }, [isLoading, user, isAuthLoading, setProcessingInvite]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isIdle && !isLoggedIn) {
      setIdleSession(true);
      timeoutId = setTimeout(() => {
        return push("/login");
      }, 5000);
    }

    if (!isLoggedIn) {
      timeoutId = setTimeout(() => {
        return push("/login");
      }, 5000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isIdle, isLoggedIn, setIdleSession]);

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

  if (!isLoggedIn || isLoading) {
    return <Loading size="fullscreen" description={loadingMessage} />;
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
