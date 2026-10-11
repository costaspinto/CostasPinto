"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteControls() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 360);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-24 right-5 z-[190] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-emerald-800 to-emerald-600 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/30 sm:bottom-24 sm:right-6"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
