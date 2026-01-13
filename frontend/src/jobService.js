const API_URL = "http://localhost:8000/api/jobs";

export const getAllJobs = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const getJobById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};
