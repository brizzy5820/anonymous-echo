
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Sign up
export const signUp = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  //  SET displayName in Firebase Auth
  await updateProfile(user, {
    displayName
  });

  // Save user profile to Firestore on signup
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email,
    displayName,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });

  return user;
};

// Sign in
export const signIn = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  // Update last login on every sign in
  await setDoc(doc(db, "users", user.uid), {
    lastLogin: serverTimestamp(),
  }, { merge: true }); // merge:true so it doesn't overwrite the whole doc

  return user;
};

// Sign out
export const logOut = () => signOut(auth);