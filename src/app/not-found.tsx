import {
  AuthLayoutWrapper,
  AuthContentHeader,
  AuthContentBody,
  AuthContentBox,
} from "@components/AuthLayout";
import Link from "next/link";
import React from "react";

const Custom404 = () => {
  return (
    <AuthLayoutWrapper>
      <AuthContentBox className="auth-page_left-box">
        <div className="copy-text">
          <h1>Got lost?</h1>
          <p>
            We can&apos;t seem to find the page you&apos;re looking for. Let us
            help you get back on track.
          </p>
        </div>
      </AuthContentBox>
      <AuthContentBox className="auth-page_right-box">
        <AuthContentHeader
          title="404"
          subtitle="Oops! The page you're looking for doesn't exist."
        />
        <AuthContentBody>
          <div className="error-illustration">
            <i
              className="bx bx-map-alt"
              style={{
                fontSize: "8rem",
                color: "#062f4f",
                display: "block",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            ></i>
          </div>
          <p>
            The page you&apos;re looking for may have been moved, deleted, or
            doesn&apos;t exist. Make sure you&apos;ve entered the correct URL or
            try navigating back to the home page.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Link href="/" className="btn btn-primary">
              <i className="bx bx-home-alt"></i>
              Back to Home
            </Link>
          </div>
        </AuthContentBody>
      </AuthContentBox>
    </AuthLayoutWrapper>
  );
};

export default Custom404;
