export type UserRole = "user" | "admin";

export type SubscriptionStatus = "inactive" | "pending" | "active" | "expired" | "denied";

export type PaymentStatus = "pending" | "approved" | "denied";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  subscription_expires_at: string | null;
  created_at: string;
}

export interface PaymentSubmission {
  id: string;
  user_id: string;
  screenshot_path: string;
  status: PaymentStatus;
  amount: number;
  bank_reference: string | null;
  admin_note: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_path: string;
  thumbnail_path: string | null;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
