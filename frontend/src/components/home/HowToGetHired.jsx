import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// 🔹 import icons
import apply from "../../assets/howToHire/apply.png";
import connect from "../../assets/howToHire/connect.png";
import hrInterview from "../../assets/howToHire/hrInterview.png";
import salesInterview from "../../assets/howToHire/salesInterview.png";
import walkin from "../../assets/howToHire/walkin.png";
import placed from "../../assets/howToHire/placed.png";

// 📌 Sizes: Desktop / Mobile
const circleDesktop = 650;
const circleMobile = 380;

const steps = [
  { image: apply, label: "Apply for job", angle: 160 },
  { image: connect, label: "HR will connect you soon", angle: 90 },
  { image: hrInterview, label: "HR Level interview", angle: 15 },
  { image: salesInterview, label: "Sales Level interview", angle: -50 },
  { image: walkin, label: "Walk in interview", angle: -130 },
];

export default function HowToGetHired() {
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [size, setSize] = useState(circleDesktop);
  const [hasEntered, setHasEntered] = useState(false);
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);
  // Trigger earlier (amount: 0.2) and allow re-trigger if needed, but we gate it with hasEntered
  const isInView = useInView(sectionRef, { amount: 0.2 });

  // 📱 Detect Screen Size
  useEffect(() => {
    const updateSize = () => {
      setSize(window.innerWidth < 768 ? circleMobile : circleDesktop);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const radius = size / 2;
  const strokeWidth = size < 500 ? 14 : 20;
  const normalizedRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * normalizedRadius;
  const iconDistance = radius - (size < 500 ? 75 : 100);

  const startLoop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === steps.length - 1) {
          clearInterval(intervalRef.current);
          setIsCompleted(true);
          setTimeout(() => {
            setIsCompleted(false);
            setActiveStep(0);
            startLoop();
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  useEffect(() => {
    if (isInView) {
      if (!hasEntered) {
        setHasEntered(true);
        setTimeout(() => {
          setActiveStep(1);
          startLoop();
        }, 500);
      }
    } else {
      setHasEntered(false);
      setIsCompleted(false);
      setActiveStep(0);
      clearInterval(intervalRef.current);
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white flex flex-col items-center overflow-hidden min-h-[600px]"
    >

      <h2 className="text-3xl md:text-5xl font-bold mb-10 md:mb-16 text-center">
        How to <span className="text-[#FFB300]">get Hired</span>
      </h2>

      <div
        className="relative"
        style={{ width: size, height: size, transition: "0.3s ease-in-out" }}
      >

        {/* Base Circle */}
        <svg
          width={size}
          height={size}
          className="absolute top-0 left-0 -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          <motion.circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#E6E6E6"
            strokeWidth={strokeWidth}
            initial={{ opacity: 0 }}
            animate={{ opacity: hasEntered ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.circle
            cx={radius}
            cy={radius}
            r={normalizedRadius - 2}
            fill={isCompleted ? "#FFB300" : "transparent"}
            transition={{ duration: 0.5 }}
          />

          {hasEntered && (
            <motion.circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke="#FFB300"
              strokeWidth={strokeWidth + 2}
              strokeLinecap="butt"
              strokeDasharray={`0 ${circumference}`} // Initial state
              initial={{
                rotate: -steps[0].angle + 90, // Align start to the first step
              }}
              style={{
                originX: "50%",
                originY: "50%",
              }}
              animate={{
                strokeDasharray: `${((steps[0].angle - steps[activeStep].angle) / 360) * circumference} ${circumference}`,
                opacity: isCompleted ? 0 : 1,
              }}
              transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </svg>

        {/* 🎯 Center (Placed) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={hasEntered ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <motion.img
              src={placed}
              alt="Placed"
              className="w-28 md:w-64 drop-shadow"
              animate={{
                scale: isCompleted ? 1.2 : 1,
                opacity: isCompleted ? 1 : 0.3,
              }}
            />
            <motion.p
              className="mt-3 text-lg md:text-3xl font-bold"
              animate={{ opacity: isCompleted ? 1 : 0.3 }}
            >
              Placed
            </motion.p>
          </motion.div>
        </div>

        {/* ⏩ Chevrons (>>) */}
        {hasEntered && steps.map((step, index) => {
          if (index === steps.length - 1) return null; // No chevrons after last step

          const nextStep = steps[index + 1];
          const angleDiff = step.angle - nextStep.angle;
          const chevronAngles = [
            step.angle - angleDiff * 0.33,
            step.angle - angleDiff * 0.66,
          ];

          return chevronAngles.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            // Standard Math Logic: x = r*cos, y = r*sin. Center (radius, radius)
            // Left = radius + x, Top = radius - y
            const x = normalizedRadius * Math.cos(rad);
            const y = normalizedRadius * Math.sin(rad);

            return (
              <div
                key={`chevron-${index}-${i}`}
                className="absolute flex items-center justify-center pointer-events-none z-10"
                style={{
                  left: radius + x,
                  top: radius - y,
                  width: 20, // Approximate size
                  height: 20,
                  transform: `translate(-50%, -50%) rotate(${90 - angle}deg)`,
                }}
              >
                {/* Chevron Icon > */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            );
          });
        })}

        {/* 📌 Steps */}
        {steps.map((step, index) => {
          const rad = (step.angle * Math.PI) / 180;
          const x = iconDistance * Math.cos(rad);
          const y = iconDistance * Math.sin(rad);
          const isActive = index === activeStep;

          return (
            <motion.div
              key={index}
              className="absolute flex flex-col items-center"
              initial={{ left: radius, top: radius, scale: 0, opacity: 0 }}
              animate={hasEntered ? {
                left: radius + x,
                top: radius - y,
                scale: 1,
                opacity: isCompleted ? 0.3 : 1,
              } : {}}
              transition={{
                duration: 1,
                ease: "circOut",
                delay: index * 0.1
              }}
              style={{
                translate: "-50% -50%",
                width: size < 500 ? 120 : 250,
              }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={step.image}
                  alt={step.label}
                  className="w-32 h-32 md:w-60 md:h-60 object-contain"
                />
              </div>
              <p
                className={`text-[10px] md:text-sm font-semibold mt-2 text-center ${isActive ? "text-black" : "text-gray-400"
                  }`}
              >
                {step.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
