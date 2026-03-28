import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
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

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/admin/testimonials/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        if (!res.ok) throw new Error();

        const t = json.data || json;

        setFormData({
          name: t.name,
          jobTitle: t.jobTitle,
          about: t.about
        });

        setPreviews({
          coverImage: t.coverImage?.url,
          thumbnailImage: t.thumbnailImage?.url,
          video: t.video?.url
        });
      } catch {
        toast.error("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

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
        `http://localhost:8000/api/admin/testimonials/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Testimonial updated");
      navigate("/admin/testimonials");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  /* ================= UI ================= */
  return (
    <div
      className="bg-white rounded-lg shadow-sm"
      style={{
        width: "971.2646484375px",
        height: "715.9392700195312px",
        position: "absolute",
        top: "53px",
        left: "347px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "32px 40px",
        gap: "20px",
        opacity: "1",
        transform: "rotate(0deg)",
        overflow: "hidden"
      }}
    >
      <h1 className="text-3xl font-bold text-gray-900 leading-none">Testimonials</h1>

      {/* NAME & JOB TITLE WRAPPER */}
      <div
        style={{
          width: "971.2646484375px",
          height: "145px",
          display: "flex",
          flexDirection: "column",
          gap: "33px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        {/* NAME */}
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border-b py-2 w-full outline-none"
          />
        </div>

        {/* JOB TITLE */}
        <div>
          <label className="block text-sm mb-1">Job title</label>
          <input
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="border-b py-2 w-full outline-none"
          />
        </div>
      </div>

      {/* ABOUT WRAPPER */}
      <div
        style={{
          width: "971.2646484375px",
          height: "167px",
          display: "flex",
          flexDirection: "column",
          gap: "21px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        <label className="text-sm">About your experience</label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          className="border rounded-lg p-4 w-full h-full"
        />
      </div>

      {/* MEDIA WRAPPER */}
      <div
        style={{
          width: "971.2646484375px",
          height: "189px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        <div className="flex gap-[15px] h-full">
          <MediaBox
            preview={previews.coverImage}
            label="Upload cover image"
            name="coverImage"
            onChange={handleFileChange}
            style={{ width: "208px", height: "189px" }}
          />

          <MediaBox
            preview={previews.thumbnailImage}
            label="Thumbnail cover image"
            name="thumbnailImage"
            onChange={handleFileChange}
            style={{ width: "207px", height: "189px" }}
          />

          <MediaBox
            preview={previews.video}
            label="Change video"
            name="video"
            onChange={handleFileChange}
            isVideo
            style={{ width: "496px", height: "189px" }}
          />
        </div>
      </div>


      {/* FOOTER */}
      <div className="flex items-center justify-between pt-4">
        {/* LEFT — View Profile */}
        <button
          type="button"
          onClick={() => navigate(`/admin/testimonials/${id}`)}
          className="text-[#FFBD3D] font-medium flex items-center gap-2 hover:underline"
        >
          View Profile
          <span className="text-lg">→</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/testimonials")}
            className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-black px-10 py-3 rounded-lg font-medium shadow"
          >
            Cancel
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-black px-10 py-3 rounded-lg font-medium shadow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= MEDIA BOX ================= */
const MediaBox = ({ preview, label, name, onChange, isVideo, style }) => (
  <div className="relative rounded-2xl overflow-hidden bg-gray-800" style={style}>
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

export default EditTestimonial;
