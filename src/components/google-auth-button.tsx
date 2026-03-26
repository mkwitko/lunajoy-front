import { env } from "@/env";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

type Props = {
  onSuccess: (idToken: string) => Promise<void>;
};

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();

    document.body.appendChild(script);
  });
}

export function GoogleAuthButton({ onSuccess }: Props) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      await loadGoogleScript();

      if (!isMounted || !window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            setIsLoading(true);
            await onSuccess(response.credential);
          } finally {
            setIsLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        shape: "pill", // ✨ premium touch
        text: "continue_with",
      });

      setIsLoading(false);
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [onSuccess]);

  return (
    <div className="w-full">
      <div ref={buttonRef} />

      {isLoading && (
        <div className="h-11 w-full rounded-full bg-muted/60 animate-pulse" />
      )}
    </div>
  );
}
