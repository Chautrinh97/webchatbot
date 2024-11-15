import ChatArea from "@/components/Chat/ChatArea";

export const dynamicParams=false;
  
const SingleConversationPage = ({ params }: { params: { id: string } }) => {
  return <>
    <ChatArea />
  </>;
}
export default SingleConversationPage;