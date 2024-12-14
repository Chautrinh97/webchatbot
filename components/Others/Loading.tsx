import { AiOutlineLoading } from "react-icons/ai"

export const Loading = () => {
   return (
      <div className="flex flex-col items-center justify-center mt-24 gap-3">
         <AiOutlineLoading className="animate-spin" />
         <span>Đang tải dữ liệu...</span>
      </div>
   )
}