import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IconRotateClockwise } from "@tabler/icons-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/access");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <IconRotateClockwise className="animate-spin mr-2" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
