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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accomplishments: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          id: string
          title: string
          type: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          title: string
          type?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          title?: string
          type?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          achievement_date: string | null
          created_at: string
          description: string | null
          id: string
          organization: string | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          title: string
          user_id: string
        }
        Update: {
          achievement_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_organization: string | null
          name: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          name: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          name?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          completion_date: string | null
          created_at: string
          id: string
          name: string
          platform: string | null
          skills_learned: string[] | null
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          id?: string
          name: string
          platform?: string | null
          skills_learned?: string[] | null
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          id?: string
          name?: string
          platform?: string | null
          skills_learned?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      educations: {
        Row: {
          activities: string | null
          created_at: string
          degree: string
          description: string | null
          end_year: number | null
          field_of_study: string | null
          grade: string | null
          id: string
          institution_name: string
          start_year: number | null
          user_id: string
        }
        Insert: {
          activities?: string | null
          created_at?: string
          degree: string
          description?: string | null
          end_year?: number | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution_name: string
          start_year?: number | null
          user_id: string
        }
        Update: {
          activities?: string | null
          created_at?: string
          degree?: string
          description?: string | null
          end_year?: number | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution_name?: string
          start_year?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "educations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_job_openings: {
        Row: {
          created_at: string
          designation: string
          employer_id: string
          experience_years: string | null
          id: string
          is_custom: boolean | null
          job_description: string | null
          job_location: string | null
          num_openings: number | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          designation: string
          employer_id: string
          experience_years?: string | null
          id?: string
          is_custom?: boolean | null
          job_description?: string | null
          job_location?: string | null
          num_openings?: number | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          designation?: string
          employer_id?: string
          experience_years?: string | null
          id?: string
          is_custom?: boolean | null
          job_description?: string | null
          job_location?: string | null
          num_openings?: number | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employer_job_openings_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
        ]
      }
      employers: {
        Row: {
          address: string | null
          company_name: string | null
          company_type: string | null
          contact_name: string | null
          created_at: string
          description: string | null
          email_verified: boolean | null
          employer_id: string
          established_year: number | null
          id: string
          industry: string | null
          logo_url: string | null
          multiple_locations: string[] | null
          num_employees: string | null
          official_email: string | null
          phone: string | null
          phone_verified: boolean | null
          profile_completion: number | null
          registration_type: string | null
          updated_at: string
          user_id: string
          verification_status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          company_type?: string | null
          contact_name?: string | null
          created_at?: string
          description?: string | null
          email_verified?: boolean | null
          employer_id?: string
          established_year?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          multiple_locations?: string[] | null
          num_employees?: string | null
          official_email?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          profile_completion?: number | null
          registration_type?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          company_type?: string | null
          contact_name?: string | null
          created_at?: string
          description?: string | null
          email_verified?: boolean | null
          employer_id?: string
          established_year?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          multiple_locations?: string[] | null
          num_employees?: string | null
          official_email?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          profile_completion?: number | null
          registration_type?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          achievements: string | null
          company_name: string
          created_at: string
          description: string | null
          employment_type: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          job_title: string
          key_responsibilities: string | null
          location: string | null
          start_date: string | null
          tools_technologies: string[] | null
          user_id: string
        }
        Insert: {
          achievements?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          job_title: string
          key_responsibilities?: string | null
          location?: string | null
          start_date?: string | null
          tools_technologies?: string[] | null
          user_id: string
        }
        Update: {
          achievements?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          job_title?: string
          key_responsibilities?: string | null
          location?: string | null
          start_date?: string | null
          tools_technologies?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_verifications: {
        Row: {
          created_at: string
          face_match_status: string | null
          government_id_type: string | null
          government_id_url: string | null
          id: string
          pan_number: string | null
          photo_url: string | null
          updated_at: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          created_at?: string
          face_match_status?: string | null
          government_id_type?: string | null
          government_id_url?: string | null
          id?: string
          pan_number?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          created_at?: string
          face_match_status?: string | null
          government_id_type?: string | null
          government_id_url?: string | null
          id?: string
          pan_number?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about_summary: string | null
          areas_of_expertise: string[] | null
          availability_status: string | null
          behance_url: string | null
          career_interests: string[] | null
          career_objective: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string | null
          employment_type: string | null
          experience_level: string | null
          full_name: string | null
          github_url: string | null
          iam_talento_id: string
          id: string
          industry: string | null
          industry_readiness_score: number | null
          job_role: string | null
          kaggle_url: string | null
          key_achievements: string | null
          linkedin_url: string | null
          notice_period: string | null
          open_to_work: boolean | null
          other_portfolio_links: string[] | null
          phone: string | null
          portfolio_url: string | null
          preferred_locations: string[] | null
          preferred_salary_range: string | null
          professional_headline: string | null
          profile_completion: number | null
          profile_photo_url: string | null
          resume_url: string | null
          state: string | null
          updated_at: string
          verification_status: string | null
          video_intro_url: string | null
          years_of_experience: number | null
        }
        Insert: {
          about_summary?: string | null
          areas_of_expertise?: string[] | null
          availability_status?: string | null
          behance_url?: string | null
          career_interests?: string[] | null
          career_objective?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          employment_type?: string | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          iam_talento_id?: string
          id: string
          industry?: string | null
          industry_readiness_score?: number | null
          job_role?: string | null
          kaggle_url?: string | null
          key_achievements?: string | null
          linkedin_url?: string | null
          notice_period?: string | null
          open_to_work?: boolean | null
          other_portfolio_links?: string[] | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_locations?: string[] | null
          preferred_salary_range?: string | null
          professional_headline?: string | null
          profile_completion?: number | null
          profile_photo_url?: string | null
          resume_url?: string | null
          state?: string | null
          updated_at?: string
          verification_status?: string | null
          video_intro_url?: string | null
          years_of_experience?: number | null
        }
        Update: {
          about_summary?: string | null
          areas_of_expertise?: string[] | null
          availability_status?: string | null
          behance_url?: string | null
          career_interests?: string[] | null
          career_objective?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          employment_type?: string | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          iam_talento_id?: string
          id?: string
          industry?: string | null
          industry_readiness_score?: number | null
          job_role?: string | null
          kaggle_url?: string | null
          key_achievements?: string | null
          linkedin_url?: string | null
          notice_period?: string | null
          open_to_work?: boolean | null
          other_portfolio_links?: string[] | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_locations?: string[] | null
          preferred_salary_range?: string | null
          professional_headline?: string | null
          profile_completion?: number | null
          profile_photo_url?: string | null
          resume_url?: string | null
          state?: string | null
          updated_at?: string
          verification_status?: string | null
          video_intro_url?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          impact: string | null
          organization: string | null
          project_url: string | null
          role_in_project: string | null
          start_date: string | null
          title: string
          tools_technologies: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          impact?: string | null
          organization?: string | null
          project_url?: string | null
          role_in_project?: string | null
          start_date?: string | null
          title: string
          tools_technologies?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          impact?: string | null
          organization?: string | null
          project_url?: string | null
          role_in_project?: string | null
          start_date?: string | null
          title?: string
          tools_technologies?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          proficiency_level: string | null
          skill_name: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          proficiency_level?: string | null
          skill_name: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          proficiency_level?: string | null
          skill_name?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_experiences: {
        Row: {
          cause: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          organization: string
          role: string | null
          start_date: string | null
          user_id: string
        }
        Insert: {
          cause?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization: string
          role?: string | null
          start_date?: string | null
          user_id: string
        }
        Update: {
          cause?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization?: string
          role?: string | null
          start_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_talento_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_owner: { Args: { target_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "employer" | "employee"
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
    Enums: {
      app_role: ["employer", "employee"],
    },
  },
} as const
