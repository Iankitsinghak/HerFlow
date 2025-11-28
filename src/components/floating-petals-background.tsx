'use client';

import { motion } from 'framer-motion';

export const FloatingPetalsBackground = () => {
    const petals = Array.from({ length: 15 });
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {petals.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 1.5 + 0.5}rem`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              y: ['-10vh', '110vh'],
              x: [`${Math.random() * 20 - 10}vw`, `${Math.random() * 20 - 10}vw`],
              rotate: [Math.random() * 360, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: Math.random() * -20,
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>
    );
  };
