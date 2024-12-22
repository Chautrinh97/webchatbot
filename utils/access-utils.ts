import jwt from "jsonwebtoken";
import { cookies } from "next/headers"

export const getRole = async () => {
   const cookie = await cookies();
   const accessToken = cookie.get('accessToken')?.value as string;
   const decoded = jwt.decode(accessToken, {complete: true});
   const payload = decoded?.payload as {[key: string]: any}
   return payload["role"];
}

export const getPermissions = async () => {
   const cookie = await cookies();
   const accessToken = cookie.get('accessToken')?.value as string;
   const decoded = jwt.decode(accessToken, {complete: true});
   const payload = decoded?.payload as {[key: string]: any}
   return payload["permissions"];
}