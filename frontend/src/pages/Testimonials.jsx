import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import paulWalkerImg from "../assets/images/paulwaker.png";

function TestimonialRow({ name, role, image, videoUrl, text }) {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 pb-10 border-b">
      {/* LEFT CARD */}
      <div className="relative w-full sm:w-64 bg-black text-white rounded-3xl overflow-hidden">
        <img src={paulWalkerImg} className="w-full h-64 object-cover" alt={name} />

        <button
          onClick={() => setPlayVideo(true)}
          className="absolute bottom-14 right-6 bg-white w-12 h-12 rounded-full flex items-center justify-center text-yellow-500 text-xl"
        >
          ▶
        </button>

        <div className="text-center py-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-300">{role}</p>
        </div>
      </div>

      {/* VIDEO + TEXT */}
      <div className="flex-1 w-full">
        <div className="relative h-52 sm:h-64 rounded-3xl overflow-hidden bg-black">
          {!playVideo ? (
            <>
              <img
                src={paulWalkerImg}
                className="w-full h-full object-contain opacity-80"
                alt="Video Preview"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <button
                onClick={() => setPlayVideo(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center text-2xl">
                  ▶
                </div>
              </button>
            </>
          ) : (
            <iframe
              src={`${videoUrl}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={name}
            />
          )}
        </div>

        <h3 className="font-bold mt-4">{name}</h3>
        <p className="text-gray-500 text-sm">{role}</p>

        <p className="text-gray-600 mt-2">{text}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/testimonials?page=${currentPage}&limit=4`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data.testimonials exists, otherwise default to empty array
        setTestimonials(data.testimonials || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setTestimonials([]);
        setLoading(false);
      });
  }, [currentPage]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-24">Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="text-center pt-28 pb-16">
        <h1 className="text-5xl font-bold">
          What <span className="text-yellow-500">Our</span> Candidates Say
        </h1>
        <p className="text-gray-400 mt-4 text-xl">
          Hear from people who trusted our design solutions
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 space-y-12">
        {testimonials.map((item) => (
          <TestimonialRow
            key={item._id}
            name={item.name}
            role={item.role}
            image={item.image}
            videoUrl={item.video}
            text={item.description}
          />
        ))}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 my-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "font-bold" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
