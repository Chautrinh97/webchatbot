import { Conversation } from "@/types/chat";
import { ConversationComponent } from "./Conversation"

type Props = {
   conversations: Conversation[];
}
export const Conversations: React.FC<Props> = ({ conversations }) => {
   return (
      <div className="flex w-full flex-col gap-1">
         {conversations
            .slice()
            .reverse()
            .map((conversation, index) => (
               <ConversationComponent key={index} conversation={conversation} />
            ))}
      </div>
   );
};