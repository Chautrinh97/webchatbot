export type UserState = {
   id: number,
   fullName: string,
   email: string,
   role: string,
   isVerified: boolean | null,
   isBlocked: boolean | null,
   isDisabled: boolean | null,
   permissions: string[],
}
