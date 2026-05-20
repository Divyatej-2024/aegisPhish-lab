'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeMap[size]} border-2 border-primary border-t-transparent rounded-full`}
    />
  );
};

export const SkeletonLoader: React.FC<{ count?: number; className?: string }> = ({ count = 1, className = '' }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="h-12 bg-muted rounded-lg mb-4"
      />
    ))}
  </div>
);
