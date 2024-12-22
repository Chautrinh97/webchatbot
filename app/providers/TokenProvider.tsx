'use client';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
   const router = useRouter();
   const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);
   const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

   const setTokens = (accessToken: string) => {
      localStorage.setItem(TOKEN_KEY, accessToken);
   };

   const logout = async () => {
      clearTokens();
      await fetch('/api/auth/logout', {
         method: 'POST',
      });
      router.push('/chat');
   }

   const clearTokens = () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
   };

   const isTokenExpired = (token: string): boolean => {
      try {
         const { exp } = jwtDecode<{ exp: number }>(token);
         return Date.now() >= exp * 1000;
      } catch {
         return true;
      }
   };

   const refreshAccessToken = async (): Promise<void> => {
      const refreshToken = getRefreshToken();
      if (!refreshToken || isTokenExpired(refreshToken)) {
         await logout();
         return;
      }

      try {
         const response = await fetch(`${process.env.API_ENDPOINT}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
         });

         if (!response.ok) {
            await logout();
         }
         const data = await response.json();
         setTokens(data.accessToken);
      } catch {
         clearTokens();
      }
   };

   useEffect(() => {
      const initializeToken = async () => {
         let accessToken = getAccessToken();

         if (!accessToken || isTokenExpired(accessToken)) {
            await refreshAccessToken();
         }
      };

      initializeToken();
   }, []);

   return <>{children}</>;
};
