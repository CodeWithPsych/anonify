import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  result: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
