export const getTalentHuntData = async () => {
    // Simulating an API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                heading: "Trackpi Talent Hunt",
                description: `Are you a designer who believes visuals can change the world? Participate in
our Design for Impact competition and show how your designs can make a
difference. From branding to posters to social media creatives — we're looking
for originality, storytelling, and creativity.`
            });
        }, 500);
    });
};
