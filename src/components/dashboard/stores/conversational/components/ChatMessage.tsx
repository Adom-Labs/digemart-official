import { motion } from "framer-motion";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex ${
      message.type === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
        message.type === "user"
          ? "bg-primary text-primary-foreground ml-12"
          : "bg-card border mr-12"
      }`}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
      {message.component && <div className="mt-3">{message.component}</div>}
    </div>
  </motion.div>
);
