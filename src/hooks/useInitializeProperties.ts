import { useEffect } from "react";
import { usePropertyStore } from "@/store/property";
import { getUserId } from "@/utils/localStorage";
import { useAuthenticationStore } from "@/store/authentication";

export const useInitializeProperties = () => {
  const { getProperties, isPropertiesLoaded } = usePropertyStore();
  const isLoggedOut = useAuthenticationStore((store) => store.isLoggedOut);
  const userId = getUserId();

  useEffect(() => {
    if (!isPropertiesLoaded && !isLoggedOut && userId !== null) {
      getProperties();
    }
  }, [isPropertiesLoaded, getProperties, isLoggedOut, userId]);
};
