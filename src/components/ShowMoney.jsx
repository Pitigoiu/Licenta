import React, { useEffect } from "react";
import { useAuth } from "./Auth/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ShowMoney() {
  const { currentUser } = useAuth();

  async function updateMoney() {
    const myValue = parseInt(localStorage.getItem("banuti"));
    console.log(myValue);
    console.log(typeof myValue);
    localStorage.removeItem("banuti");
    let y = doc(db, "Users", `${currentUser.email}`);
    const userSnap = await getDoc(y);
    if (userSnap.exists) {
      console.log(userSnap.data().tokens);
      console.log(typeof userSnap.data().tokens);
      console.log(myValue);
      let total = userSnap.data().tokens + myValue;
      console.log(total);
      await setDoc(y, { tokens: total }, { merge: true });
    }
    window.close();
  }
  useEffect(() => {
    return () => updateMoney();
  }, []);

  return <div>ShowMoney</div>;
}
