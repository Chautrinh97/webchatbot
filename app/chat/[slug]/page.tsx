import { apiService } from "@/app/apiService/apiService";
import { getAccessToken } from "@/app/apiService/cookies";
import ChatArea from "@/components/Chat/ChatArea";
import { Conversation } from "@/types/chat";
import { StatusCodes } from "http-status-codes";
import { redirect } from "next/navigation";

const SingleConversationPage = async ({ params }: { params: { slug: string } }) => {
  console.log(params.slug);
  return (
    <ChatArea conversationSlug={params.slug} />
  );
}
export default SingleConversationPage;