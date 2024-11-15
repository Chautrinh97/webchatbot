import Image from 'next/image'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="relative h-screen w-screen bg-white">
         <header>
            <div className="w-full flex justify-center items-center">
               <div className="mx-auto mt-10 sm:mt-4 lg:mt-10 animate-fadeinbouncedown">
                  <Image
                     src="/icon.jpg"
                     alt="Logo Chatbot"
                     priority={true}
                     width={100}
                     height={100}
                     style={{
                        borderRadius: '9999px'
                     }}
                  />
               </div>
            </div>
         </header>
         <div className="w-full px-20 pt-10">
            {children}
         </div>
      </div>
   );
}
export default AuthLayout;