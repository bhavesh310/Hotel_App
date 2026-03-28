import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial="initial"
    animate="enter"
    exit="exit"
    variants={variants}
  >
    {children}
  </motion.div>
);
