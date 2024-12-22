import { cookies } from "next/headers";

export const getAccessToken = async () => {
   const cookie = await cookies();
   return cookie.get('accessToken')?.value;
}