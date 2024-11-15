import { FaXmark } from "react-icons/fa6";

type Props = {
   searchTerm: string;
   onChange: (searchTerm: string) => void;
}
export const Search: React.FC<Props> = ({ searchTerm, onChange }) => {
   const handleSearchChange = (e: any) => {
      onChange(e.target.value);
   }
   const handleClearSearch = () =>{
      onChange("");
   }
   return (
      <>
         <div className="relative flex items-center">
            <input
               className={`w-full flex-1 rounded-md focus:outline-none border-2 border-neutral-400 dark:border-neutral-700 px-4 py-3 pr-10 text-[14px] leading-3 bg-sb-white text-black dark:bg-sb-black dark:text-white`}
               type="text"
               placeholder="Tìm kiếm..."
               value={searchTerm}
               onChange={handleSearchChange}
            />
            {searchTerm && (
               <FaXmark
                  className="absolute right-4 cursor-pointer text-neutral-300 hover:text-neutral-400"
                  size={18}
                  onClick={handleClearSearch}
               />
            )}
         </div>
      </>
   )
}