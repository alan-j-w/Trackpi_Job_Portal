// src/components/Partners.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hiringpartners?page=1&limit=20")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPartners(data.data || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setPartners([]);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!partners.length) return null;

  return (
    <section className="py-20 bg-white">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
        <span className="text-[#FFB300]">Our Hiring Partners</span>
      </h2>

      <div className="w-full overflow-hidden">
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
          {/* Duplicate for smooth loop */}
          {[...partners, ...partners].map((partner, index) => (
            <div key={index} className="min-w-[200px] flex justify-center">
              <img
                src={partner.logo?.url}
                alt={partner.organizationname}
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
