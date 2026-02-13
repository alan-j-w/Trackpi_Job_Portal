export const calculateProfileStrength = (profile) => {
    let strength = 0;

    // Core (Base)
    if (profile.fullName) strength += 10;

    // Assets
    if (profile.profileImage) strength += 10;
    if (profile.resume || profile.resumeUrl) strength += 10; // Handle both key variations if needed, sticking to profile schema likely 'resume'

    // Professional Info
    if (profile.jobTitle) strength += 10;
    if (profile.skills?.length > 0) strength += 10;
    if (profile.summary) strength += 10;

    // History
    if (profile.education?.length > 0) strength += 20;
    if (profile.workExperience?.length > 0) strength += 20;

    // Cap at 100
    strength = Math.min(strength, 100);
    const isComplete = strength >= 100;

    return { strength, isComplete };
};
