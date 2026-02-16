const PERMISSIONS = {
    // Dashboard
    DASHBOARD_VIEW: "dashboard.view",

    // Jobs
    JOBS_POST: "jobs.post",
    JOBS_STATUS: "jobs.status",
    JOBS_VIEW: "jobs.view",
    JOBS_PENDING: "jobs.pending",
    JOBS_ALL: "jobs.all",
    JOBS_URGENT: "jobs.urgent",
    JOBS_EDIT: "jobs.edit",

    // Signup Candidates
    SIGNUP_RESUME: "signup.resume",
    SIGNUP_VIEW: "signup.view",
    SIGNUP_DELETE: "signup.delete",

    // Job Applicants
    APPLICANTS_RESUME: "applicants.resume",
    APPLICANTS_VIEW: "applicants.view",
    APPLICANTS_DELETE: "applicants.delete",

    // Resume Build Candidates
    RESUME_DOWNLOAD: "resume.download",
    RESUME_DELETE: "resume.delete",

    // Hiring Partners
    PARTNERS_ADD: "partners.add",
    PARTNERS_VIEW: "partners.view",
    PARTNERS_EDIT: "partners.edit",
    PARTNERS_DELETE: "partners.delete",

    // Testimonials
    TESTIMONIALS_ADD: "testimonials.add",
    TESTIMONIALS_VIEW: "testimonials.view",
    TESTIMONIALS_EDIT: "testimonials.edit",
    TESTIMONIALS_DELETE: "testimonials.delete",

    // Admin Management
    ADMIN_VIEW: "admin.view",
    ADMIN_ADD: "admin.add",
    ADMIN_EDIT: "admin.edit",
    ADMIN_STATUS: "admin.status",

    // User Permission (Roles)
    ROLES_VIEW: "roles.view",
    ROLES_EDIT: "roles.edit",
    ROLES_DELETE: "roles.delete",

    // User Management
    USERS_VIEW: "users.view",
    USERS_EDIT: "users.edit",
    USERS_DELETE: "users.delete",

    // Form Management
    FORMS_MANAGE: "forms.manage",

    // Ad Competition
    COMPETITION_ADD: "competition.add",
    COMPETITION_EDIT: "competition.edit",
    COMPETITION_TESTIMONIALS: "competition.testimonials",
    COMPETITION_CANDIDATES: "competition.candidates",

    // Video Management
    VIDEO_ADD: "video.add",
    VIDEO_EDIT: "video.edit",
    VIDEO_DELETE: "video.delete",

    // Previous Winners
    WINNERS_ADD: "winners.add",
    WINNERS_EDIT: "winners.edit",
    WINNERS_DELETE: "winners.delete",

    // Legacy/Generic (Mapped for backward compatibility if needed, but trying to use specific)
    MANAGE_ADMINS: "manage_admins",
    VIEW_LOGS: "view_logs"
};

export default PERMISSIONS;
