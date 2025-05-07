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
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
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
          aliquota_cbs: number
          aliquota_ibs: number
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
          fornecedor_id: number | null
          id: number
          nome: string
          produto_id: number | null
          uf_id: number | null
        }
        Insert: {
          ano_final?: number | null
          ano_inicial?: number | null
          descricao?: string | null
          fornecedor_id?: number | null
          id?: number
          nome: string
          produto_id?: number | null
          uf_id?: number | null
        }
        Update: {
          ano_final?: number | null
          ano_inicial?: number | null
          descricao?: string | null
          fornecedor_id?: number | null
          id?: number
          nome?: string
          produto_id?: number | null
          uf_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cenarios_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cenarios_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cenarios_uf_id_fkey"
            columns: ["uf_id"]
            isOneToOne: false
            referencedRelation: "ufs"
            referencedColumns: ["id"]
          },
        ]
      }
      custos: {
        Row: {
          custo_armazenagem: number | null
          custo_compra: number | null
          custo_frete: number | null
          data_registro: string | null
          id: number
          produto_id: number
        }
        Insert: {
          custo_armazenagem?: number | null
          custo_compra?: number | null
          custo_frete?: number | null
          data_registro?: string | null
          id?: number
          produto_id: number
        }
        Update: {
          custo_armazenagem?: number | null
          custo_compra?: number | null
          custo_frete?: number | null
          data_registro?: string | null
          id?: number
          produto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          description: string
          icon: string | null
          id: string
          order_number: number
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description: string
          icon?: string | null
          id?: string
          order_number: number
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string
          icon?: string | null
          id?: string
          order_number?: number
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "features_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
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
          content: string | null
          id: string
          section: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          section: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          section?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homepage_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admins"
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
          gtin: string
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
          cenario_id: number
          dados_enviados_n8n: Json | null
          data_execucao: string | null
          id: number
          margem_desejada: number | null
          margem_liquida_ano: number[] | null
          preco_compra_maximo: number[] | null
          preco_venda_ano: number[] | null
          resultados_n8n: Json | null
        }
        Insert: {
          cenario_id: number
          dados_enviados_n8n?: Json | null
          data_execucao?: string | null
          id?: number
          margem_desejada?: number | null
          margem_liquida_ano?: number[] | null
          preco_compra_maximo?: number[] | null
          preco_venda_ano?: number[] | null
          resultados_n8n?: Json | null
        }
        Update: {
          cenario_id?: number
          dados_enviados_n8n?: Json | null
          data_execucao?: string | null
          id?: number
          margem_desejada?: number | null
          margem_liquida_ano?: number[] | null
          preco_compra_maximo?: number[] | null
          preco_venda_ano?: number[] | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
