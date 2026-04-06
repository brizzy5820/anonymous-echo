import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Post } from "./types";

// ── Create a post ──────────────────────────────────────────
export const createPost = async (data: {
  nickname: string;
  category: string;
  title: string;
  content: string;
  uid: string | null;
}): Promise<string> => {
  const ref = await addDoc(collection(db, "posts"), {
    ...data,
    likes: 0,
    comments: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
  return ref.id;
};
// Report a Post
// ── Report a post ──────────────────────────────────────────
export const reportPost = async (
  postId: string,
  data: {
    reason: string;
    reportedBy: string | null;  // uid or null for guest
    nickname?: string;
  }
) => {
  await addDoc(collection(db, "reports"), {
    postId,
    ...data,
    status: "pending",          // admin will update to reviewed/removed
    createdAt: serverTimestamp(),
  });
  // Flag the post as having reports
  await updateDoc(doc(db, "posts", postId), {
    reportCount: increment(1),
  });
};
// ── Fetch all posts (home feed) ────────────────────────────
export const fetchPosts = async (category?: string): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = category
    ? query(postsRef, where("category", "==", category), orderBy("createdAt", "desc"))
    : query(postsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString() ?? new Date().toISOString(),
  })) as Post[];
};

// ── Fetch single post ──────────────────────────────────────
export const fetchPost = async (postId: string): Promise<Post | null> => {
  const snap = await getDoc(doc(db, "posts", postId));
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...snap.data(),
    createdAt: snap.data().createdAt?.toDate().toISOString() ?? new Date().toISOString(),
  } as Post;
};

// ── Fetch posts by a specific user ─────────────────────────
export const fetchUserPosts = async (uid: string): Promise<Post[]> => {
  const q = query(
    collection(db, "posts"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString() ?? new Date().toISOString(),
  })) as Post[];
};

// ── Toggle like on a post ──────────────────────────────────
export const toggleLike = async (
  postId: string,
  uid: string,
  hasLiked: boolean
) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likedBy: hasLiked ? arrayRemove(uid) : arrayUnion(uid),
    likes: increment(hasLiked ? -1 : 1),
  });
};

// ── Add a comment ──────────────────────────────────────────
export const addComment = async (
  postId: string,
  data: {
    nickname: string;
    content: string;
    uid: string | null;
  }
) => {
  // Add comment document
  await addDoc(collection(db, "posts", postId, "comments"), {
    ...data,
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
  // Increment comment count on the post
  await updateDoc(doc(db, "posts", postId), {
    comments: increment(1),
  });
};

// ── Fetch comments for a post ──────────────────────────────
export const fetchComments = async (postId: string) => {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString() ?? new Date().toISOString(),
  }));
};

// ── Toggle like on a comment ───────────────────────────────
export const toggleCommentLike = async (
  postId: string,
  commentId: string,
  uid: string,
  hasLiked: boolean
) => {
  const commentRef = doc(db, "posts", postId, "comments", commentId);
  await updateDoc(commentRef, {
    likedBy: hasLiked ? arrayRemove(uid) : arrayUnion(uid),
    likes: increment(hasLiked ? -1 : 1),
  });
};
// ── Pin a post ─────────────────────────────────────────────
// We first unpin ALL posts by this user then pin the selected one
// This enforces "only one pinned post at a time" rule
export const pinPost = async (postId: string, uid: string) => {
  // Get all posts by this user
  const q = query(
    collection(db, "posts"),
    where("uid", "==", uid)
  );
  const snapshot = await getDocs(q);
  
  // Batch — unpin everything first then pin the selected one
  // Batch means all updates happen together in one Firestore call
  // instead of multiple separate calls — more efficient and atomic
  const batch = writeBatch(db);
  
  snapshot.docs.forEach((d) => {
    batch.update(d.ref, { pinned: false });
  });
  
  // Now pin the selected post
  batch.update(doc(db, "posts", postId), { pinned: true });
  
  await batch.commit();
};

// ── Unpin a post ───────────────────────────────────────────
export const unpinPost = async (postId: string) => {
  await updateDoc(doc(db, "posts", postId), { pinned: false });
};

// ── Delete a post ──────────────────────────────────────────
// We also delete all comments under it using a batch
// Firestore doesn't auto-delete subcollections when parent is deleted
export const deletePost = async (postId: string) => {
  // Delete all comments in the subcollection first
  const commentsSnap = await getDocs(
    collection(db, "posts", postId, "comments")
  );
  
  const batch = writeBatch(db);
  commentsSnap.docs.forEach((d) => batch.delete(d.ref));
  
  // Then delete the post itself
  batch.delete(doc(db, "posts", postId));
  
  await batch.commit();
};