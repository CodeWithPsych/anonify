import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  result?: string;
}
// @/types/SuggestMessagesResponse.ts

export type SuggestMessagesResponse = {
  success: boolean;
  message: string;
  result: string;
};
