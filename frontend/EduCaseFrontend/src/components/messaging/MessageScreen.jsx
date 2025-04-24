import { useEffect, useState, useContext } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { useMessageHistory } from "../../hooks/messageHistory";
import LoadingSpinner from "../general/LoadingSpinner";

export default function MessageScreen({ recipient, onClose }) {
  const { user } = useAuth();
  const { messages, setMessages, loading, error } = useMessageHistory();
  const [newMsg, setNewMsg] = useState("");
  const { socket, socketReady, markAsRead } = useSocket();

 
  useEffect(() => {
    if (!socket) return;
    
    if (recipient?.email) {
        markAsRead(recipient.email);
      }

    const handleMessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => {
        const partner = msg.sender === user.email ? msg.recipient : msg.sender;
        return {
          ...prev,
          [partner]: [...(prev[partner] || []), msg],
        };
      });
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, setMessages, user.email]);

  if (loading) return <LoadingSpinner title="Loading Messages" />;

  const sendMessage = () => {
    if (!newMsg.trim()) return;
  
    const message = {
      action: "sendMessage",
      recipientEmail: recipient.email,
      senderEmail: user.email,
      message: newMsg,
    };
  
      socket.send(JSON.stringify(message));
  
      const timestamp = new Date().toISOString();
  
      const newMessage = {
        sender: user.email,
        recipient: recipient.email,
        message: newMsg,
        timestamp,
      };
  
      setMessages((prev) => ({
        ...prev,
        [recipient.email]: [...(prev[recipient.email] || []), newMessage],
      }));
  
  
    setNewMsg("");
  };


  const filteredMessages = messages[recipient.email] || [];

  return (
    <div className="p-4 bg-white shadow h-full flex flex-col max-h-[90vh]">
  <div className="flex justify-between items-center border-b pb-2 mb-4">
    <h2 className="font-semibold">{recipient.name || recipient.email}</h2>
    <button onClick={onClose}>✕</button>
  </div>

  <div className="flex-1 overflow-y-auto space-y-2 mb-4">
    {filteredMessages.length > 0 ? (
      filteredMessages.map((msg, idx) => {
        const isMine = msg.sender === user.email;
        return (
          <div
            key={idx}
            className={`text-sm p-2 rounded max-w-[75%] break-words ${
              isMine ? "bg-blue-100 text-right ml-auto" : "bg-gray-100"
            }`}
          >
            <strong>{isMine ? "You" : msg.sender}</strong>: {msg.message}
          </div>
        );
      })
    ) : (
      <div className="text-sm text-gray-500 text-center mt-4">
        No messages yet. Start the conversation!
      </div>
    )}
  </div>

  <div className="mt-auto flex gap-2">
    <input
      className="flex-1 border rounded px-2 py-1"
      value={newMsg}
      onChange={(e) => setNewMsg(e.target.value)}
    />
    <button
      className="bg-purple-600 text-white px-3 py-1 rounded"
      onClick={sendMessage}
    >
      Send
    </button>
  </div>
</div>

  );
}

