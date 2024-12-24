export type UserState = {
   userId: number,
   fullName: string,
   email: string,
   role: string,
   isVerified: boolean | null,
   isBlocked: boolean | null,
   isDisabled: boolean | null,
   permissions: string[],
}
