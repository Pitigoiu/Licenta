import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default async function useUsers(userLoggedIn, email) {
  if (userLoggedIn) {
    let y = doc(db, "Users", `${email}`);
    const userSnap = await getDoc(y);
    if (userSnap.exists) {
      //   console.log(userSnap.data());
      return userSnap.data();
    } else {
      return "No users";
    }
  }
}
