// src/components/Partners.jsx
import { useEffect, useState } from "react";

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

  // 4 copies ensures screen is always filled during loop transition
  const track = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="pt-8 pb-0 bg-white font-cabinet">
      <h2 className="text-center text-[32px] font-[800] mb-8 tracking-wider">
        <span className="text-[#FFB300]">OUR HIRING PARTNERS</span>
      </h2>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full overflow-hidden">
        <div className="marquee-track flex items-center gap-16 py-6" style={{ width: "max-content" }}>
          {track.map((partner, index) => (
            <div key={index} className="flex-shrink-0 flex justify-center items-center">
              <img
                src={partner.logo?.url}
                alt={partner.organizationname}
                className="h-12 md:h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
