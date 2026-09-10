// Type shim for web-push (no @types/web-push available)
declare module 'web-push' {
  interface PushSubscription {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  }

  interface RequestOptions {
    vapidDetails?: { subject: string; publicKey: string; privateKey: string };
    TTL?: number;
  }

  function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
  function sendNotification(
    subscription: PushSubscription,
    payload: string | Buffer,
    options?: RequestOptions,
  ): Promise<{ statusCode: number; body: string; headers: Record<string, string> }>;
}
