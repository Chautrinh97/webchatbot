'use server'

export async function POST(request: Request) {
   const body = await request.json();
   const accessToken = body.accessToken as string;
   const refreshToken = body.refreshToken as string;

   const decodedAT = JSON.parse(atob(accessToken.split(".")[1]));
   const decodedRT = JSON.parse(atob(refreshToken.split(".")[1]));
   const currentUnixTime = Math.floor(Date.now() / 1000);

   const accessTokenMaxAge = decodedAT.exp - currentUnixTime;
   const refreshTokenMaxAge = decodedRT.exp - currentUnixTime;
   const role = decodedAT.role;

   const headers = new Headers();
   headers.append('Set-Cookie', `accessToken=${accessToken}; Path=/; HttpOnly; Max-Age=${accessTokenMaxAge}; SameSite=Lax;`);
   headers.append('Set-Cookie', `refreshToken=${refreshToken}; Path=/; HttpOnly; Max-Age=${refreshTokenMaxAge}; SameSite=Lax;`);
   headers.append('Set-Cookie', `role=${role}; Path=/; HttpOnly; Max-Age=${refreshTokenMaxAge}; SameSite=Lax;`);

   return Response.json(body, {
      status: 200,
      headers: headers,
   })
}