import { create } from "zustand";
import { Sell } from "../supabase/collections";
import { NewSell, SELL_STATUS, UpdateSell } from "./types/sell";
import { createJSONStorage, persist } from "zustand/middleware";
import { To } from "react-router-dom";
import { displayAlert } from "@/utils/service";
import { getUserId } from "@/utils/localStorage";
import { supabase } from "@/supabase";
import { CustomError } from "@/utils/error/customError";

interface SaleStat {
  isLoading: boolean;
  errorMessage: string | null;
  sells: Sell[];
  createSell: (newSale: NewSell, navigate: (path: To) => void) => void;
  getSells: (isAll: boolean) => void;
  updateSell: (
    updateProperty: UpdateSell,
    navigate: (path: To) => void
  ) => void;
  archiveSell: (id: number) => void;
  restoreSell: (id: number) => void;
  permanentDelete: (id: number) => void;
}

export const useSellStore = create<SaleStat>()(
  persist(
    (set) => ({
      isLoading: false,
      errorMessage: null,
      sells: [] as Sell[],
      createSell: async (
        newSellData: NewSell,
        navigate: (path: string | number | To) => void
      ) => {
        set({ isLoading: true });
        try {
          const userId = getUserId();
          const { error: newSellsError } = await supabase.from("sells").insert({
            title: newSellData.title,
            price: newSellData.price,
            description: newSellData.description,
            isFurnished: newSellData.isFurnished,
            propertyId: newSellData.propertyId,
            status: SELL_STATUS.ACTIVE,
            userId: userId,
          });

          if (newSellsError) {
            throw new CustomError(
              "Error while creating sell",
              newSellsError.code
            );
          }

          displayAlert("New Sale Added Successfully");
          navigate(-1);
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      getSells: async (isAll: boolean) => {
        set({ isLoading: true });
        try {
          let sells: Sell[] = [];

          const userId = getUserId();

          const query = supabase.from("sells").select(`*`);

          if (!isAll) {
            query.eq("userId", userId);
          }

          const { data, error } = await query;

          if (error) {
            throw new CustomError(
              "Error while fetching properties",
              error.code
            );
          }

          sells = data.map((sell) => {
            const newSell: Sell = {
              id: sell.id,
              title: sell.title,
              created_at: sell.created_at,
              description: sell.description,
              price: sell.price,
              propertyId: sell.propertyId,
              userId: sell.userId,
              isFurnished: sell.isFurnished,
              status: SELL_STATUS.ACTIVE,
              isDeleted: sell.isDeleted,
            };
            return newSell;
          });

          set({ sells });
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      updateSell: async (
        updatedSellData: UpdateSell,
        navigate: (path: To | number) => void
      ) => {
        set({ isLoading: true });
        try {
          const userId = getUserId();
          const { error: updateSellsError } = await supabase
            .from("sells")
            .update({
              title: updatedSellData.title,
              price: updatedSellData.price,
              description: updatedSellData.description,
              isFurnished: updatedSellData.isFurnished,
              propertyId: updatedSellData.propertyId,
              status: updatedSellData.status,
              userId: userId,
            })
            .eq("id", updatedSellData.id);

          if (updateSellsError) {
            throw new CustomError(
              "Error while creating sell",
              updateSellsError.code
            );
          }

          displayAlert("Update  Post Successfully");
          navigate(-1);
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      archiveSell: async (id: number) => {
        set({ isLoading: true });
        try {
          const { error: updateSellsError } = await supabase
            .from("sells")
            .update({
              isDeleted: true,
            })
            .eq("id", id);

          if (updateSellsError) {
            throw new CustomError(
              "Error while archiving sell",
              updateSellsError.code
            );
          }
          let sells: Sell[] = [];

          const userId = getUserId();

          const { data, error } = await supabase
            .from("sells")
            .select(`*`)
            .eq("userId", userId);

          if (error) {
            throw new CustomError(
              "Error while fetching properties",
              error.code
            );
          }

          sells = data.map((sell) => {
            const newSell: Sell = {
              id: sell.id,
              title: sell.title,
              created_at: sell.created_at,
              description: sell.description,
              price: sell.price,
              propertyId: sell.propertyId,
              userId: sell.userId,
              isFurnished: sell.isFurnished,
              status: SELL_STATUS.ACTIVE,
              isDeleted: sell.isDeleted,
            };
            return newSell;
          });

          set({ sells });

          displayAlert("Sell archived Successfully");
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      restoreSell: async (id: number) => {
        set({ isLoading: true });
        try {
          const { error: updateSellsError } = await supabase
            .from("sells")
            .update({
              isDeleted: false,
            })
            .eq("id", id);

          if (updateSellsError) {
            throw new CustomError(
              "Error while restoring sell",
              updateSellsError.code
            );
          }
          let sells: Sell[] = [];

          const userId = getUserId();

          const { data, error } = await supabase
            .from("sells")
            .select(`*`)
            .eq("userId", userId);

          if (error) {
            throw new CustomError(
              "Error while fetching properties",
              error.code
            );
          }

          sells = data.map((sell) => {
            const newSell: Sell = {
              id: sell.id,
              title: sell.title,
              created_at: sell.created_at,
              description: sell.description,
              price: sell.price,
              propertyId: sell.propertyId,
              userId: sell.userId,
              isFurnished: sell.isFurnished,
              status: SELL_STATUS.ACTIVE,
              isDeleted: sell.isDeleted,
            };
            return newSell;
          });

          set({ sells });

          displayAlert("Sell Restore Successfully");
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      permanentDelete: async (id: number) => {
        set({ isLoading: true });
        try {
          const { error: updateSellsError } = await supabase
            .from("sells")
            .delete()
            .eq("id", id);

          if (updateSellsError) {
            throw new CustomError(
              "Error while deleting sell",
              updateSellsError.code
            );
          }
          let sells: Sell[] = [];

          const userId = getUserId();

          const { data, error } = await supabase
            .from("sells")
            .select(`*`)
            .eq("userId", userId);

          if (error) {
            throw new CustomError(
              "Error while fetching properties",
              error.code
            );
          }

          sells = data.map((sell) => {
            const newSell: Sell = {
              id: sell.id,
              title: sell.title,
              created_at: sell.created_at,
              description: sell.description,
              price: sell.price,
              propertyId: sell.propertyId,
              userId: sell.userId,
              isFurnished: sell.isFurnished,
              status: SELL_STATUS.ACTIVE,
              isDeleted: sell.isDeleted,
            };
            return newSell;
          });

          set({ sells });

          displayAlert("Sell Permanently Deleted Successfully");
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "Sell",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
