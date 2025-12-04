
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PetalStyle {
  left: string;
  fontSize: string;
  opacity: number;
  x1: string;
  x2: string;
  rotate1: number;
  rotate2: number;
  duration: number;
  delay: number;
}

const createPetalStyle = (): PetalStyle => ({
    left: `${Math.random() * 100}%`,
    fontSize: `${Math.random() * 1.5 + 0.5}rem`,
    opacity: Math.random() * 0.3 + 0.1,
    x1: `${Math.random() * 20 - 10}vw`,
    x2: `${Math.random() * 20 - 10}vw`,
    rotate1: Math.random() * 360,
    rotate2: Math.random() * 360,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
});


export const FloatingPetalsBackground = () => {
    const [petals, setPetals] = useState<PetalStyle[]>([]);

    useEffect(() => {
        // Generate petal styles only on the client-side
        setPetals(Array.from({ length: 15 }).map(createPetalStyle));
    }, []);

    // Render nothing on the server and initial client render to prevent mismatch
    if (petals.length === 0) {
        return null;
    }

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {petals.map((style, i) => (
          <motion.div
            key={i}
            className="absolute text-primary"
            style={{
              left: style.left,
              fontSize: style.fontSize,
              opacity: style.opacity,
            }}
            animate={{
              y: ['-10vh', '110vh'],
              x: [style.x1, style.x2],
              rotate: [style.rotate1, style.rotate2],
            }}
            transition={{
              duration: style.duration,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: style.delay,
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>
    );
  };
