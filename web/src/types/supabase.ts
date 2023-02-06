export interface Database {
  public: {
    Tables: {
      figma_users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          id: string;
          name?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string | null;
        };
      };
      images: {
        Row: {
          created_at: string | null;
          figma_user_id: string;
          id: number;
          parent_id: number | null;
          prompt: string | null;
          type: string | null;
          url: string;
        };
        Insert: {
          created_at?: string | null;
          figma_user_id: string;
          id?: number;
          parent_id?: number | null;
          prompt?: string | null;
          type?: string | null;
          url: string;
        };
        Update: {
          created_at?: string | null;
          figma_user_id?: string;
          id?: number;
          parent_id?: number | null;
          prompt?: string | null;
          type?: string | null;
          url?: string;
        };
      };
      profile: {
        Row: {
          created_at: string | null;
          id: number;
          interval: string | null;
          is_subscribed: boolean | null;
          stripe_customer: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          interval?: string | null;
          is_subscribed?: boolean | null;
          stripe_customer?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          interval?: string | null;
          is_subscribed?: boolean | null;
          stripe_customer?: string | null;
          user_id?: string | null;
        };
      };
      stats: {
        Row: {
          created_at: string | null;
          dall_e_2: number;
          openjourney: number;
          restore: number;
          upscale: number;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          dall_e_2?: number;
          openjourney?: number;
          restore?: number;
          upscale?: number;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          dall_e_2?: number;
          openjourney?: number;
          restore?: number;
          upscale?: number;
          user_id?: string;
        };
      };
      tokens: {
        Row: {
          created_at: string | null;
          hash: string;
          id: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          hash: string;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          hash?: string;
          id?: number;
          user_id?: string | null;
        };
      };
      users: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          image: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id: string;
          image?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          image?: string | null;
          name?: string | null;
        };
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      increment: {
        Args: {
          table_name: string;
          row_id: number;
          x: number;
          field_name: string;
        };
        Returns: undefined;
      };
      increment_stats: {
        Args: {
          table_name: string;
          user_id: string;
          x: number;
          field_name: string;
        };
        Returns: undefined;
      };
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
  };
}
