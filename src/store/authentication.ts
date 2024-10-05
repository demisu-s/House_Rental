import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LoginData, RegisterData, UserProfile } from "./types";
import { supabase } from "@/supabase";
import {
  clearLocalStorage,
  getUserId,
  setAccessToken,
  setUserId,
} from "@/utils/localStorage";
import { CustomError } from "@/utils/error/customError";
import { displayAlert } from "@/utils/service";
import { To } from "react-router-dom";
import { UpdateUserProfile } from "./types/authentication";

interface AuthenticationState {
  authenticatedUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isLoggedOut: boolean;
  errorMessage: string | null;
  signUp: (registerData: RegisterData) => void;
  signIn: (logInData: LoginData) => void;
  signOut: () => void;
  updateUserProfile: (
    userProfile: UpdateUserProfile,
    navigate: (path: To) => void
  ) => void;
}

export const useAuthenticationStore = create<AuthenticationState>()(
  persist(
    (set) => ({
      authenticatedUser: null,
      userProfile: null,
      isLoading: false,
      isLoggedOut: true,
      errorMessage: null,
      signUp: async (registerData: RegisterData) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signUp({
            email: registerData.email,
            password: registerData.password,
          });

          if (error) {
            throw new CustomError("Error signing up", error.code);
          }

          const { error: profileError } = await supabase
            .from("users")
            .insert({
              email: registerData.email,
              firstName: registerData.firstName,
              lastName: registerData.lastName,
              mainPhoneNumber: registerData.primaryPhoneNumber,
            })
            .single();

          if (profileError) {
            throw new CustomError(
              "Error creating user profile",
              profileError.code
            );
          }
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      signIn: async (logInData: LoginData) => {
        set({ isLoading: true });

        try {
          // const { data, error } = await supabase.auth.signInWithPassword({
          //   email: logInData.email,
          //   password: logInData.password,
          // });

          // const { data: userProfile, error: profileError } = await supabase
          //   .from("users")
          //   .select("*")
          //   .eq("email", String(data.user?.email))
          //   .single();

          // if (error || profileError) {
          //   throw new CustomError("Error while logging in", error?.message);
          // }
          const { data, error } = await supabase.rpc(
            "update_company_id_for_all_people",
            {
              people_table_name: "SSOT Ppl",
              company_table_name: "SSOT Comp",
            }
          );
          if (data) {
            displayAlert("Login Successfully");
          } else {
            displayAlert(error.message);
          }

          // setAccessToken(data.session?.access_token || "");
          // setUserId(userProfile.id);

          // set({
          //   userProfile,
          //   authenticatedUser: data.user,
          //   isLoggedOut: false,
          // });
        } catch (error) {
          const err = error as CustomError;
          displayAlert(err.message, "error");
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      signOut: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            throw new CustomError("Error signing out", error.code);
          }
          displayAlert("Logout Successfully");
          set({ isLoggedOut: true });
          set({ authenticatedUser: null, userProfile: null });
          clearLocalStorage();
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      updateUserProfile: async (
        userData: UpdateUserProfile,
        navigate: (path: To | number) => void
      ) => {
        set({ isLoading: true });
        try {
          const userId = getUserId();

          let userImageUrl = "";
          if (userData.image) {
            const fileExt = userData.image.name.split(".").pop();
            const filePath = `${Math.random()}.${fileExt}`;
            const { data: userImage, error } = await supabase.storage
              .from("realestate")
              .upload(filePath, userData.image, {
                cacheControl: "3600",
                upsert: false,
              });
            if (error) {
              throw error;
            }

            userImageUrl = `https://zrqqgebfdbqxzkpnhccr.supabase.co/storage/v1/object/public/${userImage.fullPath}`;
          }

          const { data: userProfile, error: updateProfileError } =
            await supabase
              .from("users")
              .update({
                firstName: userData.firstName,
                lastName: userData.lastName,
                mainPhoneNumber: userData.mainPhoneNumber,
                secondaryPhoneNumber: userData.secondaryPhoneNumber,
                bio: userData.bio,
                imageUrl: userImageUrl,
              })
              .eq("id", Number(userId))
              .select()
              .single();

          if (updateProfileError) {
            displayAlert("Error while updating user profile", "error");
            throw new CustomError(
              "Error while updating user profile",
              updateProfileError.code
            );
          }

          displayAlert("User Profile Updated Successfully");
          set({ userProfile: userProfile });
          navigate(-1);
        } catch (error) {
          const err = error as CustomError;
          set({ errorMessage: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "authentication",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
