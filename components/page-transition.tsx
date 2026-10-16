"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_LOADING_TIME = 2000;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {children}
      <RouteLoadingOverlay key={pathname} />
    </>
  );
}

function RouteLoadingOverlay() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, MIN_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="bg-background fixed inset-0 z-[9999] overflow-hidden"
          initial={{
            clipPath: "inset(0% 0% 0% 0%)",
          }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
          }}
          exit={{
            clipPath: "inset(0% 100% 0% 0%)",
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          {/* Mascot DOES NOT MOVE */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(20px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              src="/mascot.svg"
              alt=""
              className="h-40 w-40 md:h-52 md:w-52 lg:h-64 lg:w-64"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
