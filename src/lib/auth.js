import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Sign up
export const signUp = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  // Set displayName in Firebase Auth profile
  await updateProfile(user, {
    displayName,
  });

  // Keep auth success even if Firestore profile write fails.
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error("Unable to persist user profile in Firestore:", error);
  }

  return user;
};

// Sign in
export const signIn = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  // Update last login, but do not block login flow if Firestore is restricted/offline.
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Unable to update lastLogin in Firestore:", error);
  }

  return user;
};

// Sign out
export const logOut = () => signOut(auth);
