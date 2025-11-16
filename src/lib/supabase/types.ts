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
      material_coverage: {
        Row: {
          coverage_percentage: number
          created_at: string
          id: string
          last_accessed_at: string | null
          material_id: string
          notes: string | null
          subject_id: string
          time_spent_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          coverage_percentage?: number
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          material_id: string
          notes?: string | null
          subject_id: string
          time_spent_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          coverage_percentage?: number
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          material_id?: string
          notes?: string | null
          subject_id?: string
          time_spent_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_coverage_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_coverage_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_states: {
        Row: {
          created_at: string
          health: number
          id: string
          last_tended_at: string | null
          level: number
          points: number
          subject_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          health?: number
          id?: string
          last_tended_at?: string | null
          level?: number
          points?: number
          subject_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          health?: number
          id?: string
          last_tended_at?: string | null
          level?: number
          points?: number
          subject_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plant_states_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          subscription_status: string
          subscription_tier: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          concept: string | null
          correct_answer: string
          created_at: string
          difficulty: string
          explanation: string | null
          id: string
          options: string[] | null
          points: number | null
          question: string
          quiz_id: string
          source_snippet: string | null
          topic: string
          type: string
          updated_at: string
        }
        Insert: {
          concept?: string | null
          correct_answer: string
          created_at?: string
          difficulty: string
          explanation?: string | null
          id?: string
          options?: string[] | null
          points?: number | null
          question: string
          quiz_id: string
          source_snippet?: string | null
          topic: string
          type: string
          updated_at?: string
        }
        Update: {
          concept?: string | null
          correct_answer?: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          options?: string[] | null
          points?: number | null
          question?: string
          quiz_id?: string
          source_snippet?: string | null
          topic?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_number: number
          completed_date: string
          correct_answers: number
          created_at: string
          current_question_index: number
          id: string
          mood: string | null
          quiz_id: string
          score: number
          status: string
          time_spent: number
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_number: number
          completed_date?: string
          correct_answers: number
          created_at?: string
          current_question_index?: number
          id?: string
          mood?: string | null
          quiz_id: string
          score: number
          status: string
          time_spent: number
          total_questions: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_number?: number
          completed_date?: string
          correct_answers?: number
          created_at?: string
          current_question_index?: number
          id?: string
          mood?: string | null
          quiz_id?: string
          score?: number
          status?: string
          time_spent?: number
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_materials: {
        Row: {
          created_at: string
          material_id: string
          quiz_id: string
        }
        Insert: {
          created_at?: string
          material_id: string
          quiz_id: string
        }
        Update: {
          created_at?: string
          material_id?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_materials_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          attempts: number
          average_score: number | null
          best_score: number | null
          completed_date: string | null
          created_at: string
          created_date: string | null
          description: string | null
          difficulty: string
          due_date: string | null
          duration: number
          id: string
          questions_count: number
          score: number | null
          status: string
          subject_id: string
          title: string
          topics_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          average_score?: number | null
          best_score?: number | null
          completed_date?: string | null
          created_at?: string
          created_date?: string | null
          description?: string | null
          difficulty: string
          due_date?: string | null
          duration: number
          id?: string
          questions_count: number
          score?: number | null
          status?: string
          subject_id: string
          title: string
          topics_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          average_score?: number | null
          best_score?: number | null
          completed_date?: string | null
          created_at?: string
          created_date?: string | null
          description?: string | null
          difficulty?: string
          due_date?: string | null
          duration?: number
          id?: string
          questions_count?: number
          score?: number | null
          status?: string
          subject_id?: string
          title?: string
          topics_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_materials: {
        Row: {
          created_at: string
          error_message: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          processing_status: string
          storage_path: string
          subject_id: string
          text_content: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          processing_status?: string
          storage_path: string
          subject_id: string
          text_content?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          processing_status?: string
          storage_path?: string
          subject_id?: string
          text_content?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plan_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          estimated_time_minutes: number
          id: string
          is_completed: boolean
          order_index: number
          resource_links: string[] | null
          task_type: string
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_time_minutes: number
          id?: string
          is_completed?: boolean
          order_index: number
          resource_links?: string[] | null
          task_type?: string
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_time_minutes?: number
          id?: string
          is_completed?: boolean
          order_index?: number
          resource_links?: string[] | null
          task_type?: string
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plan_tasks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "study_plan_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plan_topics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mastery_level: number | null
          order_index: number
          priority: string
          status: string
          study_plan_id: string
          title: string
          total_tasks: number
          total_time_minutes: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mastery_level?: number | null
          order_index: number
          priority?: string
          status?: string
          study_plan_id: string
          title: string
          total_tasks?: number
          total_time_minutes: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mastery_level?: number | null
          order_index?: number
          priority?: string
          status?: string
          study_plan_id?: string
          title?: string
          total_tasks?: number
          total_time_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plan_topics_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          generated_date: string
          id: string
          projected_pass_chance: number | null
          start_date: string
          status: string
          subject_id: string
          title: string
          total_hours: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          generated_date?: string
          id?: string
          projected_pass_chance?: number | null
          start_date: string
          status?: string
          subject_id: string
          title: string
          total_hours: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          generated_date?: string
          id?: string
          projected_pass_chance?: number | null
          start_date?: string
          status?: string
          subject_id?: string
          title?: string
          total_hours?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plans_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          materials_used: string[] | null
          mood: string | null
          notes: string | null
          session_date: string
          subject_id: string
          topics_covered: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes: number
          id?: string
          materials_used?: string[] | null
          mood?: string | null
          notes?: string | null
          session_date: string
          subject_id: string
          topics_covered?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          materials_used?: string[] | null
          mood?: string | null
          notes?: string | null
          session_date?: string
          subject_id?: string
          topics_covered?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      studyy_plan_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          estimated_duration: number
          estimated_time_minutes: number | null
          id: string
          is_completed: boolean
          order_index: number
          priority: string
          resource_title: string | null
          resource_url: string | null
          task_type: string
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number
          estimated_time_minutes?: number | null
          id?: string
          is_completed?: boolean
          order_index?: number
          priority?: string
          resource_title?: string | null
          resource_url?: string | null
          task_type: string
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number
          estimated_time_minutes?: number | null
          id?: string
          is_completed?: boolean
          order_index?: number
          priority?: string
          resource_title?: string | null
          resource_url?: string | null
          task_type?: string
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "studyy_plan_tasks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "studyy_plan_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      studyy_plan_topics: {
        Row: {
          completed_tasks: number
          created_at: string
          description: string | null
          difficulty_level: string | null
          estimated_hours: number
          focus_areas: string[] | null
          id: string
          order_index: number
          priority: string | null
          status: string
          studyy_plan_id: string
          title: string
          total_tasks: number
          total_time_minutes: number | null
          updated_at: string
        }
        Insert: {
          completed_tasks?: number
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number
          focus_areas?: string[] | null
          id?: string
          order_index?: number
          priority?: string | null
          status?: string
          studyy_plan_id: string
          title: string
          total_tasks?: number
          total_time_minutes?: number | null
          updated_at?: string
        }
        Update: {
          completed_tasks?: number
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number
          focus_areas?: string[] | null
          id?: string
          order_index?: number
          priority?: string | null
          status?: string
          studyy_plan_id?: string
          title?: string
          total_tasks?: number
          total_time_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "studyy_plan_topics_studyy_plan_id_fkey"
            columns: ["studyy_plan_id"]
            isOneToOne: false
            referencedRelation: "studyy_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      studyy_plans: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          generation_metadata: Json | null
          id: string
          projected_pass_chance: number | null
          start_date: string
          status: string
          subject_id: string
          title: string
          total_hours: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          generation_metadata?: Json | null
          id?: string
          projected_pass_chance?: number | null
          start_date?: string
          status?: string
          subject_id: string
          title: string
          total_hours?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          generation_metadata?: Json | null
          id?: string
          projected_pass_chance?: number | null
          start_date?: string
          status?: string
          subject_id?: string
          title?: string
          total_hours?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "studyy_plans_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          color: string
          created_at: string
          description: string | null
          exam_board: string | null
          icon: string
          id: string
          last_studied_at: string | null
          name: string
          pass_chance: number | null
          progress: number | null
          teacher_emphasis: string | null
          test_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          exam_board?: string | null
          icon?: string
          id?: string
          last_studied_at?: string | null
          name: string
          pass_chance?: number | null
          progress?: number | null
          teacher_emphasis?: string | null
          test_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          exam_board?: string | null
          icon?: string
          id?: string
          last_studied_at?: string | null
          name?: string
          pass_chance?: number | null
          progress?: number | null
          teacher_emphasis?: string | null
          test_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topic_mastery: {
        Row: {
          correct_count: number
          created_at: string
          id: string
          incorrect_count: number
          last_practiced_at: string | null
          mastery_level: number
          p_guess: number
          p_init: number
          p_known: number
          p_learned: number
          p_slip: number
          p_transit: number
          subject_id: string
          topic_name: string
          total_attempts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_count?: number
          created_at?: string
          id?: string
          incorrect_count?: number
          last_practiced_at?: string | null
          mastery_level?: number
          p_guess?: number
          p_init?: number
          p_known?: number
          p_learned?: number
          p_slip?: number
          p_transit?: number
          subject_id: string
          topic_name: string
          total_attempts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_count?: number
          created_at?: string
          id?: string
          incorrect_count?: number
          last_practiced_at?: string | null
          mastery_level?: number
          p_guess?: number
          p_init?: number
          p_known?: number
          p_learned?: number
          p_slip?: number
          p_transit?: number
          subject_id?: string
          topic_name?: string
          total_attempts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_mastery_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          attempt_id: string
          created_at: string
          feedback: string | null
          id: string
          is_correct: boolean
          question_id: string
          time_spent: number
          updated_at: string
          user_answer: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          time_spent: number
          updated_at?: string
          user_answer?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          time_spent?: number
          updated_at?: string
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_storage_usage: { Args: { user_uuid: string }; Returns: number }
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
