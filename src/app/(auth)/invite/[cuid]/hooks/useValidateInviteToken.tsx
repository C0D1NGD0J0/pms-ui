"use client";
import { useCallback, useState } from "react";
import { parseError } from "@src/utils/helpers";
import { invitationService } from "@services/index";
import { useNotification } from "@hooks/useNotification";

export function useValidateInviteToken() {
  const { openNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const validateToken = useCallback(
    async ({ cuid, token }: { cuid: string; token: string }) => {
      try {
        setIsLoading(true);
        const result = await invitationService.validateInvitationToken(
          cuid,
          token
        );

        return { success: true, ...result };
      } catch (error) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    isLoading,
    validateToken,
  };
}
