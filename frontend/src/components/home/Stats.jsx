import React from "react";

const Stats = () => {
  return (
    <section className="w-full bg-white py-12 px-4 flex justify-center">
      {/* ⭐⭐ COMPONENT WRAPPER ⭐⭐
        - max-w-[1086px]: Matches Figma width constraint.
        - -skew-x-12: Creates the parallelogram slant (/) 
        - rounded-[30px]: Creates the smooth "arc" on corners.
      */}
      <div
        className="
          relative w-full max-w-[1086px] 
          bg-[#FFB300] 
          text-black 
          
          /* Dimensions */
          h-auto md:h-[139px]
          flex items-center justify-center
          py-8 md:py-0 px-6 md:px-12
          
          /* Shape Adjustment: Rounded corners for TL/BR (via clip-path) and TR/BL (via border-radius) */
          rounded-tr-[30px] rounded-bl-[30px]
        "
        style={{
          clipPath:
            "polygon(50px 0, 100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 50px)",
        }}
      >

        {/* ⭐⭐ CONTENT CONTAINER ⭐⭐ */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">

          {/* ➤ ITEM 1: 100+ */}
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-5xl md:text-[64px] font-normal leading-tight tracking-tight">
              100+
            </h3>
            <p className="text-sm md:text-[14px] font-medium text-black mt-0">
              Number of Active Vacancies
            </p>
          </div>

          {/* ➤ ITEM 2: 41+ (With Live Dot) */}
          <div className="flex flex-col items-center justify-center relative text-center">
            <h3 className="text-5xl md:text-[64px] font-normal leading-tight tracking-tight">
              41+
            </h3>

            <div className="flex items-center justify-center gap-2 mt-0">
              {/* Pulsing Red Dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E35353] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E35353]"></span>
              </span>
              <p className="text-sm md:text-[14px] font-medium text-black">
                Live Interviews Ongoing
              </p>
            </div>
          </div>

          {/* ➤ ITEM 3: 72+ */}
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-5xl md:text-[64px] font-normal leading-tight tracking-tight">
              72+
            </h3>
            <p className="text-sm md:text-[14px] font-medium text-black mt-0">
              Placement Count
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Stats;