import emailjs from "@emailjs/browser";

let isInitialized = false;

export const initializeEmailJS = () => {
  if (isInitialized) return true;

  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!publicKey) {
    console.error(
      "[EmailJS] ❌ Public key is not configured in .env file. Please add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"
    );
    return false;
  }

  try {
    emailjs.init(publicKey);
    isInitialized = true;
    console.log("[EmailJS] ✅ Successfully initialized with public key");
    return true;
  } catch (error) {
    console.error("[EmailJS] ❌ Failed to initialize:", error);
    return false;
  }
};
