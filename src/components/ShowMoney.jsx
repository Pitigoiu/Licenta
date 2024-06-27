import React, { useEffect } from "react";
import { useAuth } from "./Auth/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ShowMoney() {
  const { currentUser } = useAuth();

  async function updateMoney() {
    const myValue = parseInt(localStorage.getItem("banuti"));

    localStorage.removeItem("banuti");
    let y = doc(db, "Users", `${currentUser.email}`);
    const userSnap = await getDoc(y);
    if (userSnap.exists) {
      let total = userSnap.data().tokens + myValue;

      await setDoc(y, { tokens: total }, { merge: true });
    }
    window.close();
  }
  useEffect(() => {
    return () => updateMoney();
  }, []);

  return (
    <div>
      <div class="w-1/4 text-center text-xl m-8 grid grid-cols-3 gap-1 justify-evenly">
        <div class="bg-green-300 rounded-lg h-12">1</div>
        <div class="bg-green-300 rounded-lg h-12">2</div>
        <div class="bg-green-300 rounded-lg h-12">3</div>
        <div class="bg-gradient-to-r col-span-2 from-cyan-300 via-teal-600 to-fucshia-500 rounded-lg h-12">
          4
        </div>
        <div class="bg-green-300 rounded-lg h-12">5</div>
        <div class="bg-green-500 col-span-3 rounded-lg h-12">6</div>
      </div>
    </div>
  );
}
