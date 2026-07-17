import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string
        const password = credentials?.password as string
        
        if (!email || !password) {
          return null
        }
        
        // Demo mode: accept any valid email/password
        // TODO: Replace with Supabase auth when ready
        if (email.includes('@') && password.length >= 4) {
          return {
            id: '1',
            email,
            name: email.split('@')[0],
          }
        }
        
        return null
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})