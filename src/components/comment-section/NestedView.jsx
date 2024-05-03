import React, { useEffect, useState } from "react";

import "./index.css";
import { useAuth } from "../Auth/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import useUsers from "../hooks/useUsers";

export default function NestedView({ name, chapter, id, manga }) {
  let date = new Date().getTime();
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { userLoggedIn, currentUser } = useAuth();
  const userData = useUsers(userLoggedIn, currentUser?.email);
  const [loginMess, setLoginMess] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [user, setUser] = useState("");
  const [userRef, setUserRef] = useState();
  if (manga) {
    const reference = (db, `${name}`, `${chapter}`, "Comments");
  } else {
    const reference = (db, "Lista Completa", `${id}`, "Comments");
  }
  const toggleReplies = (index) => {
    if (data.at(index).reply1.userProfile === user?.profile)
      setOriginalCreator(true);
    setShowReplies((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  let reference = undefined,
    setRefDoc = undefined;
  if (manga) {
    setRefDoc = doc(db, `${name}`, `${chapter}`, "Comments", `${date}`);
    reference = collection(db, `${name}`, `${chapter}`, "Comments");
  } else {
    setRefDoc = doc(db, "Lista Completa", `${id}`, "Comments", `${date}`);
    reference = collection(db, "Lista Completa", `${id}`, "Comments");
  }
  let refComment = query(reference, orderBy("createdAt", "desc"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      setLoginMess("You have to be logged in to comment");
      return;
    }
    if (newComment.trim() === "") return; // Prevent adding empty comments

    await setDoc(setRefDoc, {
      text: newComment,
      createdAt: new Date().toGMTString(),
      id: date,
      user: user.name,
      userUrl: user.profile,
    });

    setNewComment("");
  };

  const [replyStates, setReplyStates] = useState({});
  const handleReply = (index) => {
    setReplyStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the reply state for the clicked comment index
    }));
  };

  useEffect(() => {
    userData.then((data) => setUser(data));
    let list = [];
    const loadComment = async () => {
      const query = await getDocs(refComment);

      query.forEach((doc) => {
        list.push(doc.data());
      });
      setData(list);
    };
    loadComment();
  }, [newComment]);

  const handleSubmitReply = async (e, index) => {
    e.preventDefault();
    if (newComment.trim() === "") {
      return;
    } // Prevent adding empty comments
    const updatedComments = [...comments];
    setComments(updatedComments);

    let setSubmit = undefined;
    if (!data.at(index).reply1) {
      if (manga) {
        setSubmit = doc(
          db,
          `${name}`,
          `${chapter}`,
          "Comments",
          `${data.at(index).id}`
        );
      } else {
        setSubmit = doc(
          db,
          "Lista Completa",
          `${id}`,
          "Comments",
          `${data.at(index).id}`
        );
      }

      await setDoc(
        setSubmit,
        {
          reply1: {
            id: date,
            text: newComment,
            createdAt: new Date().toGMTString(),
            user: user.name,
            userProfile: user.profile,
          },
        },
        { merge: true }
      );
    }
    setNewComment("");
  };

  const openImage = (url) => {
    window.open(url, "_blank");
  };

  const [editReply, setEditReply] = useState(false);
  const [originalCreator, setOriginalCreator] = useState(false);
  const handleEditReply = () => {
    setEditReply(!editReply);
  };
  const handleEdit = () => {};
  const handleDeleteReply = async (idCom) => {
    if (manga) {
      refDoc = doc(db, `${name}`, `${chapter}`, "Comments", `${idCom}`);
    } else {
      refDoc = doc(db, "Lista Completa", `${id}`, "Comments", `${idCom}`);
    }
    await updateDoc(refDoc, { reply1: deleteField() });
    console.log(idCom);
  };
  const handleDelete = async (idCom) => {
    if (manga) {
      refDoc = doc(db, `${name}`, `${chapter}`, "Comments", `${idCom}`);
    } else {
      refDoc = doc(db, "Lista Completa", `${id}`, "Comments", `${idCom}`);
    }
    await updateDoc(refDoc, {
      user: "",
      userUrl: "",
      text: "This message was deleted",
    });
  };
  const handleChangeReply = (e, i, id) => {
    setNewComment(e.target.value);
  };
  let refDoc = undefined;

  const handleSubmitEdit = async (e, idCom, idReply) => {
    e.preventDefault();
    const reply1 = {
      id: new Date().getTime(),
      text: newComment,
      editedAt: new Date().toGMTString(),
      user: user.name,
      userProfile: user.profile,
    };
    if (manga) {
      refDoc = doc(db, `${name}``${chapter}`, "Comments", `${idCom}`);
    } else {
      refDoc = doc(db, "Lista Completa", `${id}`, "Comments", `${idCom}`);
    }

    await updateDoc(refDoc, { reply1 });
    setNewComment("");
  };
  //Show the comments
  const [spinner, setSpinner] = useState(false);
  const [editStates, setEditState] = useState({});
  const [editStateReply, setEditStateReply] = useState({});
  const handleComments = () => {
    setSpinner(!spinner);
    for (let item in data) {
      if (data.at(item).userUrl === user?.profile) {
        setEditState((prevState) => ({
          ...prevState,
          [item]: true, // Toggle the reply state for the clicked comment index
        }));
      }
      if (
        data.at(item).reply1 &&
        data.at(item).reply1.userProfile === user?.profile
      ) {
        setEditStateReply((prevState) => ({
          ...prevState,
          [item]: true,
        }));
      }
    }
  };
  if (!spinner) {
    return (
      <p
        onClick={handleComments}
        className="text-white text-xl border p-2 w-max cursor-pointer"
      >
        Press to see comments
      </p>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center  w-2/3">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={handleChange}
          placeholder="Add a comment..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Add Comment
        </button>
      </form>
      {loginMess && <p className="text-red-500 mb-4">{loginMess}</p>}
      <ul className="w-full">
        {data &&
          data.map((com, i) => (
            <li key={i} className="mb-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <img
                    className="size-14 cursor-pointer"
                    src={com.userUrl}
                    onClick={(e) => openImage(com.userUrl)}
                  />
                  <div className="font-semibold">{com.user}</div>
                  <div className="text-sm text-gray-500 pl-2">
                    {com.createdAt}
                  </div>
                  {/* Edit and Delete Buttons */}

                  {editStates[i] && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(com.id)}
                        className="text-blue-600 bg-blue-200 p-2 rounded-md hover:bg-blue-400 hover:text-blue-900 focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(com.id)}
                        className="tex  t-red-600 bg-red-200 p-2 rounded-md hover:bg-red-400 hover:text-red-900 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2">{com.text}</div>
                {/* Replies */}
                <button
                  onClick={() => handleReply(i, com.id)}
                  className="mt-2 text-blue-500 focus:outline-none"
                >
                  Reply
                </button>
                {replyStates[i] && (
                  <div className="mt-4">
                    <form
                      onSubmit={(e) => handleSubmitReply(e, i)}
                      className="flex items-center"
                    >
                      <textarea
                        value={newComment}
                        onChange={handleChange}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                      >
                        Add Comment
                      </button>
                    </form>
                  </div>
                )}
                {/* Toggle button for replies */}
                {com.reply1 ? (
                  <button
                    onClick={() => toggleReplies(i)}
                    className="text-sm text-blue-500 mt-2 focus:outline-none"
                  >
                    {showReplies[i] ? "Hide Replies" : "Show Replies"}
                  </button>
                ) : null}
                {/* Replies */}
                {showReplies[i] && (
                  <ul className="mt-2">
                    {com.reply1 && (
                      <li className="mt-2">
                        <img
                          className="size-14 cursor-pointer"
                          src={com.reply1.userProfile}
                          onClick={(e) => openImage(com.reply1.userProfile)}
                        />
                        <div className="font-semibold">{com.reply1.user}</div>
                        <div className="text-sm text-gray-500">
                          {com.reply1.createdAt}
                        </div>
                        {/* Edit and Delete Buttons */}
                        <div className="mt-2">{com.reply1.text}</div>
                        {editStateReply[i] && (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleEditReply}
                              className="text-blue-600 bg-blue-200 p-1 rounded-md hover:bg-blue-400 hover:text-blue-900 focus:outline-none"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteReply(com.id)}
                              className="text-red-600 bg-red-200 p-1 rounded-md hover:bg-red-400 hover:text-red-900 focus:outline-none"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        {editReply && (
                          <form
                            onSubmit={(e) =>
                              handleSubmitEdit(e, com.id, com.reply1.id)
                            }
                            className="flex items-center"
                          >
                            <textarea
                              value={newComment}
                              onChange={(e) => handleChangeReply(e)}
                              placeholder="Add a comment..."
                              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              type="submit"
                              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                            >
                              Add Comment
                            </button>
                          </form>
                        )}
                      </li>
                    )}
                    {com.reply2 && (
                      <li className="mt-2">
                        <div className="font-semibold">{com.reply2.user}</div>
                        <div className="text-sm text-gray-500">
                          {com.reply2.createdAt}
                        </div>
                        <div className="mt-1">{com.reply2.text}</div>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>

    // {/* <MenuList list={menus} /> */}
    // </div>
  );
}
