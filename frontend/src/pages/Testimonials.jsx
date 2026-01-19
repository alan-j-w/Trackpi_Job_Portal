import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import paulwakerImg from "../assets/images/paulwaker.png";

const testimonials = [
  { id: 0, reverse: false },
  { id: 1, reverse: true },
  { id: 2, reverse: false },
  { id: 3, reverse: true },
  { id: 4, reverse: false },
];

function TestimonialRow({ reverse }) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-6 lg:gap-10 pb-8 lg:pb-12 border-b border-gray-300`}
    >
      {/* PROFILE CARD */}
      <div className="relative w-full sm:w-64  bg-black text-white rounded-3xl overflow-hidden">
        <img
          src={paulwakerImg}
          className="w-full h-64 sm:h-64 object-cover"
          alt="Paul Walker"
        />

        <button className="absolute bottom-14 right-6 bg-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-yellow-500 text-xl sm:text-2xl font-bold">
          ▶
        </button>

        <div className="text-center py-4">
          <h3 className="font-semibold text-base sm:text-lg">
            Paul Walker
          </h3>
          <p className="text-sm text-gray-300">UI UX Designer</p>
        </div>
      </div>

      {/* VIDEO + TEXT */}
      <div className="flex-1 w-full">
        <div className="relative h-52 sm:h-64 rounded-3xl overflow-hidden bg-black">
          <img
            src={paulwakerImg}
            className="w-full h-full object-cover opacity-90"
            alt="Testimonial Video"
          />
          <div className="absolute inset-0 bg-black/30"></div>

          <button className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl">
              ▶
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <h3 className="font-bold text-base sm:text-lg">
            Paul Walker
          </h3>
          <span className="text-sm text-gray-500">
            UI UX Designer
          </span>
        </div>

        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 leading-relaxed">
          As a UI/UX Designer at TrackPi, I was responsible for creating
          user-centered designs that enhanced product usability and improved
          overall user satisfaction. My work focused on designing intuitive
          interfaces, conducting user research, and collaborating with
          developers to ensure seamless implementation.
        </p>
      </div>
    </div>
  );
}

 export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <section className="text-center pt-24 sm:pt-28 pb-12 sm:pb-16 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
          What <span className="text-yellow-500">Our</span> Candidates Say
        </h1>
        <p className="text-gray-400 mt-3 text-lg sm:text-xl lg:text-3xl font-semibold">
          Hear from people who trusted our design solutions
        </p>
      </section>

      {/* TESTIMONIAL LIST */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {testimonials.map((item) => (
          <TestimonialRow key={item.id} reverse={item.reverse} />
        ))}
      </section>

      {/* PAGINATION */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-12 mb-16 px-4">

        {/* LEFT ARROW */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md
            ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-black hover:bg-gray-100"
            }`}
        >
          <span className="text-2xl sm:text-3xl font-bold leading-none">‹</span>
        </button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-md font-semibold
              ${
                currentPage === i + 1
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
          >
            {i + 1}
          </button>
        ))}

        {/* RIGHT ARROW */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md
            ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-black hover:bg-gray-100"
            }`}
        >
          <span className="text-2xl sm:text-3xl font-bold leading-none">›</span>
        </button>

      </div>

      <Footer />
    </>
  );
}
