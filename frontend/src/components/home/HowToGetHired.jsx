
import { motion, useAnimation, useMotionValue, animate, useMotionValueEvent, useTransform } from "framer-motion";
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

/**
 * Helper to calculate SVG path for an arc
 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  // SVG Y is down, so we flip the Y axis logic relative to standard math
  // Angle: 90 is top. Standard math 90 is top.
  // We want standard math coordinates mapped to SVG.
  // x = cx + r * cos(a)
  // y = cy - r * sin(a)  <-- minus because SVG Y grows down
  var angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians),
  };
}



export default function HowToGetHired() {
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

  // Arc Definition
  const startAngle = 90;
  const endAngle = -200;
  const totalSweep = Math.abs(endAngle - startAngle); // 290

  return (
    <AnimationContent
      size={size}
      radius={radius}
      normalizedRadius={normalizedRadius}
      strokeWidth={strokeWidth}
      startAngle={startAngle}
      totalSweep={totalSweep}
      steps={steps}
    />
  );
}



function AnimationContent({ size, radius, normalizedRadius, strokeWidth, startAngle, totalSweep, steps }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [arrowState, setArrowState] = useState({ x: 0, y: 0, angle: 90 });
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(1);

  // Single source of truth for progress (0 to 1)
  const progress = useMotionValue(0);

  // Map progress (0-1) to circle fraction (0-0.8ish)
  const pathLength = useTransform(progress, [0, 1], [0, totalSweep / 360]);

  useEffect(() => {
    if (!startAnimation) return;

    let isCancelled = false;

    // Animation sequence
    const sequence = async () => {
      while (!isCancelled) {
        // Reset
        setIsCompleted(false);
        progress.set(0);
        setCurrentHighlightIndex(1); // Connect (Start)

        // Define steps with their target progress (cumulative angle / total sweep)
        // Total sweep = 290
        // Connect (Start) -> HR (15 deg): 75 deg diff. Target = 75/290
        // HR -> Sales (-50 deg): 65 deg diff. Cumulative = 140. Target = 140/290
        // Sales -> Walkin (-130 deg): 80 deg diff. Cumulative = 220. Target = 220/290
        // Walkin -> Apply (-200 deg): 70 deg diff. Cumulative = 290. Target = 1

        const checkpoints = [
          { target: 75 / 290, index: 2 },  // HR
          { target: 140 / 290, index: 3 }, // Sales
          { target: 220 / 290, index: 4 }, // Walkin
          { target: 1, index: 0 }          // Apply
        ];

        // Wait a bit before starting
        await new Promise(r => setTimeout(r, 200));
        if (isCancelled) return;

        for (const step of checkpoints) {
          if (isCancelled) return;
          // Fast fill
          await animate(progress, step.target, {
            duration: 0.22,
            ease: "easeInOut"
          });

          if (isCancelled) return;

          // Highlight the reached step
          setCurrentHighlightIndex(step.index);

          // Pause
          await new Promise(resolve => setTimeout(resolve, 450));
        }

        if (isCancelled) return;

        // Completion phase
        setIsCompleted(true);

        // Wait before repeating
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
    };

    sequence();

    return () => {
      isCancelled = true;
    };
  }, [progress, startAnimation]);

  // Sync Arrow & Highlight with Progress
  useMotionValueEvent(progress, "change", (latest) => {
    // Avoid calculations if completed (optional optimization)
    if (latest >= 1) return;

    // Calculate current angle
    // start = 90, end = -200. 
    // current = 90 - (290 * progress)
    const currentAngle = startAngle - (totalSweep * latest);

    // Calculate Arrow Pos
    const pos = polarToCartesian(radius, radius, normalizedRadius, currentAngle);

    // Update Arrow State
    setArrowState({ x: pos.x, y: pos.y, angle: 90 - currentAngle });
  });

  return (
    <motion.section
      className="py-8 md:py-12 bg-white flex flex-col items-center overflow-hidden min-h-[420px] md:min-h-[600px] font-cabinet"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      onAnimationComplete={() => setStartAnimation(true)}
      onViewportLeave={() => {
        setStartAnimation(false);
        setIsCompleted(false);
        progress.set(0);
        setCurrentHighlightIndex(1);
        setArrowState({ x: 0, y: 0, angle: 90 });
      }}
    >

      {/* TITLE */}
      <h2 className="text-3xl md:text-5xl font-bold mb-16 md:mb-24 text-center">
        How to <span className="text-[#FFB300]">get Hire</span>
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

          {/* Progress Arc - Driven by MotionValue */}
          {!isCompleted && (
            <motion.circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke="#FFB300"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ pathLength }}
            />
          )}

          {/* Full Circle Fill (On Completion) */}

        </svg>

        {/* 🎯 CENTER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          {/* Inner Yellow Circle Background for Center */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#FFB300] -z-10"
            initial={{ scale: 0 }}
            animate={isCompleted ? { scale: 1 } : { scale: 0 }}
            style={{ width: '100%', height: '100%' }}
          />

          <motion.img
            src={placed}
            alt="Placed"
            className="w-28 md:w-64 drop-shadow"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{
              opacity: isCompleted ? 1 : 0.5,
              scale: isCompleted ? [0.9, 1.1, 1] : 0.9,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.p
            className="mt-2 text-xl md:text-3xl font-bold"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{
              opacity: isCompleted ? 1 : 0.5,
              scale: isCompleted ? [0.9, 1.1, 1] : 0.9,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Placed
          </motion.p>
        </div>

        {/* 🏹 ARROW HEAD */}
        {!isCompleted && (
          <div
            className="absolute w-8 h-8 flex items-center justify-center z-20 pointer-events-none"
            style={{
              left: arrowState.x,
              top: arrowState.y,
              transform: `translate(-50%, -50%) rotate(${arrowState.angle}deg)`
            }}
          >
            {/* Double Chevron SVG */}
            <div className="flex gap-[-4px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="-ml-3">
                <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}

        {/* 📌 STEPS */}
        {steps.map((step, index) => {
          // Calculate position on the circle (using normalizedRadius to sit on the stroke)
          const rad = (step.angle * Math.PI) / 180;
          const x = normalizedRadius * Math.cos(rad);
          // SVG Y is down, standard math Y is up. To map standard angle to SVG:
          // angle 90 (top) -> cos=0, sin=1. x=0, y=radius. target: x=cx, y=cy-r.
          // x_draw = cx + r*cos(a) -> cx + 0 = cx. Correct.
          // y_draw = cy - r*sin(a) -> cy - r*1 = cy-r (Top). Correct.
          const y = normalizedRadius * Math.sin(rad);

          let isActive = index === currentHighlightIndex;
          // on completion, nothing is "active" in the loop sense, or we just dim everything.

          return (
            <motion.div
              key={index}
              className="absolute flex flex-col items-center text-center z-30"
              style={{
                left: radius + x,
                top: radius - y,
                translate: "-50% -50%",
                width: size < 500 ? 140 : 280,
              }}
              animate={{
                opacity: isCompleted ? 0.3 : 1,
                scale: isActive && !isCompleted ? 1.1 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              {/* IMAGE */}
              <img
                src={step.image}
                alt={step.label}
                className="w-24 h-24 md:w-48 md:h-48 object-contain object-bottom"
              />

              {/* TEXT */}
              <p
                className={`mt-2 text-sm md:text-lg font-bold leading-tight ${isActive ? "text-black" : "text-gray-400"
                  }`}
              >
                {step.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

