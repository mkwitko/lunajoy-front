import { motion } from "framer-motion";
import { GoogleAuthButton } from "@/components/google-auth-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { usePostAuthGoogle } from "@/http/generated/auth/auth";
import { queryClient } from "@/lib/react-query";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();

  const { mutateAsync: googleAuth, isPending } = usePostAuthGoogle({
    mutation: {
      onSuccess: () => {
        queryClient.clear();
        navigate("/", { replace: true });
      },
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-xl shadow-primary/5">
        <CardHeader className="text-center space-y-3 pb-2">
          {/* ✨ Title */}
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>

          {/* 🧠 Emotional copy */}
          <CardDescription className="text-sm leading-relaxed max-w-xs mx-auto">
            Take a moment for yourself. Continue your journey toward balance and
            well-being.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* 🔐 Google Auth */}
          <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <GoogleAuthButton
              onSuccess={async (idToken) => {
                await googleAuth({
                  data: { idToken },
                });
              }}
            />
          </motion.div>

          {/* ✨ Divider */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <div className="flex-1 h-px bg-border/60" />
            secure authentication
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* 🛡 Trust signal */}
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            Your data is private and securely encrypted. We never share your
            personal information.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
