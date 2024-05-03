import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function useBook() {
  let ref1 = collection(db, "Lista Completa");
  let List = [];
  onSnapshot(ref1, (snap) => {
    snap.docs.forEach((doc) => {
      // console.log(doc.data());
      List.push(doc.data());
    });
    console.log(List);
  });
  return List;
}
