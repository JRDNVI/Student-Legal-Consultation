import { useState, useEffect } from "react";
import { appApi } from "../api/api";

// Used to query all messages in the MessagesTable (Dyamnio)
// Extremely inefficent, but it works.
// The messagesScreen component uses this to load past conversations.

export const useMessageHistory = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await appApi.get("education/chat-history");
        const messages = response.data
        setMessages(messages);

      } catch (err) {
        setError(err.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return { messages, setMessages, loading, error };
};
