import { Rent } from "@/supabase/collections";
import { NewRent, UpdateRent } from "./types/rent";
import { To } from "react-router-dom";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getUserId } from "@/utils/localStorage";
import { supabase } from "@/supabase";
import { CustomError } from "@/utils/error/customError";
import { displayAlert } from "@/utils/service";

interface RentStat {
  isLoading: boolean;
  errorMessage: string | null;
  rents: Rent[];
  createRent: (newRent: NewRent, navigate: (path: To) => void) => void;
  getRents: (isAll: boolean) => void;
  updateRent: (updatedRent: UpdateRent, navigate: (path: To) => void) => void;
  archiveRent: (id: number) => void;
  restoreRent: (id: number) => void;
  permanentRentDelete: (id: number) => void;
}

export const useRentStore = create<RentStat>()(
  persist(
    (set) => ({
      isLoading: false,
      errorMessage: null,
      rents: [] as Rent[],
      createRent: async (
        newRentData: NewRent,
        navigate: (path: To | number) => void
      ) => {
        set({ isLoading: true });
        try {
          const userId = getUserId();
          const { error: newRentError } = await supabase.from("rents").insert({
            title: newRentData.title,
            price: newRentData.price,
            description: newRentData.description,
            isFurnished: newRentData.isFurnished,
            propertyId: newRentData.propertyId,
            availableForRent: newRentData.availableForRent,
            paymentFrequency: newRentData.paymentFrequency,
            userId: userId,
          });

          if (newRentError) {
            throw new CustomError(
              "Error while creating sell",
              newRentError.code
            );
          }

          displayAlert("New Rent Post Created Successfully");
          navigate(-1);
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      getRents: async (isAll: boolean) => {
        set({ isLoading: true });
        try {
          let rents: Rent[] = [];

          const userId = getUserId();

          const query = supabase.from("rents").select(`*`);

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

          rents = data.map((rent) => {
            const newRent: Rent = {
              id: rent.id,
              title: rent.title,
              created_at: rent.created_at,
              description: rent.description,
              price: rent.price,
              propertyId: rent.propertyId,
              userId: rent.userId,
              isFurnished: rent.isFurnished,
              availableForRent: rent.availableForRent,
              isDeleted: rent.isDeleted,
              paymentFrequency: rent.paymentFrequency,
            };
            return newRent;
          });
          set({ rents: rents });
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      updateRent: async (
        updatedRentData: UpdateRent,
        navigate: (path: To | number) => void
      ) => {
        set({ isLoading: true });
        try {
          const userId = getUserId();
          const { error: updateRentError } = await supabase
            .from("rents")
            .update({
              title: updatedRentData.title,
              price: updatedRentData.price,
              description: updatedRentData.description,
              isFurnished: updatedRentData.isFurnished,
              propertyId: updatedRentData.propertyId,
              availableForRent: updatedRentData.availableForRent,
              paymentFrequency: updatedRentData.paymentFrequency,
              userId: userId,
            })
            .eq("id", updatedRentData.id);

          if (updateRentError) {
            throw new CustomError(
              "Error while creating sell",
              updateRentError.code
            );
          }

          displayAlert("Rent Post Updated Successfully");
          navigate(-1);
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      archiveRent: async (id: number) => {
        set({ isLoading: true });
        try {
          const { error: updateRentError } = await supabase
            .from("rents")
            .update({
              isDeleted: true,
            })
            .eq("id", id);

          if (updateRentError) {
            throw new CustomError(
              "Error while archiving rent",
              updateRentError.code
            );
          }

          displayAlert("Rent archived Successfully");
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      restoreRent: async (id: number) => {
        set({ isLoading: true });
        try {
          const { error: updateRentError } = await supabase
            .from("rents")
            .update({
              isDeleted: false,
            })
            .eq("id", id);

          if (updateRentError) {
            throw new CustomError(
              "Error while restoring rent",
              updateRentError.code
            );
          }

          displayAlert("Rent Restored Successfully");
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      permanentRentDelete: async (id: number) => {
        set({ isLoading: true });
        try {
          const { error: updateRentError } = await supabase
            .from("rents")
            .delete()
            .eq("id", id);

          if (updateRentError) {
            throw new CustomError(
              "Error while deleting rent",
              updateRentError.code
            );
          }

          displayAlert("Rent Permanently Deleted Successfully");
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "rent",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
