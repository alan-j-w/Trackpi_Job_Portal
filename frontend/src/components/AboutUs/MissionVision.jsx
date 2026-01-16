import missionIcon from "../../assets/icons/mission.png"; // Replace with your actual paths
import visionIcon from "../../assets/icons/vision.png";
import valuesIcon from '../../assets/icons/value.png'

const MissionVision = () => {
  return (
    <section className="bg-white pb-10 pt-10">
      {/* Section Heading */}
      <h2
        className="text-center font-cabinet font-bold text-[50px] leading-[63px] mb-16"
        style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
      >
        <span className="text-yellow-400">Our</span> Mission, Vision & Values
      </h2>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {[
          {
            src: missionIcon,
            desc: "To provide career and business consulting solutions.",
            icon: missionIcon
          },
          {
            src: visionIcon,
            desc: "To be the leading bridge between talent and opportunity.",
            icon: visionIcon
          },
          {
            src: valuesIcon,
            desc: "Integrity, Growth, Innovation, and Empathy.",
            icon: valuesIcon
          },
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-center flex flex-col items-center">
            {/* Icon Circle */}
            <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain" />
            </div>

            {/* Card Title */}
            <h3 className="font-cabinet font-bold text-[28.67px] leading-[28.67px] mb-4 text-black">
              <span className="text-yellow-400">Our</span> {item.title}
            </h3>

            {/* Card Description - Applied Figma Props Here */}
            <p
              className="font-lato text-[19.11px] leading-[28.67px] text-[#555555] max-w-[264px]"
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionVision;