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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      aliquotas_transicao: {
        Row: {
          aliquota_cbs: number
          aliquota_ibs: number
          ano: number
          id: number
        }
        Insert: {
          aliquota_cbs?: number
          aliquota_ibs?: number
          ano: number
          id?: number
        }
        Update: {
          aliquota_cbs?: number
          aliquota_ibs?: number
          ano?: number
          id?: number
        }
        Relationships: []
      }
      cenarios: {
        Row: {
          ano_final: number | null
          ano_inicial: number | null
          descricao: string | null
          id: number
          nome: string
          reducao_ibs: number | null
        }
        Insert: {
          ano_final?: number | null
          ano_inicial?: number | null
          descricao?: string | null
          id?: number
          nome: string
          reducao_ibs?: number | null
        }
        Update: {
          ano_final?: number | null
          ano_inicial?: number | null
          descricao?: string | null
          id?: number
          nome?: string
          reducao_ibs?: number | null
        }
        Relationships: []
      }
      features: {
        Row: {
          description: string
          icon: string | null
          id: string
          order_number: number | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string
          icon?: string | null
          id?: string
          order_number?: number | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string
          icon?: string | null
          id?: string
          order_number?: number | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          id: number
          nome: string
          perfil: string | null
          uf_id: number | null
        }
        Insert: {
          id?: number
          nome: string
          perfil?: string | null
          uf_id?: number | null
        }
        Update: {
          id?: number
          nome?: string
          perfil?: string | null
          uf_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_uf_id_fkey"
            columns: ["uf_id"]
            isOneToOne: false
            referencedRelation: "ufs"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_content: {
        Row: {
          content: string
          id: string
          section: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string
          id?: string
          section: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          id?: string
          section?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      implementation_checkpoints: {
        Row: {
          achieved_date: string | null
          baseline_value: number | null
          checkpoint_description: string | null
          checkpoint_name: string
          checkpoint_type: string
          created_at: string
          current_value: number
          id: string
          metric_name: string | null
          metric_unit: string | null
          notes: string | null
          order_index: number
          phase_id: string
          progress_percentage: number
          responsible: string | null
          status: string
          target_date: string | null
          target_value: number | null
          task_id: string | null
          updated_at: string
        }
        Insert: {
          achieved_date?: string | null
          baseline_value?: number | null
          checkpoint_description?: string | null
          checkpoint_name?: string
          checkpoint_type?: string
          created_at?: string
          current_value?: number
          id?: string
          metric_name?: string | null
          metric_unit?: string | null
          notes?: string | null
          order_index?: number
          phase_id: string
          progress_percentage?: number
          responsible?: string | null
          status?: string
          target_date?: string | null
          target_value?: number | null
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          achieved_date?: string | null
          baseline_value?: number | null
          checkpoint_description?: string | null
          checkpoint_name?: string
          checkpoint_type?: string
          created_at?: string
          current_value?: number
          id?: string
          metric_name?: string | null
          metric_unit?: string | null
          notes?: string | null
          order_index?: number
          phase_id?: string
          progress_percentage?: number
          responsible?: string | null
          status?: string
          target_date?: string | null
          target_value?: number | null
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "implementation_checkpoints_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "implementation_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "implementation_checkpoints_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "implementation_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      implementation_phases: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          created_at: string
          end_date: string | null
          estimated_duration_days: number | null
          id: string
          phase_description: string | null
          phase_name: string
          phase_number: number
          plan_id: string
          start_date: string | null
          target_month: number | null
          target_year: number | null
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          created_at?: string
          end_date?: string | null
          estimated_duration_days?: number | null
          id?: string
          phase_description?: string | null
          phase_name?: string
          phase_number?: number
          plan_id: string
          start_date?: string | null
          target_month?: number | null
          target_year?: number | null
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          created_at?: string
          end_date?: string | null
          estimated_duration_days?: number | null
          id?: string
          phase_description?: string | null
          phase_name?: string
          phase_number?: number
          plan_id?: string
          start_date?: string | null
          target_month?: number | null
          target_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "implementation_phases_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "implementation_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      implementation_plans: {
        Row: {
          company_name: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      implementation_progress_history: {
        Row: {
          checkpoint_id: string
          id: string
          notes: string | null
          progress_percentage: number
          recorded_at: string
          recorded_by: string | null
          recorded_value: number
        }
        Insert: {
          checkpoint_id: string
          id?: string
          notes?: string | null
          progress_percentage?: number
          recorded_at?: string
          recorded_by?: string | null
          recorded_value?: number
        }
        Update: {
          checkpoint_id?: string
          id?: string
          notes?: string | null
          progress_percentage?: number
          recorded_at?: string
          recorded_by?: string | null
          recorded_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "implementation_progress_history_checkpoint_id_fkey"
            columns: ["checkpoint_id"]
            isOneToOne: false
            referencedRelation: "implementation_checkpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      implementation_tasks: {
        Row: {
          actual_completion_date: string | null
          actual_hours: number | null
          actual_start_date: string | null
          attachments: Json | null
          challenges_faced: string | null
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          estimated_hours: number | null
          id: string
          is_completed: boolean
          lessons_learned: string | null
          order_index: number
          phase_id: string
          planning_notes: string | null
          priority: string
          responsible: string | null
          target_date: string | null
          target_month: number | null
          target_year: number | null
          task_description: string | null
          task_name: string
        }
        Insert: {
          actual_completion_date?: string | null
          actual_hours?: number | null
          actual_start_date?: string | null
          attachments?: Json | null
          challenges_faced?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          estimated_hours?: number | null
          id?: string
          is_completed?: boolean
          lessons_learned?: string | null
          order_index?: number
          phase_id: string
          planning_notes?: string | null
          priority?: string
          responsible?: string | null
          target_date?: string | null
          target_month?: number | null
          target_year?: number | null
          task_description?: string | null
          task_name?: string
        }
        Update: {
          actual_completion_date?: string | null
          actual_hours?: number | null
          actual_start_date?: string | null
          attachments?: Json | null
          challenges_faced?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          estimated_hours?: number | null
          id?: string
          is_completed?: boolean
          lessons_learned?: string | null
          order_index?: number
          phase_id?: string
          planning_notes?: string | null
          priority?: string
          responsible?: string | null
          target_date?: string | null
          target_month?: number | null
          target_year?: number | null
          task_description?: string | null
          task_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "implementation_tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "implementation_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria: string | null
          gtin: string
          id: number
          nome: string
          perfil_fornecedor: string | null
        }
        Insert: {
          categoria?: string | null
          gtin?: string
          id?: number
          nome: string
          perfil_fornecedor?: string | null
        }
        Update: {
          categoria?: string | null
          gtin?: string
          id?: number
          nome?: string
          perfil_fornecedor?: string | null
        }
        Relationships: []
      }
      simulacoes: {
        Row: {
          cenario_id: number | null
          dados_enviados_n8n: Json | null
          data_execucao: string | null
          id: string
          margem_desejada: number | null
          margem_liquida_ano: Json | null
          preco_compra_maximo: Json | null
          preco_venda_ano: Json | null
          resultados_n8n: Json | null
        }
        Insert: {
          cenario_id?: number | null
          dados_enviados_n8n?: Json | null
          data_execucao?: string | null
          id?: string
          margem_desejada?: number | null
          margem_liquida_ano?: Json | null
          preco_compra_maximo?: Json | null
          preco_venda_ano?: Json | null
          resultados_n8n?: Json | null
        }
        Update: {
          cenario_id?: number | null
          dados_enviados_n8n?: Json | null
          data_execucao?: string | null
          id?: string
          margem_desejada?: number | null
          margem_liquida_ano?: Json | null
          preco_compra_maximo?: Json | null
          preco_venda_ano?: Json | null
          resultados_n8n?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "simulacoes_cenario_id_fkey"
            columns: ["cenario_id"]
            isOneToOne: false
            referencedRelation: "cenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ufs: {
        Row: {
          id: number
          nome: string
          sigla: string
        }
        Insert: {
          id?: number
          nome: string
          sigla: string
        }
        Update: {
          id?: number
          nome?: string
          sigla?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
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
