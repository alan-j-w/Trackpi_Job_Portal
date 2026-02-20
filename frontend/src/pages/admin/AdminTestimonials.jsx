import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Play, Search } from "lucide-react";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  /* FETCH */
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/testimonials?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTestimonials(data.data || []);
      else toast.error(data.message);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* FILTER */
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete testimonial?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted");
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  /* SELECT */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTestimonials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTestimonials.map((t) => t._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} testimonials?`)) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/testimonials/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      toast.success("Deleted successfully");
      setSelectedIds([]);
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete selected");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* TOP */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            placeholder="Search for candidates or job title"
            className="w-[420px] h-[45px] border px-4 pl-10 rounded-lg outline-none focus:border-[#FFB300] transition-colors"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {hasPermission(PERMISSIONS.TESTIMONIALS_ADD) && (
          <button
            onClick={() => navigate("/admin/testimonials/add")}
            className="bg-[#FFB300] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#e5a100] transition"
          >
            Add more +
          </button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800">Testimonials</h2>

      <div className="flex justify-end mb-2">
        {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
          <button
            onClick={toggleSelectAll}
            className="text-sm font-medium text-[#FFB300] hover:text-[#e5a100]"
          >
            {selectedIds.length === filteredTestimonials.length && filteredTestimonials.length > 0
              ? "Unselect all →"
              : "Select all →"}
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                <th className="p-4 pl-6 w-[50px]"></th>
                <th className="p-4">Name</th>
                <th className="p-4">Job Title</th>
                <th className="p-4 text-center">Video</th>
                <th className="p-4 w-1/3">About</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No testimonials found.</td></tr>
              ) : (
                filteredTestimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-yellow-50/10 transition-colors">
                    <td className="p-4 pl-6">
                      {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#FFB300] focus:ring-[#FFB300] cursor-pointer"
                          checked={selectedIds.includes(t._id)}
                          onChange={() => toggleSelect(t._id)}
                        />
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{t.name}</td>
                    <td className="p-4 text-gray-700 font-medium">{t.jobTitle}</td>
                    <td className="p-4 text-center">
                      <div className="w-[100px] h-[40px] bg-gray-50 flex items-center justify-center rounded border border-gray-200 mx-auto">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                          <Play className="w-4 h-4 fill-[#FFB300] text-[#FFB300] ml-0.5" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {t.about}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex gap-2">
                          {hasPermission(PERMISSIONS.TESTIMONIALS_EDIT) && (
                            <button
                              onClick={() => navigate(`/admin/testimonials/edit/${t._id}`)}
                              className="p-2 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
                            <button
                              onClick={() => handleDelete(t._id)}
                              className="p-2 bg-red-100 rounded text-red-500 hover:bg-red-200 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        {hasPermission(PERMISSIONS.TESTIMONIALS_VIEW_DETAILS) && (
                          <button
                            onClick={() => navigate(`/admin/testimonials/${t._id}`)}
                            className="flex items-center gap-1 text-[#DFB31F] text-sm hover:underline font-medium"
                          >
                            View Details <ExternalLink size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination (Static) */}
        <div className="flex justify-end p-4">
          <button className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
            6
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </button>
        </div>
      </div>

      {/* Footer Selection Status */}
      {selectedIds.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 flex items-center gap-4">
          <span>
            Selected <span className="text-[#FFB300] font-bold">{selectedIds.length}</span> items
          </span>
          {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
            <button
              onClick={handleBulkDelete}
              className="text-[#FFB300] font-medium hover:underline flex items-center gap-1"
            >
              Delete →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
