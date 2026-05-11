export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          phoneNumber: string;
          name: string | null;
          roles: string[];
          activeMode: string;
          role: string;
          walletBalance: number;
          fcmToken: string | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          phoneNumber: string;
          name?: string | null;
          roles?: string[];
          activeMode?: string;
          role?: string;
          walletBalance?: number;
          fcmToken?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          phoneNumber?: string;
          name?: string | null;
          roles?: string[];
          activeMode?: string;
          role?: string;
          walletBalance?: number;
          fcmToken?: string | null;
          createdAt?: string;
        };
      };
      Provider: {
        Row: {
          id: string;
          userId: string;
          bio: string | null;
          areaSlug: string;
          serviceMode: string;
          verificationStatus: string;
          documentUrl: string | null;
          isSuspended: boolean;
          gender: string | null;
          university: string | null;
          educationLevel: string | null;
          strikes: number;
          completedSessions: number;
          profileStrength: number;
          location: Json | null;
        };
        Insert: {
          id?: string;
          userId: string;
          bio?: string | null;
          areaSlug: string;
          serviceMode?: string;
          verificationStatus?: string;
          documentUrl?: string | null;
          isSuspended?: boolean;
          gender?: string | null;
          university?: string | null;
          educationLevel?: string | null;
          strikes?: number;
          completedSessions?: number;
          profileStrength?: number;
          location?: Json | null;
        };
        Update: {
          id?: string;
          userId?: string;
          bio?: string | null;
          areaSlug?: string;
          serviceMode?: string;
          verificationStatus?: string;
          documentUrl?: string | null;
          isSuspended?: boolean;
          gender?: string | null;
          university?: string | null;
          educationLevel?: string | null;
          strikes?: number;
          completedSessions?: number;
          profileStrength?: number;
          location?: Json | null;
        };
      };
      ProviderService: {
        Row: {
          id: string;
          providerId: string;
          subject: string;
          ratePerHour: number;
        };
        Insert: {
          id?: string;
          providerId: string;
          subject: string;
          ratePerHour: number;
        };
        Update: {
          id?: string;
          providerId?: string;
          subject?: string;
          ratePerHour?: number;
        };
      };
      ProviderSchedule: {
        Row: {
          id: string;
          providerId: string;
          dayOfWeek: number;
          startTime: string;
          endTime: string;
        };
        Insert: {
          id?: string;
          providerId: string;
          dayOfWeek: number;
          startTime: string;
          endTime: string;
        };
        Update: {
          id?: string;
          providerId?: string;
          dayOfWeek?: number;
          startTime?: string;
          endTime?: string;
        };
      };
      Booking: {
        Row: {
          id: string;
          providerId: string;
          clientId: string;
          serviceId: string;
          parentBookingId: string | null;
          bookingDate: string;
          slotStart: string;
          slotEnd: string;
          status: string;
          amount: number;
          platformFee: number;
          roadNo: string | null;
          houseNo: string | null;
          landmark: string | null;
          checkInTime: string | null;
          checkInGeo: Json | null;
          idempotencyKey: string | null;
          sslTrxId: string | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          providerId: string;
          clientId: string;
          serviceId: string;
          parentBookingId?: string | null;
          bookingDate: string;
          slotStart: string;
          slotEnd: string;
          status?: string;
          amount: number;
          platformFee: number;
          roadNo?: string | null;
          houseNo?: string | null;
          landmark?: string | null;
          checkInTime?: string | null;
          checkInGeo?: Json | null;
          idempotencyKey?: string | null;
          sslTrxId?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          providerId?: string;
          clientId?: string;
          serviceId?: string;
          parentBookingId?: string | null;
          bookingDate?: string;
          slotStart?: string;
          slotEnd?: string;
          status?: string;
          amount?: number;
          platformFee?: number;
          roadNo?: string | null;
          houseNo?: string | null;
          landmark?: string | null;
          checkInTime?: string | null;
          checkInGeo?: Json | null;
          idempotencyKey?: string | null;
          sslTrxId?: string | null;
          createdAt?: string;
        };
      };
      PayoutRequest: {
        Row: {
          id: string;
          providerId: string;
          amount: number;
          bkashNumber: string;
          status: string;
          createdAt: string;
          paidAt: string | null;
        };
        Insert: {
          id?: string;
          providerId: string;
          amount: number;
          bkashNumber: string;
          status?: string;
          createdAt?: string;
          paidAt?: string | null;
        };
        Update: {
          id?: string;
          providerId?: string;
          amount?: number;
          bkashNumber?: string;
          status?: string;
          createdAt?: string;
          paidAt?: string | null;
        };
      };
      Report: {
        Row: {
          id: string;
          bookingId: string;
          reporterId: string;
          reportedId: string;
          reason: string;
          detail: string | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          bookingId: string;
          reporterId: string;
          reportedId: string;
          reason: string;
          detail?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          bookingId?: string;
          reporterId?: string;
          reportedId?: string;
          reason?: string;
          detail?: string | null;
          createdAt?: string;
        };
      };
    };
  };
}