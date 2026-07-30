// ===============================
// The Scholars - App
// ===============================

const resourceContainer = document.getElementById("resourceContainer");
const announcementBox = document.getElementById("announcementBox");
const searchInput = document.getElementById("searchInput");

let allResources = [];
let selectedPDF = "";

// ------------------------------
// Load Announcements
// ------------------------------
async function loadAnnouncements() {

    announcementBox.innerHTML = `
        <p class="loading">
            Loading announcement...
        </p>
    `;

    const { data, error } = await window.supabaseClient
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

    if (error) {

        console.error(error);

        announcementBox.innerHTML =
        `<p>Unable to load announcements.</p>`;

        return;
    }

    if (!data || data.length === 0) {

        announcementBox.innerHTML =
        `<p>No announcements available.</p>`;

        return;
    }

    const announcement = data[0];

    announcementBox.innerHTML = `

    <div class="announcement-content">

        <h3>${announcement.title}</h3>

        <p>${announcement.message}</p>

    </div>

    `;

}

// ------------------------------
// Load Resources
// ------------------------------
async function loadResources() {

    resourceContainer.innerHTML = `
        <p class="loading">
            Loading resources...
        </p>
    `;

    const { data, error } =
    await window.supabaseClient
        .from("resources")
        .select("*")
        .order("uploaded_date", {
            ascending:false
        });

    if(error){

        console.error(error);

        resourceContainer.innerHTML =
        `<p>Unable to load resources.</p>`;

        return;

    }

    allResources = data || [];

    displayResources(allResources);

}
// ------------------------------
// Display Resource Cards
// ------------------------------
function displayResources(resources){

    if(resources.length===0){

        resourceContainer.innerHTML=
        `<p>No resources found.</p>`;

        return;

    }

    resourceContainer.innerHTML="";

    resources.forEach((resource,index)=>{

        const card=document.createElement("div");

        card.className="resource-card";

        card.style.animationDelay=`${index*0.08}s`;

        card.innerHTML=`

        <div class="resource-content">

            <h3>${resource.title}</h3>

            <p>
            ${
            resource.description ||
            "No description available."
            }
            </p>

            <div class="resource-meta">

                <span>
                ${resource.subject || "Subject"}
                </span>

                <span>
                ${resource.chapter || "Chapter"}
                </span>

                <span>
                Class ${resource.class || ""}
                </span>

                <span>
                ${resource.resource_type || "Notes"}
                </span>

            </div>

            <a
            href="#"
            class="open-btn"
            onclick="openProtectedResource('${resource.pdf_url}');return false;">

            Open Resource

            </a>

        </div>

        `;

        resourceContainer.appendChild(card);

    });

}



// ------------------------------
// Open Protected Resource
// ------------------------------
function openProtectedResource(url){

    selectedPDF=url;

    document.getElementById("codeInput").value="";

    document.getElementById("errorMsg").textContent="";

    document.getElementById("unlockPopup").style.display="flex";

}



// ------------------------------
// Close Popup
// ------------------------------
function closePopup(){

    document.getElementById("unlockPopup").style.display="none";

}
// ------------------------------
// Verify Access Code
// ------------------------------
async function checkAccessCode(){

    const enteredCode =
    document.getElementById("codeInput")
    .value
    .trim();

    if(!enteredCode){

        document.getElementById("errorMsg").textContent =
        "Please enter an access code.";

        return;

    }

    const now = new Date().toISOString();

    const { data, error } =
    await window.supabaseClient
    .from("access_codes")
    .select("*")
    .eq("access_code", enteredCode)
    .eq("active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`);

    if(error){

        console.error(error);

        document.getElementById("errorMsg").textContent =
        "Unable to verify code.";

        return;

    }

    if(!data || data.length===0){

        document.getElementById("errorMsg").textContent =
        "❌ Invalid or expired access code.";

        return;

    }

    document.getElementById("unlockPopup").style.display="none";

    window.open(selectedPDF,"_blank");

}



// ------------------------------
// Search
// ------------------------------
if(searchInput){

searchInput.addEventListener("input",()=>{

const keyword=
searchInput.value
.toLowerCase()
.trim();

const filtered=
allResources.filter(resource=>

(resource.title||"")
.toLowerCase()
.includes(keyword)

||

(resource.subject||"")
.toLowerCase()
.includes(keyword)

||

(resource.chapter||"")
.toLowerCase()
.includes(keyword)

||

(resource.description||"")
.toLowerCase()
.includes(keyword)

);

displayResources(filtered);

});

}



// ------------------------------
// Initialize
// ------------------------------
async function init(){

    await loadAnnouncements();

    await loadResources();

}

init();



// ------------------------------
// Close popup using ESC key
// ------------------------------
document.addEventListener("keydown",e=>{

if(e.key==="Escape"){

closePopup();

}

});



// ------------------------------
// Close popup when clicking outside
// ------------------------------
window.addEventListener("click",e=>{

const popup=document.getElementById("unlockPopup");

if(e.target===popup){

closePopup();

}

});
