export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_premium: boolean
          nome: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          is_premium?: boolean
          nome?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_premium?: boolean
          nome?: string | null
        }
        Relationships: []
      }
      resultados_provas: {
        Row: {
          acertos: number
          area: string
          created_at: string | null
          id: string
          nota: number
          tempo_gasto: number | null
          total_questoes: number
          user_id: string
        }
        Insert: {
          acertos: number
          area: string
          created_at?: string | null
          id?: string
          nota: number
          tempo_gasto?: number | null
          total_questoes: number
          user_id: string
        }
        Update: {
          acertos?: number
          area?: string
          created_at?: string | null
          id?: string
          nota?: number
          tempo_gasto?: number | null
          total_questoes?: number
          user_id?: string
        }
        Relationships: []
      }
      resultados_redacoes: {
        Row: {
          competencia_1: number | null
          competencia_2: number | null
          competencia_3: number | null
          competencia_4: number | null
          competencia_5: number | null
          created_at: string | null
          id: string
          nota_total: number
          tema: string
          user_id: string
        }
        Insert: {
          competencia_1?: number | null
          competencia_2?: number | null
          competencia_3?: number | null
          competencia_4?: number | null
          competencia_5?: number | null
          created_at?: string | null
          id?: string
          nota_total: number
          tema: string
          user_id: string
        }
        Update: {
          competencia_1?: number | null
          competencia_2?: number | null
          competencia_3?: number | null
          competencia_4?: number | null
          competencia_5?: number | null
          created_at?: string | null
          id?: string
          nota_total?: number
          tema?: string
          user_id?: string
        }
        Relationships: []
      }
      tempo_estudo: {
        Row: {
          created_at: string | null
          data: string | null
          id: string
          materia: string
          minutos: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          id?: string
          materia: string
          minutos: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: string | null
          id?: string
          materia?: string
          minutos?: number
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          actions_count: number
          created_at: string | null
          date: string
          id: string
          user_id: string
        }
        Insert: {
          actions_count?: number
          created_at?: string | null
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          actions_count?: number
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          created_at: string
          email_cliente: string | null
          evento: string | null
          id: string
          moeda: string | null
          nome_cliente: string | null
          payload: Json | null
          produto: string | null
          status: string | null
          transacao_id: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          email_cliente?: string | null
          evento?: string | null
          id?: string
          moeda?: string | null
          nome_cliente?: string | null
          payload?: Json | null
          produto?: string | null
          status?: string | null
          transacao_id?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          email_cliente?: string | null
          evento?: string | null
          id?: string
          moeda?: string | null
          nome_cliente?: string | null
          payload?: Json | null
          produto?: string | null
          status?: string | null
          transacao_id?: string | null
          valor?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_user_activity: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
