import peopleImg from "../../assets/about images/people.png";

const OurPeople = () => {
  const whatsappUrl = "https://wa.me/91XXXXXXXXXX?text=Hi%20Trackpi,%20I%20am%20interested%20in%20joining%20the%20team.";
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <img
        src={peopleImg}
        alt="Our People"
        className="rounded-2xl w-full"
      />

      <div className="flex flex-col">
        <h2 className="text-[62px] font-cabinet font-bold mb-6 leading-tight">
          Our <span className="text-yellow-400">People</span>
        </h2>

        <p className="font-lato text-[19.11px] leading-[28.67px] text-[#555555] mb-8">
          The people who make up Trackpi are specialists in the ways of organizational
          culture and transformation. Yet within that world we are generalists drawing
          freely from the principles and practices of dozens of theories and hundreds
          of iconoclastic firms. We are coaches, facilitators, academics, psychologists,
          technologists, and corporate veterans who have found each other in our
          quest to make work better. Our backgrounds are varied but our ambition is united.
        </p>

        <div className="w-full flex justify-end">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-yellow-400 hover:bg-yellow-500 transition-all px-10 py-4 rounded-full font-bold text-black flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95">
              JOIN OUR TEAM
              <span className="text-xl">→</span>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default OurPeople;