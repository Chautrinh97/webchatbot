'use server'
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
   const body = await request.json();
   const accessToken = body.accessToken as string;
   const refreshToken = body.refreshToken as string;

   const decodedAT = jwt.decode(accessToken, { complete: true });
   const payloadAT = decodedAT?.payload as { [key: string]: any };
   const expAT = payloadAT["exp"];

   const decodedRT = jwt.decode(refreshToken, { complete: true });
   const payloadRT = decodedRT?.payload as { [key: string]: any };
   const expRT = payloadRT["exp"];
   const currentUnixTime = Math.floor(Date.now() / 1000);

   const accessTokenMaxAge = expAT - currentUnixTime;
   const refreshTokenMaxAge = expRT - currentUnixTime;

   const headers = new Headers();
   headers.append('Set-Cookie', `accessToken=${accessToken}; Path=/; HttpOnly; Max-Age=${accessTokenMaxAge}; SameSite=None; Secure;`);
   headers.append('Set-Cookie', `refreshToken=${refreshToken}; Path=/; HttpOnly; Max-Age=${refreshTokenMaxAge}; SameSite=None; Secure;`);

   return Response.json(body, {
      status: 200,
      headers: headers,
   })
}