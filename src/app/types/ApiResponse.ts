import { Message } from "@/app/models/Users";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMassages?: boolean;
  messages?: Array<Message>;
}
