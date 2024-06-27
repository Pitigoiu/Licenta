import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState } from "react";

let ref1 = collection(db, "Lista Completa");
export default function useBook() {
  const [list, setList] = useState([]);
  onSnapshot(ref1, (snap) => {
    snap.docs.forEach((doc) => {
      // console.log(doc.data());
      setList((prev) => ({ ...doc.data() }));
      // List.push(doc.data());
    });
    console.log(list);
  });
  return { list };
}
