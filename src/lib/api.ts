import { auth } from './firebase';

/**
 * Robust Fetch wrapper for CareerCompass AI.
 * Automatically retrieves the current authenticated Firebase user's ID token and passes:
 *   Authorization: Bearer <ID_TOKEN>
 * When in guest mode, it cleanly executes without the authorization header,
 * enabling guest-supported features to function without friction.
 */
export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const options: RequestInit = init ? { ...init } : {};
  const headers = new Headers(options.headers || {});

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const idToken = await currentUser.getIdToken();
      if (idToken) {
        headers.set('Authorization', `Bearer ${idToken}`);
      }
    }
  } catch (err) {
    console.warn('[CareerCompass API] Failed to attach Firebase ID token:', err);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  options.headers = headers;
  return fetch(input, options);
}
