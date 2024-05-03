import React, { useEffect, useState } from "react";
import AddChapters from "./AddChapters";
import DeleteChapter from "./DeleteChapters";
import UpdateElement from "./UpdateElement";
import AddManga from "./AddManga";
import ShowPanel from "./ShowPanel";
import "./tabs.css";
import useUsers from "../hooks/useUsers";
import { useAuthContext } from "../Auth/useAuthContext";
import { Navigate, useNavigate } from "react-router-dom";
export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const { userLoggedIn, currentUser } = useAuthContext();

  const userData = useUsers(userLoggedIn, currentUser?.email);
  useEffect(() => {
    userData.then((data) => setUser(data));
  }, []);
  useEffect(() => {
    if (!user) return;
    console.log(user.admin);
  }, [user]);
  if (!currentUser) return navigate("/");
  if (!user.admin) return navigate("/");

  const tabs = [
    { label: "Add Chapters", content: <AddChapters /> },
    { label: "Delete Chapter", content: <DeleteChapter /> },
    { label: "Update Chapter", content: <UpdateElement /> },
    { label: "Add Manga", content: <AddManga /> },
  ];
  return (
    <div>
      <ShowPanel tabs={tabs} />
    </div>
  );
}
