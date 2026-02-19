import { Variants } from 'framer-motion';

// Section title animation variants - clean fade with Y-slide
export const titleScrollVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Minimalist card variants - simple fade with subtle Y-slide
export const minimalistCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: index * 0.15,
      ease: 'easeOut',
    },
  }),
};

// Container animation variants
export const containerScrollVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};
