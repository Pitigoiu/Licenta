import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../firebase/config";
import { onValue, ref, remove, set } from "firebase/database";

export default function Message({ user, userLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [itemCount, setItemCount] = useState(0);
  const [chat, setChat] = useState([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      set(ref(database, "message/" + new Date().getTime()), {
        username: user.name,
        timestamp:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
        text: newMessage,
        id: new Date().getTime(),
      });
      setMessages([...messages, { text: newMessage, timestamp: new Date() }]);
      setNewMessage("");
      if (itemCount > 5) removeOldestItem();
    }
  };
  useEffect(() => {
    if (!userLoggedIn) setIsOpen(false);
    const numberChat = () => {
      onValue(ref(database, "message/"), (snapshot) => {
        const items = snapshot.val();
        setItemCount(items ? Object.keys(items).length : 0);
        if (items) setChat(Object.values(items));
      });
    };
    numberChat();
  }, []);
  useEffect(() => {
    if (!chat) return;
  }, [chat]);
  const removeOldestItem = () => {
    let charRef = ref(database, "message");

    onValue(charRef, (snapshot) => {
      const item = snapshot.val();

      if (item && Object.keys(item).length > 5) {
        const oldItem = Object.keys(item)[0];

        remove(ref(database, "message/" + oldItem))
          .then(() => console.log("removed"))
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  const deleteMessage = (e) => {
    let charRef = ref(database, "message");
    onValue(charRef, (snapshot) => {
      remove(ref(database, "message/" + e))
        .then(() => console.log("removed"))
        .catch((error) => {
          console.log(error);
        });
    });
  };

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2">
      <button
        onClick={toggleChat}
        className="bg-blue-500 text-white p-3 rounded-full focus:outline-none shadow-lg"
      >
        {isOpen ? "Close Chat" : "Open Chat"}
      </button>
      {isOpen && user ? (
        <div
          className="  bg-white rounded-lg shadow-lg flex text-xl flex-col mt-2"
          style={{ height: "400px", width: "400px" }}
        >
          <div className="flex-1 px-1 pt-2 overflow-y-auto">
            {chat.map((c, index) => (
              <div key={index} className="mb-2 ">
                <div
                  key={index}
                  className={`mb-2 ${
                    c.username === user.name ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded ${
                      c.username === user.name ? "bg-blue-100" : "bg-gray-100"
                    } break-words`}
                  >
                    <div className="px-1 flex items-center border-2 border-blue-400">
                      {(c.username == user.name || user.admin) && (
                        <button
                          onClick={() => deleteMessage(c.id)}
                          className="text-red-900 font-bold p-1 text-xs  bg-red-200 rounded-lg"
                        >
                          Delete
                        </button>
                      )}
                      <span className="block px-1 ">{c.username}</span>
                      <div>
                        <span className="block w-80">{c.text}</span>
                        <span className="block text-xs text-teal-800">
                          {c.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-2 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none focus:ring"
              placeholder="Type your message"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r focus:outline-none"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        isOpen &&
        user == undefined && (
          <div className="w-96 h-40  bg-red-200 rounded-lg shadow-lg flex items-center justify-center text-xl font-bold mt-2">
            <p className="pr-2">You are not connected. </p>
            <button className="bg-blue-500 mr-2 text-white px-4 py-2 rounded-md text-blue text-2xl font-medium">
              <Link to="/login">Login</Link>
            </button>
          </div>
        )
      )}
    </div>
  );
}
