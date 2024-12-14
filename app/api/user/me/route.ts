import axiosInstance from "@/app/apiService/axios";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   const cookie = cookies();
   const accessToken = cookie.get('accessToken');

   try {
      const response = await axiosInstance.get('/user/me', {
         headers: {
            Authorization: `Bearer ${accessToken?.value}`,
         },
         withCredentials: true,
      });

      if (response.status !== StatusCodes.OK)
         return NextResponse.json({ error: "Failed to fetch user data" }, { status: response.status });
      return NextResponse.json({ user: response.data.user }, { status: 200 });
   } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
   }
}