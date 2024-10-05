import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Property } from "../supabase/collections";
import { NewProperty, UpdateProperty } from "./types/property";
import { supabase } from "@/supabase";
import { CustomError } from "@/utils/error/customError";
import { displayAlert } from "@/utils/service";
import { To } from "react-router-dom";
import { getUserId } from "@/utils/localStorage";

interface PropertyStat {
  isLoading: boolean;
  errorMessage: string | null;
  properties: Property[];
  isPropertiesLoaded: boolean;
  updateIsPropertyLoaded: () => void;
  createProperty: (
    newProperty: NewProperty,
    navigate: (path: To) => void
  ) => void;
  getProperties: () => void;
  updateProperty: (
    updateProperty: UpdateProperty,
    navigate: (path: To) => void
  ) => void;
  deleteProperty: () => void;
}

export const usePropertyStore = create<PropertyStat>()(
  persist(
    (set) => ({
      isLoading: false,
      errorMessage: null,
      isPropertiesLoaded: false,
      properties: [] as Property[],
      updateIsPropertyLoaded: () => {
        set({ isPropertiesLoaded: true });
      },
      createProperty: async (
        newPropertyData: NewProperty,
        navigate: (path: string | number) => void
      ) => {
        set({ isLoading: true });
        try {
          const imageLinks: string[] = [];

          // Use Promise.all to wait for all image uploads to complete
          await Promise.all(
            newPropertyData.images.map(async (image: File) => {
              const fileExt = image.name.split(".").pop();
              const filePath = `${Math.random()}.${fileExt}`;
              const { data, error } = await supabase.storage
                .from("realestate")
                .upload(filePath, image, {
                  cacheControl: "3600",
                  upsert: false,
                });
              if (error) {
                throw error;
              }
              imageLinks.push(data?.fullPath);
            })
          );

          const userId = getUserId();
          const { data: newProperty, error: newPropertyError } = await supabase
            .from("property")
            .insert({
              title: newPropertyData.title,
              area: newPropertyData.area,
              country: newPropertyData.country,
              state: newPropertyData.state,
              city: newPropertyData.city,
              street: newPropertyData.street,
              latitude: newPropertyData.location?.lat,
              longitude: newPropertyData.location?.lng,
              isFurnished: newPropertyData.isFurnished,
              numberOfBathRooms: newPropertyData.numberOfBathRooms,
              numberOfBedRooms: newPropertyData.numberOfBedRooms,
              haveParking: newPropertyData.haveParking,
              status: newPropertyData.status,
              type: newPropertyData.type,
              description: newPropertyData.description,
              userId: userId,
            })
            .select();

          if (newPropertyError) {
            throw new CustomError(
              "Error while creating property",
              newPropertyError.code
            );
          }

          // Use Promise.all to wait for all image link inserts to complete
          await Promise.all(
            imageLinks.map((link) => {
              return supabase.from("propertyImages").insert({
                url: link,
                propertyId: newProperty[0].id, // Get the id from the inserted property
              });
            })
          );

          displayAlert("New Property Added Successfully");
          navigate(-1);
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      getProperties: async () => {
        set({ isLoading: true });
        try {
          let properties: Property[] = [];

          const userId = getUserId();

          const { data, error } = await supabase
            .from("property")
            .select(`*, propertyImages(*)`)
            .eq("userId", userId);

          if (error) {
            throw new CustomError(
              "Error while fetching properties",
              error.code
            );
          }
          // get all property images from supabase storage
          properties = data.map((property) => {
            const newProperty: Property = {
              id: property.id,
              title: property.title,
              area: property.area,
              country: property.country,
              state: property.state,
              city: property.city,
              street: property.street,
              latitude: property.latitude,
              longitude: property.longitude,
              isFurnished: property.isFurnished,
              numberOfBathRooms: property.numberOfBathRooms,
              numberOfBedRooms: property.numberOfBedRooms,
              haveParking: property.haveParking,
              status: property.status,
              type: property.type,
              description: property.description ?? "",
              created_at: property.created_at,
              propertyImages: property.propertyImages.map((image) => {
                return `https://zrqqgebfdbqxzkpnhccr.supabase.co/storage/v1/object/public/${image.url!}`;
              }),
            };
            return newProperty;
          });
          set({ properties: properties, isPropertiesLoaded: true });
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      updateProperty: async (
        updatedPropertyData: UpdateProperty,
        navigate: (path: string | number) => void
      ) => {
        set({ isLoading: true });
        try {
          const imageLinks: string[] = [];

          // Use Promise.all to wait for all image uploads to complete
          if (updatedPropertyData.images.length > 0) {
            await Promise.all(
              updatedPropertyData?.images.map(async (image: File) => {
                const fileExt = image.name.split(".").pop();
                const filePath = `${Math.random()}.${fileExt}`;
                const { data, error } = await supabase.storage
                  .from("realestate")
                  .upload(filePath, image, {
                    cacheControl: "3600",
                    upsert: false,
                  });
                if (error) {
                  throw error;
                }
                imageLinks.push(data?.fullPath);
              })
            );
            // Use Promise.all to wait for all image link inserts to complete
            await Promise.all(
              imageLinks.map((link) => {
                return supabase.from("propertyImages").insert({
                  url: link,
                  propertyId: Number(updatedPropertyData.id), // Get the id from the inserted property
                });
              })
            );
          }

          const userId = getUserId();
          const { error: newPropertyError } = await supabase
            .from("property")
            .update({
              title: updatedPropertyData.title,
              area: updatedPropertyData.area,
              country: updatedPropertyData.country,
              state: updatedPropertyData.state,
              city: updatedPropertyData.city,
              street: updatedPropertyData.street,
              latitude: updatedPropertyData.location?.lat,
              longitude: updatedPropertyData.location?.lng,
              isFurnished: updatedPropertyData.isFurnished,
              numberOfBathRooms: updatedPropertyData.numberOfBathRooms,
              numberOfBedRooms: updatedPropertyData.numberOfBedRooms,
              haveParking: updatedPropertyData.haveParking,
              status: updatedPropertyData.status,
              type: updatedPropertyData.type,
              description: updatedPropertyData.description,
              userId: userId,
            })
            .eq("id", updatedPropertyData.id);

          if (newPropertyError) {
            throw new CustomError(
              "Error while creating property",
              newPropertyError.code
            );
          }

          displayAlert("Property Updated Successfully");
          navigate(-1);
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      deleteProperty: async () => {},
    }),
    {
      name: "property",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
