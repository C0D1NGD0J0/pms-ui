import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@services/index";
import { StaticPropertyFormConfig } from "@interfaces/property.interface";

export function usePropertyFormMetaData() {
  return useQuery<StaticPropertyFormConfig>({
    queryKey: ["propertyFormMetadata"],
    queryFn: async () => {
      const { data } = await propertyService.getPropertyFormMetaData();
      return data;
    },
    staleTime: 1000 * 60 * 60, // cache for an hour
  });
}
