"use client";
import Link from "next/link";
import { useEffect } from "react";
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
  const isIdle: boolean = useIdleDetector(1);
  const { isLoggedIn, refreshUser } = useCurrentUser();

  useEffect(() => {
    if (isIdle) {
      if (isLoggedIn) {
        showAlert("User inactivity detected.");
        refreshUser();
      }

      if (!isLoggedIn) {
        showAlert("Session expired.");
        push("/login");
      }
    }
  }, [isIdle, isLoggedIn]);

  const showAlert = (msg: string) => {
    return <Loading size="fullscreen" description={msg} />;
  };

  if (!isLoggedIn) {
    return (
      <Loading
        size="fullscreen"
        description="Authenticating"
        customBtn={
          <Link className="btn btn-text" href={"/login"}>
            Back to login
          </Link>
        }
      />
    );
  }

  return <>{children}</>;
}
