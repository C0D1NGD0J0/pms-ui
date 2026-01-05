"use client";
import React, { useEffect } from "react";
import { Loading } from "@components/Loading";
import { Skeleton } from "@src/components/Skeleton";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { usePathname, useRouter } from "next/navigation";
import { useLoadingManager } from "@hooks/useLoadingManager";
import { AuthLayoutWrapper, AuthContentBox } from "@components/AuthLayout";

interface MetaInfo {
  title: string;
  description?: string;
  icon?: string;
}

interface BoxOrderMapping {
  [key: string]: {
    position: ("left" | "right" | "full")[];
    meta: MetaInfo;
  };
}
interface LeftBoxProps {
  meta: MetaInfo;
}

interface RightBoxProps {
  children: React.ReactNode;
}

const routeToBoxOrder: BoxOrderMapping = {
  "/login": {
    position: ["left", "right"],
    meta: {
      title: "Login",
      description: "Login to your account",
      icon: "",
    },
  },
  "/register": {
    position: ["left", "right"],
    meta: {
      title: "Manage with ease",
      description: "Create a new account as a property owner/manager",
      icon: "",
    },
  },
  "/reset_password": {
    position: ["right", "left"],
    meta: {
      title: "Reset Password",
      description: "Reset your password.",
      icon: "",
    },
  },
  "/forgot_password": {
    position: ["right", "left"],
    meta: {
      title: "",
      description: "Forgot your password? No worries, we got you.",
      icon: "",
    },
  },
  "/account_activation": {
    position: ["left", "right"],
    meta: {
      title: "",
      description:
        "Almost there! Just like finding your keys in your pocket after searching everywhere.",
      icon: "",
    },
  },
  "/invite": {
    position: ["full"],
    meta: {
      title: "You're Invited!",
      description: "Join our property management platform",
      icon: "",
    },
  },
};

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { setInitializing, isLoading, loadingMessage } = useLoadingManager();
  const { isLoggedIn, isLoading: isAuthLoading } = useCurrentUser();

  useEffect(() => {
    setInitializing(true);
  }, [setInitializing]);

  useEffect(() => {
    if (isLoggedIn && !isAuthLoading) {
      setInitializing(false);
      push("/dashboard");
    }

    if (!isLoggedIn && !isAuthLoading) {
      setInitializing(false);
    }
  }, [isLoggedIn, isAuthLoading, setInitializing]);

  const LeftBox: React.FC<LeftBoxProps> = ({ meta }) => (
    <AuthContentBox className="auth-page_left-box">
      <div className="copy-text">
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </div>
    </AuthContentBox>
  );

  const RightBox: React.FC<RightBoxProps> = ({ children }) => (
    <AuthContentBox className="auth-page_right-box">{children}</AuthContentBox>
  );

  const FullBox: React.FC<RightBoxProps> = ({ children }) => (
    <AuthContentBox className="auth-page_full-box">{children}</AuthContentBox>
  );

  const currentConfig = routeToBoxOrder[
    pathname.match(/^\/[^/]+/)?.[0] || ""
  ] || {
    position: ["left", "right"],
  };
  const boxOrder = currentConfig.position;
  const boxes = {
    left: <LeftBox meta={currentConfig.meta} />,
    right: <RightBox>{children}</RightBox>,
    full: <FullBox>{children}</FullBox>,
  };
  if (isLoading || isLoggedIn) {
    return (
      <AuthLayoutWrapper>
        <Loading description={loadingMessage} size="fullscreen" />
      </AuthLayoutWrapper>
    );
  }

  if (pathname === "/invite" && !isLoggedIn) {
    return (
      <AuthLayoutWrapper>
        <Skeleton className="auth-page_skeleton" />
      </AuthLayoutWrapper>
    );
  }
  return (
    <AuthLayoutWrapper>
      {boxOrder.map((boxKey, index) => (
        <React.Fragment key={index}>{boxes[boxKey]}</React.Fragment>
      ))}
    </AuthLayoutWrapper>
  );
};

export default AuthPageLayout;
