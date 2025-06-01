import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@services/index";

export function usePropertyFormMetaData<T>(formType: string) {
  return useQuery<T>({
    queryKey: ["/propertyFormMetadata", formType],
    queryFn: async ({ queryKey }) => {
      const [, formType] = queryKey;
      if (!formType) {
        return;
      }
      const { data } = await propertyService.getPropertyFormMetaData(
        formType as string
      );
      return data;
    },
    staleTime: 1000 * 60 * 60, // cache for an hour
  });
}
