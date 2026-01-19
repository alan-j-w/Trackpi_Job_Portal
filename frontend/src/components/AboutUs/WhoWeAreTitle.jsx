const WhoWeAreTitle = () => {
  return (
    <section className="bg-white " style={{
      textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
        }}>
      <h2
        className="
          font-cabinet
          font-bold
          text-[50px]
          leading-[63px]
          text-center
          text-shadow-title
        "
      >
        Who{" "}
        <span className="text-orange-400 text-shadow-highlight">
          We Are
        </span>
        ?
      </h2>
    </section>
  );
};

export default WhoWeAreTitle;
