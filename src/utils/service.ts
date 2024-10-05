import { toast } from "react-toastify";
import { RentData } from "@/store/types/rent";
import { SellData } from "@/store/types/sell";

type ToastType = "success" | "error";

export const displayAlert = (
  message: string | string[],
  type: ToastType = "success"
) => {
  const showToast = (text: string) => {
    if (type === "success") {
      toast.success(text);
    } else if (type === "error") {
      toast.error(text);
    }
  };

  if (Array.isArray(message)) {
    message.forEach(showToast);
  } else {
    showToast(message);
  }
};

export const isRentData = (item: RentData | SellData): item is RentData => {
  return "availableForRent" in item;
};

export const capitalizeFirstLetter = (str: string | null): string => {
  if (!str || str.trim() === "") {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
