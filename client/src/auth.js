import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authUser } from './services/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        name: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await authUser({
          name: credentials.name,
          password: credentials.password,
        });

        if (response.error) {
          throw new Error(response.error);
        }
        return response.user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Si el usuario inicia por primera vez con Google

      if (account && account.provider === 'google') {
        const createUser = await authUser({
          user_name: user.email,
          id: user.id,
        });
        token.role = createUser.role;
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      // Aquí lo agregas del token a session para que esté disponible en el cliente
      // Al acceder al useSession() este ahora tendra el role
      session.user.role = token.role;
      return session;
    },
  },
});
