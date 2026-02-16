import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// 🔹 import icons
import apply from "../../assets/howToHire/apply.png";
import connect from "../../assets/howToHire/connect.png";
import hrInterview from "../../assets/howToHire/hrInterview.png";
import salesInterview from "../../assets/howToHire/salesInterview.png";
import walkin from "../../assets/howToHire/walkin.png";
import placed from "../../assets/howToHire/placed.png";

// 📌 Sizes
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

  // 📱 Responsive size
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

  // 🔄 Auto Step Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === steps.length - 1) {
          setIsCompleted(true);
          setTimeout(() => {
            setIsCompleted(false);
            setActiveStep(0);
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white flex flex-col items-center overflow-hidden min-h-[600px]">

      {/* TITLE */}
      <h2 className="text-3xl md:text-5xl font-bold mb-10 md:mb-16 text-center">
        How to <span className="text-[#FFB300]">get Hired</span>
      </h2>

      <div
        className="relative"
        style={{ width: size, height: size }}
      >

        {/* Base Circle */}
        <svg
          width={size}
          height={size}
          className="absolute top-0 left-0 -rotate-90"
        >
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#E6E6E6"
            strokeWidth={strokeWidth}
          />

          {/* Progress Line */}
          <motion.circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#FFB300"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference -
              (activeStep / (steps.length - 1)) * circumference
            }
            transition={{ duration: 0.6 }}
          />
        </svg>

        {/* 🎯 CENTER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
          <motion.img
            src={placed}
            alt="Placed"
            className="w-28 md:w-64 drop-shadow"
            animate={{
              scale: isCompleted ? 1.2 : 1,
              opacity: isCompleted ? 1 : 0.4,
            }}
            transition={{ duration: 0.5 }}
          />
          <p className="mt-2 text-xl md:text-3xl font-bold">
            Placed
          </p>
        </div>

        {/* 📌 STEPS */}
        {steps.map((step, index) => {
          const rad = (step.angle * Math.PI) / 180;
          const x = iconDistance * Math.cos(rad);
          const y = iconDistance * Math.sin(rad);
          const isActive = index === activeStep;

          return (
            <motion.div
              key={index}
              className="absolute flex flex-col items-center text-center"
              style={{
                left: radius + x,
                top: radius - y,
                translate: "-50% -50%",
                width: size < 500 ? 140 : 280,
              }}
              animate={{
                opacity: isCompleted ? 0.3 : 1,
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              {/* IMAGE */}
              <img
                src={step.image}
                alt={step.label}
                className="w-32 h-32 md:w-56 md:h-56 object-contain"
              />

              {/* TEXT */}
              <p
                className={`mt-1 text-sm md:text-xl font-semibold leading-tight ${
                  isActive ? "text-black" : "text-gray-400"
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

