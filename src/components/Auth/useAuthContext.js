import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../firebase/config";

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  console.log(context);
  if (!context) {
    throw Error("UseAuthContext must be inside an AuthContextProvider");
  }
  return context;
};
export const doCreateuserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  //open pop-up to log in with google
  const result = await signInWithPopup(auth, provider);

  const user = result.user;

  // add user to firestore
};

export const doSignOut = () => {
  try {
    return auth.signOut();
  } catch (error) {}
};

export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = async (email, password, newpassword) => {
  const credential = EmailAuthProvider.credential(email, password);
  reauthenticateWithCredential(auth.currentUser, credential)
    .then(() => {
      updatePassword(auth.currentUser, newpassword)
        .then(() => {
          alert("Parola schimbata cu succes");
        })
        .catch((error) => alert("Parola nu a fost actualizata" + error));
    })
    .catch((error) => {
      alert("Parola nu a fost actualizata " + error);
    });
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
