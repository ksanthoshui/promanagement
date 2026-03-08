import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

interface CounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({ 
  value, 
  duration = 2, 
  suffix = "", 
  prefix = "", 
  decimals = 0,
  className = "" 
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + latest.toFixed(decimals) + suffix;
  });

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return controls.stop;
  }, [value, duration, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

export default Counter;
