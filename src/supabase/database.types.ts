export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      property: {
        Row: {
          area: number | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          haveParking: boolean | null
          id: number
          isFurnished: boolean | null
          latitude: number | null
          longitude: number | null
          numberOfBathRooms: number | null
          numberOfBedRooms: number | null
          state: string | null
          status: string | null
          street: string | null
          title: string | null
          type: string | null
          userId: number | null
        }
        Insert: {
          area?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          haveParking?: boolean | null
          id?: number
          isFurnished?: boolean | null
          latitude?: number | null
          longitude?: number | null
          numberOfBathRooms?: number | null
          numberOfBedRooms?: number | null
          state?: string | null
          status?: string | null
          street?: string | null
          title?: string | null
          type?: string | null
          userId?: number | null
        }
        Update: {
          area?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          haveParking?: boolean | null
          id?: number
          isFurnished?: boolean | null
          latitude?: number | null
          longitude?: number | null
          numberOfBathRooms?: number | null
          numberOfBedRooms?: number | null
          state?: string | null
          status?: string | null
          street?: string | null
          title?: string | null
          type?: string | null
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      propertyImages: {
        Row: {
          created_at: string
          id: number
          propertyId: number | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          propertyId?: number | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          propertyId?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "propertyImages_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      rents: {
        Row: {
          availableForRent: string | null
          created_at: string
          description: string | null
          id: number
          isDeleted: boolean | null
          isFurnished: boolean | null
          paymentFrequency: string | null
          price: number | null
          propertyId: number | null
          title: string | null
          userId: number | null
        }
        Insert: {
          availableForRent?: string | null
          created_at?: string
          description?: string | null
          id?: number
          isDeleted?: boolean | null
          isFurnished?: boolean | null
          paymentFrequency?: string | null
          price?: number | null
          propertyId?: number | null
          title?: string | null
          userId?: number | null
        }
        Update: {
          availableForRent?: string | null
          created_at?: string
          description?: string | null
          id?: number
          isDeleted?: boolean | null
          isFurnished?: boolean | null
          paymentFrequency?: string | null
          price?: number | null
          propertyId?: number | null
          title?: string | null
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rents_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rents_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sells: {
        Row: {
          created_at: string
          description: string | null
          id: number
          isDeleted: boolean | null
          isFurnished: boolean | null
          price: number | null
          propertyId: number | null
          status: string | null
          title: string | null
          userId: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          isDeleted?: boolean | null
          isFurnished?: boolean | null
          price?: number | null
          propertyId?: number | null
          status?: string | null
          title?: string | null
          userId?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          isDeleted?: boolean | null
          isFurnished?: boolean | null
          price?: number | null
          propertyId?: number | null
          status?: string | null
          title?: string | null
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sells_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sells_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          firstName: string | null
          id: number
          imageUrl: string | null
          lastName: string | null
          mainPhoneNumber: string | null
          secondaryPhoneNumber: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          firstName?: string | null
          id?: number
          imageUrl?: string | null
          lastName?: string | null
          mainPhoneNumber?: string | null
          secondaryPhoneNumber?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          firstName?: string | null
          id?: number
          imageUrl?: string | null
          lastName?: string | null
          mainPhoneNumber?: string | null
          secondaryPhoneNumber?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
