'use client'
import { useEffect } from "react";
import { useUserStore } from "../store/user.store";
import axiosInstance from "../apiService/axios";
import { StatusCodes } from "http-status-codes";
import { useRouter } from "next/navigation";
import { UserState } from "../state/user.state";

export default function UserProvider({user,  children }: {user: any, children: React.ReactNode }) {
   const { setUser, clearUser } = useUserStore();
   useEffect(() => {
      if (user)
         setUser(user);
   }, [user, setUser]); 
   // const router = useRouter();

   // const mapUserResponseToState = (userData: any): UserState => {
   //    return {
   //       id: userData.id,
   //       fullName: userData.fullName,
   //       email: userData.email,
   //       role: userData.role,
   //       isVerified: userData.isVerified ?? null,
   //       isBlocked: userData.loginAttempts > 5 ? true : null,
   //       isDisabled: userData.isDisabled ?? null,
   //       permissions: userData.authorityGroup?.permissions.map((permission: any) => permission.name) || [],
   //    };
   // };

   // useEffect(() => {
   //    const fetchUser = async () => {
   //       try {
   //          const res = await axiosInstance.get('/user/me', { withCredentials: true });
   //          // const res = await fetch('/api/user/me', { method: 'GET' });
   //          if (res.status === StatusCodes.OK) {
   //             // const userResponse = await res.json();
   //             const userData = mapUserResponseToState(res.data.user);
   //             // const userData = mapUserResponseToState(userResponse?.user);
   //             setUser(userData);
   //          } else if (res.status === StatusCodes.NOT_FOUND) {
   //             clearUser();
   //             fetch('/api/auth/logout', {
   //                method: "POST",
   //             });
   //             router.push('/');
   //             return;
   //          } else {
   //             clearUser();
   //          }
   //       } catch (error) {
   //          clearUser();
   //       }
   //    };
   //    fetchUser();
   // }, [setUser, clearUser, router]);
   return (
      <>
         {children}
      </>
   );
}