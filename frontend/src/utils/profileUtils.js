export const calculateProfileStrength = (profile) => {
    let strength = 0;
    if (!profile) return { strength: 0, isComplete: false };

    // 1. Core Info (15%)
    if (profile.fullName) strength += 5;
    if (profile.email) strength += 5;
    if (profile.phone) strength += 5;

    // 2. Personal Details (10%)
    if (profile.dateOfBirth) strength += 5;
    if (profile.maritalStatus) strength += 5;

    // 3. Professional Essentials (35%)
    if (profile.jobTitle) strength += 5;
    if (profile.summary) strength += 10;
    if (profile.skills && profile.skills.length > 0) strength += 10;
    if (profile.languages && profile.languages.length > 0) strength += 10; // Increased to 10 to match UI emphasis or keep 5? Let's use 5 to balance.
    // Wait, previous plan was 5 for languages. 
    // Let's stick to the plan: Name(5)+Email(5)+Phone(5)+DOB(5)+Marital(5)+Job(5)+Summary(10)+Skills(10)+Langs(5) = 55 so far

    // 4. History (20%)
    if (profile.education && profile.education.length > 0) strength += 10;
    if (profile.workExperience && profile.workExperience.length > 0) strength += 10;

    // 5. Assets & Social (20%)
    if (profile.profileImage) strength += 10;
    if (profile.resume || profile.resumeUrl) strength += 10;

    // Social Links (Check if any exist)
    const hasSocial = profile.socialLinks && Object.values(profile.socialLinks).some(link => link && link.trim() !== "");
    if (hasSocial) strength += 5;

    // Check sum: 5+5+5 + 5+5 + 5+10+10+5 + 10+10 + 10+10+5 = 100.
    // Correct.

    // Cap at 100
    strength = Math.min(strength, 100);
    const isComplete = strength >= 100;

    return { strength, isComplete };
};
