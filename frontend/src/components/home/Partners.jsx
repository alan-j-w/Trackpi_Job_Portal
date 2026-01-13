// src/components/Partners.jsx
import { motion } from "framer-motion";

import p1 from "../../assets/partners/partner1.png";
import p2 from "../../assets/partners/partner2.png";
import p3 from "../../assets/partners/partner3.png";
import p4 from "../../assets/partners/partner4.png";

const Partners = () => {
  const logos = [p1, p2, p3, p4];

  return (
    <section className="py-20 bg-white">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
        <span className="text-[#FFB300]"> Our HiringPartners</span>
      </h2>

      <div className="w-full overflow-hidden">
        {/* LOOP SLIDER */}
        <motion.div
          className="flex gap-20 py-4"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {/* Duplicate items to make loop seamless */}
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="min-w-[200px] flex justify-center">
              <img
                src={logo}
                alt={`Partner-${index}`}
                className="h-16 md:h-24 object-contain drop-shadow-lg"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
