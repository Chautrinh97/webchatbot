'use server'
import { cookies } from "next/headers";

export async function POST(request: Request) {
   (await cookies()).delete('accessToken');
   (await cookies()).delete('refreshToken');
   return Response.json({message: 'Đăng xuất thành công'},);
}