import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "./types";

// ── Fetch a user profile ───────────────────────────────────
export const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
};

// ── Update bio ─────────────────────────────────────────────
export const updateBio = async (uid: string, bio: string) => {
  await updateDoc(doc(db, "users", uid), { bio });
};

// ── Follow / Unfollow ──────────────────────────────────────
export const followUser = async (currentUid: string, targetUid: string) => {
  // Add targetUid to current user's following
  await updateDoc(doc(db, "users", currentUid), {
    following: arrayUnion(targetUid),
  });
  // Add currentUid to target user's followers
  await updateDoc(doc(db, "users", targetUid), {
    followers: arrayUnion(currentUid),
  });
};

export const unfollowUser = async (currentUid: string, targetUid: string) => {
  await updateDoc(doc(db, "users", currentUid), {
    following: arrayRemove(targetUid),
  });
  await updateDoc(doc(db, "users", targetUid), {
    followers: arrayRemove(currentUid),
  });
};

// ── Add to totalLikes when someone likes their post ────────
export const incrementUserLikes = async (uid: string, amount: 1 | -1) => {
  await updateDoc(doc(db, "users", uid), {
    totalLikes: increment(amount),
  });
};

// ── Fetch multiple user profiles by uid array ──────────────
// We need this to display follower/following lists
// Firestore doesn't support "fetch all documents where uid is in this array"
// natively in a single call so we fetch them individually in parallel
export const fetchProfilesByUids = async (
  uids: string[]
): Promise<UserProfile[]> => {
  if (uids.length === 0) return [];
  
  // Promise.all fires all fetches simultaneously instead of one by one
  const profiles = await Promise.all(
    uids.map(async (uid) => {
      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists()) return null;
      return snap.data() as UserProfile;
    })
  );
  
  // Filter out any nulls (deleted/missing users)
  return profiles.filter(Boolean) as UserProfile[];
};