"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { useIdleDetector } from "@hooks/useActive";
import { useCurrentUser } from "@hooks/useCurrentUser";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();
  const [loaderMessage, setLoaderMessage] = useState("Authenticating");
  const isIdle: boolean = useIdleDetector(10);
  const { isLoggedIn, refreshUser } = useCurrentUser();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isIdle && !isLoggedIn) {
      timeoutId = setTimeout(() => {
        setLoaderMessage("Logging out");
        return push("/login");
      }, 10000);
    }

    if (!isLoggedIn) {
      timeoutId = setTimeout(() => {
        setLoaderMessage("Logging out");
        push("/login");
      }, 15000);
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

  if (!isLoggedIn) {
    return <Loading size="fullscreen" description={loaderMessage} />;
  }

  return <>{children}</>;
}
