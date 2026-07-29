// ===============================
// The Scholars - App
// ===============================

const resourceContainer = document.getElementById("resourceContainer");
const announcementBox = document.getElementById("announcementBox");
const searchInput = document.getElementById("searchInput");

let allResources = [];

// ------------------------------
// Load Announcements
// ------------------------------
async function loadAnnouncements() {
    const { data, error } = await window.supabaseClient
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

    if (error) {
        announcementBox.innerHTML = "<p>Unable to load announcements.</p>";
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        announcementBox.innerHTML = "<p>No announcements.</p>";
        return;
    }

    announcementBox.innerHTML = `
        <strong>${data[0].title}</strong>
        <p>${data[0].message}</p>
    `;
}

// ------------------------------
// Load Resources
// ------------------------------
async function loadResources() {

    const { data, error } = await window.supabaseClient
        .from("resources")
        .select("*")
        .order("uploaded_date", { ascending: false });

    if (error) {
        resourceContainer.innerHTML =
            "<p>Unable to load resources.</p>";
        console.error(error);
        return;
    }

    allResources = data || [];

    displayResources(allResources);
}

// ------------------------------
// Display Cards
// ------------------------------
function displayResources(resources) {

    if (resources.length === 0) {
        resourceContainer.innerHTML =
            "<p>No resources found.</p>";
        return;
    }

    resourceContainer.innerHTML = "";

    resources.forEach(resource => {

        const card = document.createElement("div");

        card.className = "resource-card";

        card.innerHTML = `
            <img src="${resource.thumbnail}" alt="${resource.title}">

            <h3>${resource.title}</h3>

            <p>${resource.description}</p>

            <div class="resource-meta">
                <span>${resource.subject}</span>
                <span>${resource.chapter}</span>
                <span>${resource.class}</span>
                <span>${resource.resource_type}</span>
            </div>

            <a
                class="open-btn"
                href="${resource.pdf_url}"
                target="_blank"
            >
                Open Notes
            </a>
        `;

        resourceContainer.appendChild(card);

    });

}

// ------------------------------
// Instant Search
// ------------------------------
searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = allResources.filter(resource => {

        return (
            resource.title.toLowerCase().includes(keyword) ||
            resource.subject.toLowerCase().includes(keyword) ||
            resource.chapter.toLowerCase().includes(keyword)
        );

    });

    displayResources(filtered);

});

// ------------------------------
// Initialize
// ------------------------------
async function init() {

    await loadAnnouncements();

    await loadResources();

}

init();
