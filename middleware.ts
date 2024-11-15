import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "./app/apiService/axios";
import { StatusCodes } from "http-status-codes";
const privatePaths = ['/chat', '/group'];
const authPaths = ['/auth'];

export async function middleware(req: NextRequest) {
   const { pathname, search } = req.nextUrl;
   const accessToken = req.cookies.get('accessToken')?.value;
   const refreshToken = req.cookies.get('refreshToken')?.value;

   const isAuthPath = authPaths.some(path => pathname.startsWith(path));
   const isPrivatePath = privatePaths.some(path => pathname.startsWith(path));

   if (isPrivatePath) {
      if (accessToken) {
         return NextResponse.next();
      }
      if (refreshToken) {
         try {
            const response = await axiosInstance.post('/auth/refresh', JSON.stringify({refreshToken}));

            if (response.status === StatusCodes.OK) {
               const { accessToken: newAccessToken } = response.data;
               const newDecodedAT = JSON.parse(atob(newAccessToken.split(".")[1]));
               const maxAge = newDecodedAT.exp - Math.floor(Date.now() / 1000);

               const res = NextResponse.next();
               res.cookies.set('accessToken', newAccessToken, {
                  maxAge,
                  httpOnly: true,
                  secure: true,
                  path: '/',
               });
               return res;
            }
         } catch (error) {
            const loginUrl = new URL('/auth/login', req.url);
            loginUrl.searchParams.set('redirect', pathname + search);
            const res = NextResponse.redirect(loginUrl);
            res.cookies.delete('refreshToken');
            return res;
         }
      }
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(loginUrl);
   }

   if (isAuthPath && accessToken) {
      return NextResponse.redirect(new URL('/chat', req.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ['/chat', '/group','/group/(.*)',
      '/auth/confirm-email', '/auth/login', '/auth/register', '/auth/complete-confirm', '/auth/reset-password']
}