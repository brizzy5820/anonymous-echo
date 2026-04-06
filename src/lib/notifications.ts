import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Notification } from "./types";

// ── Send a notification ────────────────────────────────────
export const sendNotification = async (data: {
  recipientUid: string;
  senderNickname: string;
  senderUid: string | null;
  type: "like" | "comment" | "follow" | "trending";
  message: string;
  postId?: string;
}) => {
  // Don't notify yourself
  if (data.senderUid === data.recipientUid) return;

  await addDoc(collection(db, "notifications"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
};

// ── Fetch notifications for a user ────────────────────────
export const fetchNotifications = async (
  uid: string
): Promise<Notification[]> => {
  const q = query(
    collection(db, "notifications"),
    where("recipientUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt:
      doc.data().createdAt?.toDate().toISOString() ??
      new Date().toISOString(),
  })) as Notification[];
};

// ── Mark one notification as read ─────────────────────────
export const markAsRead = async (notificationId: string) => {
  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
};

// ── Mark all notifications as read ────────────────────────
export const markAllAsRead = async (uid: string) => {
  const q = query(
    collection(db, "notifications"),
    where("recipientUid", "==", uid),
    where("read", "==", false)
  );
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.update(d.ref, { read: true });
  });
  await batch.commit();
};

// ── Get unread count ───────────────────────────────────────
export const getUnreadCount = async (uid: string): Promise<number> => {
  const q = query(
    collection(db, "notifications"),
    where("recipientUid", "==", uid),
    where("read", "==", false)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};