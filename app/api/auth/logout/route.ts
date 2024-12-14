'use server'
import { cookies } from "next/headers";

export async function POST(request: Request) {
   cookies().delete('accessToken');
   cookies().delete('refreshToken');
   cookies().delete('role');
   return Response.json({message: 'Đăng xuất thành công'},);
}