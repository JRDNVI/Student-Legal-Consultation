import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

//https://ably.com/blog/websockets-react-tutorial
// Used this a guide to building the Socket context and how to implement it across the app.

// Creates a context that provides the app with the Socket and message state
const SocketContext = createContext(null);

// Wraps the app which is what allows other pages to access "const {?} = useSocket()"
export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);
  const [unread, setUnread] = useState({});
  const hasUnread = Object.values(unread).some((val) => val === true);

  const markAsUnread = (email) =>
    setUnread((prev) => ({ ...prev, [email]: true }));

  const markAsRead = (email) =>
    setUnread((prev) => ({ ...prev, [email]: false }));

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(
      `wss://9s0c1sz00b.execute-api.eu-west-1.amazonaws.com/prod?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Socket Connected");
      setSocketReady(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const from = data.sender;

      // If the message is not from the user themselves, mark the sender as having an unread message
      if (from && from !== user.email) {
        markAsUnread(from);
      }
    };

    socket.onerror = (err) => {
      console.error("Socket Error:", err);
    };

    socket.onclose = () => {
      console.log("Socket Disconnected");
      setSocketReady(false);
    };

    return () => {
      socket.close();
    };
  }, [token, user?.email]);

  // Provide WebSocket and message state to the rest of the app
  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        unread,
        markAsUnread,
        markAsRead,
        hasUnread,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Hook to access the socket context from anywhere in the app
export const useSocket = () => useContext(SocketContext);
