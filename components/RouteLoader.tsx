"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";

export default function RouteLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleStart = () => {
      // Add a slight delay to avoid flashing the loader for very fast transitions
      timeout = setTimeout(() => setLoading(true), 100);
    };
    const handleComplete = () => {
      clearTimeout(timeout);
      setLoading(false);
    };

    // Listen to router events
    router.events?.on?.("routeChangeStart", handleStart);
    router.events?.on?.("routeChangeComplete", handleComplete);
    router.events?.on?.("routeChangeError", handleComplete);

    // Fallback: hide loader when path changes (for Next 13+ App Router)
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 pointer-events-none">
      <Spinner size={60} color="#6366f1" />
    </div>
  );
}