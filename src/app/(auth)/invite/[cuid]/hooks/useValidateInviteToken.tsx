"use client";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { parseError } from "@src/utils/helpers";
import { invitationService } from "@services/index";
import { useNotification } from "@hooks/useNotification";

export function useValidateInviteToken() {
  const [isLoading, setIsLoading] = useState(false);
  const { openNotification } = useNotification();

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
    validateToken,
    isLoading,
  };
}
