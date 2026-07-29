// ===============================
// The Scholars - Admin Panel
// ===============================

const client = window.supabaseClient;

// ---------- Elements ----------
const resourceForm = document.getElementById("resourceForm");
const announcementForm = document.getElementById("announcementForm");

const resourceTable = document.getElementById("resourceTable");

const resourceCount = document.getElementById("resourceCount");
const announcementCount = document.getElementById("announcementCount");

const logoutBtn = document.getElementById("logoutBtn");

// ===============================
// Check Login
// ===============================

async function checkLogin() {

    const { data } = await client.auth.getSession();

    if (!data.session) {
        window.location.href = "../login.html";
    }

}

// ===============================
// Statistics
// ===============================

async function loadStatistics() {

    const { count: resources } = await client
        .from("resources")
        .select("*", { count: "exact", head: true });

    const { count: announcements } = await client
        .from("announcements")
        .select("*", { count: "exact", head: true });

    resourceCount.textContent = resources || 0;
    announcementCount.textContent = announcements || 0;

}

// ===============================
// Load Resources
// ===============================

async function loadResources() {

    const { data, error } = await client
        .from("resources")
        .select("*")
        .order("uploaded_date", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    resourceTable.innerHTML = "";

    data.forEach(resource => {

        resourceTable.innerHTML += `
        <tr>

            <td data-label="Title">${resource.title}</td>

            <td data-label="Subject">${resource.subject}</td>

            <td data-label="Class">${resource.class}</td>

            <td data-label="Actions">

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editResource('${resource.id}')">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteResource('${resource.id}')">
                        Delete
                    </button>

                </div>

            </td>

        </tr>
        `;

    });

}

// ===============================
// Add Resource
// ===============================

resourceForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const resource = {

        title: title.value,
        description: description.value,
        subject: subject.value,
        chapter: chapter.value,
        class: document.getElementById("class").value,
        resource_type: resourceType.value,
        thumbnail: thumbnail.value,
        pdf_url: pdf.value,
        uploaded_date: new Date()

    };

    const { error } = await client
        .from("resources")
        .insert(resource);

    if (error) {

        alert(error.message);

        return;

    }

    alert("Resource Added");

    resourceForm.reset();

    loadResources();

    loadStatistics();

});

// ===============================
// Delete Resource
// ===============================

async function deleteResource(id) {

    if (!confirm("Delete this resource?")) return;

    const { error } = await client
        .from("resources")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadResources();

    loadStatistics();

}

// ===============================
// Edit Resource
// ===============================

function editResource(id) {

    alert(
        "Edit feature will be added in the next version.\n\nID: " + id
    );

}

// ===============================
// Publish Announcement
// ===============================

announcementForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const { error } = await client
        .from("announcements")
        .insert({

            title: announcementTitle.value,

            message: announcementMessage.value,

            created_at: new Date()

        });

    if (error) {

        alert(error.message);

        return;

    }

    alert("Announcement Published");

    announcementForm.reset();

    loadStatistics();

});

// ===============================
// Logout
// ===============================

logoutBtn.addEventListener("click", async () => {

    await client.auth.signOut();

    window.location.href = "../login.html";

});

// ===============================
// Init
// ===============================

async function init() {

    await checkLogin();

    await loadStatistics();

    await loadResources();

}

init();
