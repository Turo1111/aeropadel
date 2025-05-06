import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      nickname: string;
      isActive: boolean;
      role: {
        _id: string;
        name: string;
        permissions: string[];
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      }
    }
  }
} 