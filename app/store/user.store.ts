import { create } from "zustand";
import { UserState } from "../state/user.state";

export type UserStore = {
   user: UserState;
   isLoggedIn: boolean;
   setUser: (user: UserState) => void;
   clearUser: () => void;
}
const getUserInit = (): UserState => {
   return {
      userId: 0,
      fullName: '',
      email: '',
      role: '',
      isVerified: null,
      isBlocked: null,
      isDisabled: null,
      permissions: [],
   }
}
export const useUserStore = create<UserStore>((set) => ({
   user: getUserInit(),
   isLoggedIn: false,
   setUser: (user) => set(() => ({ user: user, isLoggedIn: true })),
   clearUser: () => {
      set(() => ({ user: getUserInit(), isLoggedIn: false}));
   }
}));

