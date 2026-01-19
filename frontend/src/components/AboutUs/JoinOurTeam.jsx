import joinImg from "../../assets/about images/join.png";

const JoinOurTeam = () => {
  return (
    <section className="bg-white pt-20 ">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2
          className="text-[52px] font-bold mb-10"
          style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
        >
          Join <span className="text-yellow-400">our team</span>
        </h2>

        {/* Description */}
        <p className="text-black text-[22px] leading-[38px] max-w-7xl mx-auto mb-24">
          The Trackpi's hiring team reviews all applications anonymously and will
          be in touch if there is a fit. If you need to get in touch with them,
          please email <span className="font-semibold">hr@trackpi.in</span>. The
          people who make up The Ready are specialists in the ways of
          organizational culture and transformation. Yet within that world we
          are generalists drawing freely from the principles and practices of
          dozens of theories and hundreds of iconoclastic firms. We are coaches,
          facilitators, academics, psychologists, technologists, and corporate
          veterans who have found each other in our quest to make work better.
          Our backgrounds are varied but our ambition is united.
        </p>

        {/* Image */}
        <div className="flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-xl max-w-[520px] w-full">
            <img
              src={joinImg}
              alt="Join our team"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default JoinOurTeam;
