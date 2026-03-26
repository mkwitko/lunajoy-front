import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useCheckAuth } from "@/http/generated/auth/auth";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  {
    title: "Your feelings matter",
    description:
      "Track your emotions, understand your patterns, and take control of your well-being.",
  },
  {
    title: "Small steps, big impact",
    description:
      "Daily check-ins help you build awareness and improve your mental health over time.",
  },
  {
    title: "A safe space for you",
    description:
      "Express yourself freely and privately — this is your personal journey.",
  },
  {
    title: "Consistency creates clarity",
    description: "The more you track, the more you understand yourself.",
  },
];

export function PublicLayout() {
  const { data, isLoading } = useCheckAuth();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!data) return;
    if (data.isAuthenticated) navigate("/");
  }, [data]);

  // slower rotation (feels calmer)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const current = messages[index];

  if (isLoading) return null;

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* 🌸 LEFT SIDE */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* 🌫 Ambient gradient layer */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, hsl(var(--primary)/0.15), transparent 60%), radial-gradient(circle at 80% 70%, hsl(var(--secondary)/0.15), transparent 60%)",
              "radial-gradient(circle at 30% 40%, hsl(var(--primary)/0.18), transparent 60%), radial-gradient(circle at 70% 60%, hsl(var(--secondary)/0.18), transparent 60%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* 🫧 breathing glow (VERY subtle) */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* CONTENT */}
        <div className="relative z-10" />

        <div className="relative z-10 max-w-md space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
            >
              <h1 className="text-3xl font-semibold tracking-tight">
                {current.title}
              </h1>

              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ✨ minimal indicator */}
          <div className="flex gap-2 mt-6">
            {messages.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === index ? 24 : 8,
                  opacity: i === index ? 1 : 0.4,
                }}
                transition={{ duration: 0.6 }}
                className="h-1.5 rounded-full bg-primary/70"
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} LunaJoy
        </div>
      </div>

      {/* 🔐 RIGHT SIDE */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </main>
  );
}
