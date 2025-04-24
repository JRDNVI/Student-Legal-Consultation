import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import MessageScreen from "./MessageScreen";
import { useSocket } from "../../context/SocketContext";

export default function MessagePanel() {
  const { user } = useAuth();
  const { data } = useDashboardData();
  const role = user["custom:role"];
  const [selectedUser, setSelectedUser] = useState(null);
  const { unread } = useSocket();
  
  console.log(selectedUser)

  const users = {
    student: "mentors",
    mentor: "students",
    client: "solicitors",
    solicitor: "clients",
  };

  const list = data[users[role]] || [];

  return (
    <div className="h-full overflow-y-auto">
      {!selectedUser ? (
        list.map((person, id) => {
          const name = person.name || "Unknown";
          const isUnread = unread?.[person.email];
  
          return (
            <div
              key={id}
              onClick={() => setSelectedUser(person)}
              className="flex justify-between items-center p-2 border-b cursor-pointer hover:bg-gray-100"
            >
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{person.email}</p>
              </div>
              {isUnread && (
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2" />
              )}
            </div>
          );
        })
      ) : (
        <MessageScreen
          recipient={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}  
