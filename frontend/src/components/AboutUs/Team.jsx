import rahulImg from "../../assets/about images/rahul.png";
import ashwaniImg from "../../assets/about images/ashwani.png";
import kalpanaImg from "../../assets/about images/kalpana.png";

import { FaLinkedinIn, FaEnvelope } from "react-icons/fa";

const team = [
  { name: "Rahul K.", role: "UI/UX Designer", img: rahulImg },
  { name: "Aswini N.", role: "Senior Consultant", img: ashwaniImg },
  { name: "Kalpana K.", role: "Business Analyst", img: kalpanaImg },
  { name: "Kalpana K.", role: "Product Manager", img: kalpanaImg },
];

const Team = () => {
  return (
    <section className="bg-gray-50 py-20">
      <h2
        className="text-center text-[50px] font-bold mb-16"
        style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
      >
        Meet <span className="text-yellow-400">Our Team</span>
      </h2>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 place-items-center">
        {team.map((member, i) => (
          <div
            key={i}
            className="
              w-[280px] h-[360px]
              bg-white rounded-2xl shadow-lg
              flex flex-col items-center justify-between
              py-8
            "
          >
            {/* Image */}
            <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="text-center">
              <h4 className="font-semibold text-xl mb-1">{member.name}</h4>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>

            {/* Icons */}
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white cursor-pointer">
                <FaLinkedinIn size={14} />
              </span>
              <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white cursor-pointer">
                <FaEnvelope size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
