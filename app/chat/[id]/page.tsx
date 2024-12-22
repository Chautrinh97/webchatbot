import ChatArea from "@/components/Chat/ChatArea";

export const dynamicParams=false;
  
const SingleConversationPage = ({ params }: {params: Promise<any>}) => {
  return <>
    <ChatArea />
  </>;
}
export default SingleConversationPage;