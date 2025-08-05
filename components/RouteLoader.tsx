"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Spinner from "@/components/ui/Spinner";

export default function RouteLoader() {
  const pathname = usePathname();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't show loader during authentication checks or redirects
    if (status === 'loading' || pathname === '/login' || pathname === '/signup') {
      setLoading(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    // Start loader with a slight delay to avoid flashing for fast transitions
    setLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLoading(true), 150);

    // Hide loader after a short time (simulate loading, or you can adjust duration)
    const minDuration = 300; // ms - reduced from 400ms
    const hideTimeout = setTimeout(() => setLoading(false), minDuration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(hideTimeout);
    };
  }, [pathname, status]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 pointer-events-none">
      <Spinner size={60} color="#6366f1" />
    </div>
  );
}