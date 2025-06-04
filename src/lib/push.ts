import { supabase } from "@/lib/supabase";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function registerPush(userId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const registration = await navigator.serviceWorker.register('/sw.js');
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey!),
  });

  await supabase.from('device_tokens').insert({
    user_id: userId,
    token: JSON.stringify(subscription),
  });
}

export async function fetchNotifications(userId: string) {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

