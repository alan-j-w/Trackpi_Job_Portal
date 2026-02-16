import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TestimonialDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [testimonial, setTestimonial] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/admin/testimonials/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const json = await res.json();
        if (!res.ok) throw new Error();

        setTestimonial(json.data);
      } catch {
        toast.error("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [id, token]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!testimonial) return null;

  /* ================= UI ================= */
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Testimonials</h1>

      {/* NAME */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Name</label>
        <div className="border-b py-2">{testimonial.name}</div>
      </div>

      {/* JOB TITLE */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Job title</label>
        <div className="border-b py-2">{testimonial.jobTitle}</div>
      </div>

      {/* ABOUT */}
      <div className="mb-8">
        <label className="block text-sm mb-2">About your experience</label>
        <div className="border rounded-lg p-4 text-gray-600">
          {testimonial.about}
        </div>
      </div>

      {/* MEDIA */}
      <div className="grid grid-cols-3 gap-6">
        <MediaBox
          preview={testimonial.coverImage?.url}
          label="Upload cover image"
        />

        <MediaBox
          preview={testimonial.thumbnailImage?.url}
          label="Thumbnail cover image"
        />

        <MediaBox
          preview={testimonial.video?.url}
          label="Change video"
          isVideo
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end pt-8">
        <button
          onClick={() =>
            navigate(`/admin/testimonials/edit/${testimonial._id}`)
          }
          className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

/* ================= MEDIA BOX ================= */
const MediaBox = ({ preview, label, isVideo }) => (
  <div className="relative rounded-2xl overflow-hidden w-full h-56 bg-gray-800">
    {preview &&
      (isVideo ? (
        <video
          src={preview}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={preview}
          alt={label}
          className="w-full h-full object-cover"
        />
      ))}

    {/* OVERLAY TEXT */}
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
      <span className="text-yellow-400 font-medium flex items-center gap-2">
        {label}
        <span className="text-xl">⬆</span>
      </span>
    </div>
  </div>
);

export default TestimonialDetails;
