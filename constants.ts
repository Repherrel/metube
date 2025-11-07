export const FREE_SEARCH_LIMIT = 5;
export const SUBSCRIPTION_PRICE = 20;

// For the app to function with real Google Sign-In, you must provide a
// valid Google Client ID in your environment variables.
// For demonstration purposes, we use a placeholder. The Google Sign-In button
// will show an error if you try to use it without a real ID.
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
  console.warn(
    'MeTube is using a placeholder Google Client ID. ' +
    'Sign-In will not work until you provide a real GOOGLE_CLIENT_ID.'
  );
}
