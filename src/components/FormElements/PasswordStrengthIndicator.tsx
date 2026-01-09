import React, { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

type StrengthLevel = "weak" | "fair" | "good" | "strong";

interface StrengthResult {
  level: StrengthLevel;
  score: number;
  label: string;
}

const calculatePasswordStrength = (password: string): StrengthResult => {
  if (!password) {
    return { level: "weak", score: 0, label: "" };
  }

  let score = 0;

  // Length check
  if (password.length >= 8) score++;

  // Uppercase letter
  if (/[A-Z]/.test(password)) score++;

  // Lowercase letter
  if (/[a-z]/.test(password)) score++;

  // Number
  if (/[0-9]/.test(password)) score++;

  // Special character
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let level: StrengthLevel;
  let label: string;

  if (score <= 2) {
    level = "weak";
    label = "Weak";
  } else if (score === 3) {
    level = "fair";
    label = "Fair";
  } else if (score === 4) {
    level = "good";
    label = "Good";
  } else {
    level = "strong";
    label = "Strong";
  }

  return { level, score: Math.min(score, 4), label };
};

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password }) => {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  if (!password) {
    return null;
  }

  return (
    <div className="password-strength">
      <div className="password-strength__bars">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`password-strength__bar ${
              bar <= strength.score
                ? `password-strength__bar--active-${strength.level}`
                : ""
            }`}
          />
        ))}
      </div>
      <span className={`password-strength__label password-strength__label--${strength.level}`}>
        {strength.label}
      </span>
    </div>
  );
};

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordRequirementsProps {
  password: string;
  confirmPassword?: string;
}

const requirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    test: (pwd) => pwd.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: "One lowercase letter",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: "One number",
    test: (pwd) => /[0-9]/.test(pwd),
  },
];

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  confirmPassword,
}) => {
  const passwordsMatch =
    confirmPassword !== undefined && password === confirmPassword && password;

  return (
    <div className="password-requirements">
      <div className="password-requirements__title">Password must contain:</div>
      <ul className="password-requirements__list">
        {requirements.map((req, index) => {
          const isValid = req.test(password);
          return (
            <li
              key={index}
              className={`password-requirements__item ${
                isValid
                  ? "password-requirements__item--valid"
                  : "password-requirements__item--invalid"
              }`}
            >
              <i className={`bx ${isValid ? "bx-check-circle" : "bx-circle"}`}></i>
              {req.label}
            </li>
          );
        })}
        {confirmPassword !== undefined && (
          <li
            className={`password-requirements__item ${
              passwordsMatch
                ? "password-requirements__item--valid"
                : "password-requirements__item--invalid"
            }`}
          >
            <i
              className={`bx ${passwordsMatch ? "bx-check-circle" : "bx-circle"}`}
            ></i>
            Passwords match
          </li>
        )}
      </ul>
    </div>
  );
};
