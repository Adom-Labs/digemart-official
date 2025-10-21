import NextAuth from 'next-auth';
import { authOptions } from './lib/auth';
import { NextAuthConfig } from 'next-auth';
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions as unknown as NextAuthConfig);
