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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          aliquota_cofins: number | null
          aliquota_ibs: number
          aliquota_icms: number | null
          aliquota_ipi: number | null
          aliquota_iss: number | null
          aliquota_pis: number | null
          ano: number
          id: number
        }
        Insert: {
          aliquota_cbs: number
          aliquota_cofins?: number | null
          aliquota_ibs: number
          aliquota_icms?: number | null
          aliquota_ipi?: number | null
          aliquota_iss?: number | null
          aliquota_pis?: number | null
          ano: number
          id?: number
        }
        Update: {
          aliquota_cbs?: number
          aliquota_cofins?: number | null
          aliquota_ibs?: number
          aliquota_icms?: number | null
          aliquota_ipi?: number | null
          aliquota_iss?: number | null
          aliquota_pis?: number | null
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
          reducao_ibs: number | null
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
          reducao_ibs?: number | null
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
          reducao_ibs?: number | null
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
      documentos: {
        Row: {
          arquivo_url: string | null
          created_at: string
          data_emissao: string | null
          data_validade: string | null
          empresa_id: string
          id: string
          numero: string
          observacoes: string | null
          orgao_emissor: string
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          empresa_id: string
          id?: string
          numero: string
          observacoes?: string | null
          orgao_emissor: string
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          empresa_id?: string
          id?: string
          numero?: string
          observacoes?: string | null
          orgao_emissor?: string
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_contabil"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string
          created_at: string | null
          email: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_complemento: string | null
          endereco_logradouro: string | null
          endereco_numero: string | null
          endereco_uf: string | null
          id: string
          is_associado: boolean
          negocio_principal: string | null
          nome_fantasia: string | null
          razao_social: string
          site: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cnpj: string
          created_at?: string | null
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          endereco_uf?: string | null
          id?: string
          is_associado?: boolean
          negocio_principal?: string | null
          nome_fantasia?: string | null
          razao_social: string
          site?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cnpj?: string
          created_at?: string | null
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          endereco_uf?: string | null
          id?: string
          is_associado?: boolean
          negocio_principal?: string | null
          nome_fantasia?: string | null
          razao_social?: string
          site?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      empresas_contabil: {
        Row: {
          cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome_fantasia: string
          observacoes: string | null
          razao_social: string
          status: string
          status_conformidade: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cnpj: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome_fantasia: string
          observacoes?: string | null
          razao_social: string
          status?: string
          status_conformidade?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome_fantasia?: string
          observacoes?: string | null
          razao_social?: string
          status?: string
          status_conformidade?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      funcionarios: {
        Row: {
          ativo: boolean
          cargo: string | null
          created_at: string
          email: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean
          cargo?: string | null
          created_at?: string
          email: string
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean
          cargo?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
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
      ia_actions: {
        Row: {
          created_at: string
          descricao: string
          detalhes: Json | null
          entidade_id: string | null
          entidade_tipo: string
          id: string
          status: string
          tipo_acao: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descricao: string
          detalhes?: Json | null
          entidade_id?: string | null
          entidade_tipo: string
          id?: string
          status?: string
          tipo_acao: string
          user_id: string
        }
        Update: {
          created_at?: string
          descricao?: string
          detalhes?: Json | null
          entidade_id?: string | null
          entidade_tipo?: string
          id?: string
          status?: string
          tipo_acao?: string
          user_id?: string
        }
        Relationships: []
      }
      ia_chat_messages: {
        Row: {
          created_at: string
          id: string
          mensagem: string
          metadata: Json | null
          resposta: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mensagem: string
          metadata?: Json | null
          resposta?: string | null
          tipo?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mensagem?: string
          metadata?: Json | null
          resposta?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      ia_config: {
        Row: {
          created_at: string
          dia_relatorio_mensal: number
          dia_relatorio_semanal: number
          frequencia_monitoramento: number
          id: string
          modelo: string
          nome_ia: string
          openai_api_key: string | null
          prompt_obrigacoes: string | null
          prompt_principal: string | null
          prompt_relatorios: string | null
          prompt_tarefas: string | null
          relatorios_ativos: boolean
          updated_at: string
          use_real_data: boolean
          user_id: string
          whatsapp_ativo: boolean
          whatsapp_numero: string | null
        }
        Insert: {
          created_at?: string
          dia_relatorio_mensal?: number
          dia_relatorio_semanal?: number
          frequencia_monitoramento?: number
          id?: string
          modelo?: string
          nome_ia?: string
          openai_api_key?: string | null
          prompt_obrigacoes?: string | null
          prompt_principal?: string | null
          prompt_relatorios?: string | null
          prompt_tarefas?: string | null
          relatorios_ativos?: boolean
          updated_at?: string
          use_real_data?: boolean
          user_id: string
          whatsapp_ativo?: boolean
          whatsapp_numero?: string | null
        }
        Update: {
          created_at?: string
          dia_relatorio_mensal?: number
          dia_relatorio_semanal?: number
          frequencia_monitoramento?: number
          id?: string
          modelo?: string
          nome_ia?: string
          openai_api_key?: string | null
          prompt_obrigacoes?: string | null
          prompt_principal?: string | null
          prompt_relatorios?: string | null
          prompt_tarefas?: string | null
          relatorios_ativos?: boolean
          updated_at?: string
          use_real_data?: boolean
          user_id?: string
          whatsapp_ativo?: boolean
          whatsapp_numero?: string | null
        }
        Relationships: []
      }
      implementation_checkpoints: {
        Row: {
          achieved_date: string | null
          baseline_value: number | null
          checkpoint_description: string | null
          checkpoint_name: string
          checkpoint_type: string | null
          created_at: string | null
          current_value: number | null
          id: string
          metric_name: string | null
          metric_unit: string | null
          notes: string | null
          order_index: number
          phase_id: string
          progress_percentage: number | null
          responsible: string | null
          status: string | null
          target_date: string | null
          target_value: number | null
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          achieved_date?: string | null
          baseline_value?: number | null
          checkpoint_description?: string | null
          checkpoint_name: string
          checkpoint_type?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          metric_name?: string | null
          metric_unit?: string | null
          notes?: string | null
          order_index?: number
          phase_id: string
          progress_percentage?: number | null
          responsible?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          achieved_date?: string | null
          baseline_value?: number | null
          checkpoint_description?: string | null
          checkpoint_name?: string
          checkpoint_type?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          metric_name?: string | null
          metric_unit?: string | null
          notes?: string | null
          order_index?: number
          phase_id?: string
          progress_percentage?: number | null
          responsible?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          task_id?: string | null
          updated_at?: string | null
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
          created_at: string | null
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
          created_at?: string | null
          end_date?: string | null
          estimated_duration_days?: number | null
          id?: string
          phase_description?: string | null
          phase_name: string
          phase_number: number
          plan_id: string
          start_date?: string | null
          target_month?: number | null
          target_year?: number | null
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          created_at?: string | null
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
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
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
          recorded_at: string | null
          recorded_by: string | null
          recorded_value: number
        }
        Insert: {
          checkpoint_id: string
          id?: string
          notes?: string | null
          progress_percentage: number
          recorded_at?: string | null
          recorded_by?: string | null
          recorded_value: number
        }
        Update: {
          checkpoint_id?: string
          id?: string
          notes?: string | null
          progress_percentage?: number
          recorded_at?: string | null
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
          created_at: string | null
          estimated_hours: number | null
          id: string
          is_completed: boolean | null
          lessons_learned: string | null
          order_index: number
          phase_id: string
          planning_notes: string | null
          priority: string | null
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
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          is_completed?: boolean | null
          lessons_learned?: string | null
          order_index?: number
          phase_id: string
          planning_notes?: string | null
          priority?: string | null
          responsible?: string | null
          target_date?: string | null
          target_month?: number | null
          target_year?: number | null
          task_description?: string | null
          task_name: string
        }
        Update: {
          actual_completion_date?: string | null
          actual_hours?: number | null
          actual_start_date?: string | null
          attachments?: Json | null
          challenges_faced?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          is_completed?: boolean | null
          lessons_learned?: string | null
          order_index?: number
          phase_id?: string
          planning_notes?: string | null
          priority?: string | null
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
      interacoes: {
        Row: {
          assunto: string | null
          created_at: string
          destinatario: string
          direcao: string
          empresa_id: string | null
          id: string
          mensagem: string
          metadata: Json | null
          obrigacao_id: string | null
          remetente: string
          status_entrega: string | null
          tarefa_id: string | null
          tipo: string
        }
        Insert: {
          assunto?: string | null
          created_at?: string
          destinatario: string
          direcao: string
          empresa_id?: string | null
          id?: string
          mensagem: string
          metadata?: Json | null
          obrigacao_id?: string | null
          remetente: string
          status_entrega?: string | null
          tarefa_id?: string | null
          tipo: string
        }
        Update: {
          assunto?: string | null
          created_at?: string
          destinatario?: string
          direcao?: string
          empresa_id?: string | null
          id?: string
          mensagem?: string
          metadata?: Json | null
          obrigacao_id?: string | null
          remetente?: string
          status_entrega?: string | null
          tarefa_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_contabil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_obrigacao_id_fkey"
            columns: ["obrigacao_id"]
            isOneToOne: false
            referencedRelation: "obrigacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_models: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_size: number
          id: string
          name: string
          predictions_count: number
          slug: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_size: number
          id?: string
          name: string
          predictions_count?: number
          slug: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number
          id?: string
          name?: string
          predictions_count?: number
          slug?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      obrigacoes: {
        Row: {
          created_at: string
          data_vencimento: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          observacoes: string | null
          periodicidade: string
          prioridade: string
          responsavel_id: string | null
          status: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          created_at?: string
          data_vencimento: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          observacoes?: string | null
          periodicidade: string
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          created_at?: string
          data_vencimento?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          observacoes?: string | null
          periodicidade?: string
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "obrigacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_contabil"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria: string | null
          empresa_id: string | null
          gtin: string
          id: number
          nome: string
          perfil_fornecedor: string | null
        }
        Insert: {
          categoria?: string | null
          empresa_id?: string | null
          gtin: string
          id?: number
          nome: string
          perfil_fornecedor?: string | null
        }
        Update: {
          categoria?: string | null
          empresa_id?: string | null
          gtin?: string
          id?: number
          nome?: string
          perfil_fornecedor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id: string
          nome?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      referencias: {
        Row: {
          created_at: string | null
          destinatario_id: string | null
          empresa_referenciada_id: string | null
          id: number
          item_id: number | null
          mensagem: string | null
          remetente_id: string | null
          resposta: string | null
          status: string | null
          tipo: string | null
          visualizada_em: string | null
        }
        Insert: {
          created_at?: string | null
          destinatario_id?: string | null
          empresa_referenciada_id?: string | null
          id?: number
          item_id?: number | null
          mensagem?: string | null
          remetente_id?: string | null
          resposta?: string | null
          status?: string | null
          tipo?: string | null
          visualizada_em?: string | null
        }
        Update: {
          created_at?: string | null
          destinatario_id?: string | null
          empresa_referenciada_id?: string | null
          id?: number
          item_id?: number | null
          mensagem?: string | null
          remetente_id?: string | null
          resposta?: string | null
          status?: string | null
          tipo?: string | null
          visualizada_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referencias_empresa_referenciada_id_fkey"
            columns: ["empresa_referenciada_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      referencias_clientes: {
        Row: {
          cliente_email: string
          cliente_nome: string
          cliente_telefone: string
          created_at: string | null
          data_fechamento: string | null
          descricao_necessidade: string | null
          destinatario_id: string
          empresa_referenciada_id: string
          id: number
          mensagem: string | null
          observacoes_resultado: string | null
          remetente_id: string
          respondida_em: string | null
          status: string | null
          updated_at: string | null
          valor_negocio: number | null
          visualizada_em: string | null
        }
        Insert: {
          cliente_email: string
          cliente_nome: string
          cliente_telefone: string
          created_at?: string | null
          data_fechamento?: string | null
          descricao_necessidade?: string | null
          destinatario_id: string
          empresa_referenciada_id: string
          id?: number
          mensagem?: string | null
          observacoes_resultado?: string | null
          remetente_id: string
          respondida_em?: string | null
          status?: string | null
          updated_at?: string | null
          valor_negocio?: number | null
          visualizada_em?: string | null
        }
        Update: {
          cliente_email?: string
          cliente_nome?: string
          cliente_telefone?: string
          created_at?: string | null
          data_fechamento?: string | null
          descricao_necessidade?: string | null
          destinatario_id?: string
          empresa_referenciada_id?: string
          id?: number
          mensagem?: string | null
          observacoes_resultado?: string | null
          remetente_id?: string
          respondida_em?: string | null
          status?: string | null
          updated_at?: string | null
          valor_negocio?: number | null
          visualizada_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referencias_clientes_empresa_referenciada_id_fkey"
            columns: ["empresa_referenciada_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          categoria: string | null
          created_at: string | null
          descricao: string | null
          empresa_id: string | null
          id: number
          nome: string
          preco: number | null
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: number
          nome: string
          preco?: number | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: number
          nome?: string
          preco?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
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
      tarefas: {
        Row: {
          categoria: string | null
          concluida_em: string | null
          created_at: string
          data_limite: string
          descricao: string | null
          empresa_id: string
          id: string
          observacoes: string | null
          prioridade: string
          responsavel_id: string | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          concluida_em?: string | null
          created_at?: string
          data_limite: string
          descricao?: string | null
          empresa_id: string
          id?: string
          observacoes?: string | null
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          concluida_em?: string | null
          created_at?: string
          data_limite?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          observacoes?: string | null
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_contabil"
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
      workflow_items: {
        Row: {
          acoes_ia: string[] | null
          created_at: string
          criado_por_ia: boolean
          data_limite: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          metadata: Json | null
          prioridade: string
          responsavel_id: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acoes_ia?: string[] | null
          created_at?: string
          criado_por_ia?: boolean
          data_limite?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          metadata?: Json | null
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acoes_ia?: string[] | null
          created_at?: string
          criado_por_ia?: boolean
          data_limite?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          metadata?: Json | null
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_items_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_contabil"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { user_id: string }; Returns: boolean }
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
