'use client'

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation"

export default function Error({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   const router = useRouter();
   return (
      <div className="flex flex-col items-center justify-center mt-24 gap-3">
         <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
         <Button className="rounded-md" color="primary" onClick={() => {router.refresh()}}>Thử lại </Button>
      </div>
   )
}