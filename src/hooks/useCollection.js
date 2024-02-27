import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

//getting the collection that i want
export const useCollection = (coll) => {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    //searching from the collection that i set to
    let ref = collection(db, coll);

    const unsub = onSnapshot(ref, (snap) => {
      let res = [];
      snap.docs.forEach((doc) => {
        res.push({ ...doc.data() });
      });
      setDocuments(res);
      console.log(res);
    });
    return () => unsub();
  }, [coll]); //if i add/delete, it will reload

  return { documents };
};
