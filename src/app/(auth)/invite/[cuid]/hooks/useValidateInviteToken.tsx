"use client";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { parseError } from "@src/utils/helpers";
import { invitationService } from "@services/index";
import { useNotification } from "@hooks/useNotification";

export function useValidateInviteToken() {
  const { openNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const validateToken = useCallback(
    async ({ cuid, token }: { cuid: string; token: string }) => {
      setIsLoading(true);
      try {
        const result = await invitationService.validateInvitationToken(
          cuid,
          token
        );

        return { success: true, ...result };
      } catch (error) {
        // 429 errors are handled globally by axios interceptor
        // Check if it's a rate limit error and don't show duplicate notification
        if (error instanceof AxiosError && error.response?.status === 429) {
          return {
            success: false,
            rateLimited: true,
            data: null,
          };
        }

        const { fieldErrors, message, hasValidationErrors } =
          parseError(error) || {};
        openNotification(
          "error",
          "Validation Failed",
          hasValidationErrors
            ? `${Object.values(fieldErrors || {}).join(", ")}`
            : message
        );
        return {
          success: false,
          data: null,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [openNotification]
  );

  return {
    isLoading,
    validateToken,
  };
}
