import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddTestimonial = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    about: ""
  });

  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({
    coverImage: null,
    thumbnailImage: null,
    video: null
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles({ ...files, [e.target.name]: file });
    setPreviews({
      ...previews,
      [e.target.name]: URL.createObjectURL(file)
    });
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    Object.entries(files).forEach(([k, v]) => fd.append(k, v));

    try {
      const res = await fetch(
        "http://localhost:8000/api/admin/testimonials",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        }
      );

      if (!res.ok) throw new Error();
      toast.success("Testimonial added successfully");
      navigate("/admin/testimonials");
    } catch {
      toast.error("Failed to add testimonial");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Testimonials</h1>

      {/* NAME */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border-b py-2 w-full outline-none"
        />
      </div>

      {/* JOB TITLE */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Job title</label>
        <input
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="border-b py-2 w-full outline-none"
        />
      </div>

      {/* ABOUT */}
      <div className="mb-8">
        <label className="block text-sm mb-2">About your experience</label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          className="border rounded-lg p-4 w-full h-32"
        />
      </div>

      {/* MEDIA */}
      <div className="grid grid-cols-3 gap-6">
        <MediaBox
          preview={previews.coverImage}
          label="Upload cover image"
          name="coverImage"
          onChange={handleFileChange}
        />

        <MediaBox
          preview={previews.thumbnailImage}
          label="Thumbnail cover image"
          name="thumbnailImage"
          onChange={handleFileChange}
        />

        <MediaBox
          preview={previews.video}
          label="Upload video"
          name="video"
          onChange={handleFileChange}
          isVideo
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end pt-10 gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/testimonials")}
          className="px-10 py-3 rounded-lg border font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-yellow-300 to-yellow-500
                     text-black px-10 py-3 rounded-lg font-medium shadow"
        >
          Save
        </button>
      </div>
    </div>
  );
};

/* ================= MEDIA BOX ================= */
const MediaBox = ({ preview, label, name, onChange, isVideo }) => (
  <div className="relative rounded-2xl overflow-hidden w-full h-56 bg-gray-800">
    {preview &&
      (isVideo ? (
        <video src={preview} controls className="w-full h-full object-cover" />
      ) : (
        <img src={preview} className="w-full h-full object-cover" />
      ))}

    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
      <label className="cursor-pointer text-yellow-400 font-medium flex items-center gap-2">
        {label} ⬆
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  </div>
);

export default AddTestimonial;
