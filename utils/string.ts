import { SyncStatus, UserRoleConstant } from "./constant";

export const generateRandomString = (length: number): string => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   const charactersLength = characters.length;

   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
}

export const validateSearchParams = (params: any) => {
   const { pageNumber, pageLimit } = params;

   const isNumberOrNull = (value: any) =>
      value === null || (!isNaN(parseInt(value)) && parseInt(value) > 0);

   return {
      pageNumber: isNumberOrNull(pageNumber) ? parseInt(pageNumber) : 1,
      pageLimit: isNumberOrNull(pageLimit) ? parseInt(pageLimit) : 10,
   };
};

export const getSyncStatus = (syncStatus: string) => {
   if (syncStatus === SyncStatus.NOT_SYNC) 
      return "Chưa đồng bộ"
   else if (syncStatus === SyncStatus.PENDING_SYNC)
      return "Đang chờ đồng bộ"
   else if (syncStatus === SyncStatus.SYNC)
      return "Đã đồng bộ"
   else return "Đồng bộ lại thất bại";
}