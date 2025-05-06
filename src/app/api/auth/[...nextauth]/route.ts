import apiClient from "@/utils/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthWithToken } from "@/interfaces/auth.interface";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nickname: { label: "Usuario", type: "text", placeholder: "user" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials, req) : Promise<any> {
        if (!credentials?.nickname || !credentials.password) return null;

        try {
          const response = await apiClient.post('/auth/login', credentials)
          
          if (response.data.token && response.data.isActive) {
            return {
              _id: response.data._id,
              nickname: response.data.nickname,
              role: response.data.role,
              isActive: response.data.isActive,
              accessToken: response.data.token
            } 
          }

          return null;
        } catch (error) {
          console.error('Error en la autenticación:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.role = user.role;
        token.nickname = user.nickname;
        token._id = user._id;
        token.isActive = user.isActive;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user = {
          ...session.user,
          role: token.role,
          nickname: token.nickname,
          _id: token._id,
          isActive: token.isActive,
          accessToken: token.accessToken
        };
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // opcional: tu propia página de login
  }
});

export { handler as GET, handler as POST };
