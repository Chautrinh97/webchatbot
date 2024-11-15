import { create } from "zustand";
import { UserState } from "../state/user.state";

export type UserStore = {
   user: UserState;
   setUser: (user: UserState) => void;
}
const getUserInit = (): UserState => {
   return {
      userId: '',
      fullName: '',
      email: '',
      role: '',
      isVerified: null,
   }
}
export const useUserStore = create<UserStore>((set) => ({
   user: getUserInit(),
   setUser: (user) => set(() => ({ user })),
}));

