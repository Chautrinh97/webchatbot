import { Conversation } from '@/types/chat';

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: Conversation[],
) => {
  let conversationExists = false;
  
  const updatedConversations = allConversations.map((conversation) => {
    if (conversation.id === updatedConversation.id) {
      conversationExists = true;
      return updatedConversation;
    }
    return conversation;
  });

  if (!conversationExists) updatedConversations.push(updatedConversation);

  return {
    single: updatedConversation,
    all: updatedConversations,
  };
};
