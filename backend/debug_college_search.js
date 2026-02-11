
import axios from 'axios';

async function testSearch() {
    const query = "Mar Athanasius";
    console.log(`Searching for: ${query}`);

    try {
        const [clearbitResult, hipolabsResult, collegeResult] = await Promise.allSettled([
            axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`)
                .then(res => res.data.map(item => ({ source: 'Clearbit', name: item.name, domain: item.domain, logo: item.logo }))),

            axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`)
                .then(res => res.data.map(u => ({ source: 'Hipolabs', name: u.name, domain: u.domains?.[0] || null }))),

            axios.get("https://raw.githubusercontent.com/VarthanV/Indian-Colleges-List/master/colleges.json")
                .then(res => res.data
                    .filter(c => c.college && c.college.toLowerCase().includes(query.toLowerCase()))
                    .map(c => ({
                        source: 'GithubList',
                        name: c.college.replace(/\s*\(Id:.*?\)/i, "").trim(),
                        domain: null
                    }))
                )
        ]);

        const allResults = [];
        if (clearbitResult.status === 'fulfilled') allResults.push(...clearbitResult.value);
        if (hipolabsResult.status === 'fulfilled') allResults.push(...hipolabsResult.value);
        if (collegeResult.status === 'fulfilled') allResults.push(...collegeResult.value);

        console.log("Raw Results Count:", allResults.length);
        console.log("Raw Results Sample:", JSON.stringify(allResults, null, 2));

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testSearch();
