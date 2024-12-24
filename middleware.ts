import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { apiService } from "./app/apiService/apiService";
import jwt from 'jsonwebtoken';
import { UserRoleConstant } from "./utils/constant";
const publicPaths = ['/manage', '/chat'];
const privatePaths = ['/manage'];
const authPaths = ['/auth'];

export async function middleware(req: NextRequest) {
   const { pathname, search } = req.nextUrl;
   const accessToken = req.cookies.get('accessToken')?.value;
   const refreshToken = req.cookies.get('refreshToken')?.value;

   const isAuthPath = authPaths.some(path => pathname.startsWith(path));
   const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
   const isPrivatePath = privatePaths.some(path => pathname.startsWith(path));

   if (isPublicPath) {
      if (accessToken) {
         if (privatePaths) {
            const decoded = jwt.decode(accessToken, { complete: true });
            const payload = decoded?.payload as { [key: string]: any };
            const role = payload["role"];
            if (role === UserRoleConstant.GUEST) {
               return NextResponse.redirect(new URL('/chat', req.url));
            }
         }
         return NextResponse.next();
      }
      if (refreshToken) {
         try {
            const response = await apiService.post('/auth/refresh', { refreshToken });
            const data = await response.json();
            if (response.status === StatusCodes.OK) {
               const { accessToken: newAccessToken } = data;
               const decoded = jwt.decode(newAccessToken, { complete: true });
               const payload = decoded?.payload as { [key: string]: any };
               const exp = payload["exp"];
               const maxAge = exp - Math.floor(Date.now() / 1000);
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
   matcher: ['/chat','/chat/(.*)', '/manage', '/manage/(.*)', '/api/((?!auth|auth/logout).*)',
      '/auth/confirm-email', '/auth/login', '/auth/complete-confirm', '/auth/reset-password']
}