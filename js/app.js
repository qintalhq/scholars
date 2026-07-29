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
async function checkAccessCode() {

    const enteredCode = document
        .getElementById("codeInput")
        .value
        .trim();

    const { data, error } =
        await window.supabaseClient
        .from("access_codes")
        .select("id")
        .eq("access_code", enteredCode)
        .eq("active", true)
        .maybeSingle();

    const now = new Date().toISOString();

const { data, error } =
    await window.supabaseClient
    .from("access_codes")
    .select("id")
    .eq("access_code", enteredCode)
    .eq("active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .maybeSingle();

    if (error) {
        console.error(error);
        alert("Unable to verify access code.");
        return;
    }

    if (!data) {
        document.getElementById("errorMsg").textContent =
            "❌ Invalid Access Code";
        return;
    }

    window.open(selectedPDF, "_blank");

    document.getElementById("unlockPopup").style.display = "none";
}





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

        announcementBox.innerHTML =
            `<p>Unable to load announcements.</p>`;

        console.error(error);
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

            <h3>
                ${announcement.title}
            </h3>

            <p>
                ${announcement.message}
            </p>

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

        resourceContainer.innerHTML =
        `<p>Unable to load resources.</p>`;

        console.error(error);
        return;

    }


    allResources = data || [];

    displayResources(allResources);

}



// ------------------------------
// Display Resource Cards
// ------------------------------
function displayResources(resources){


    if(resources.length === 0){

        resourceContainer.innerHTML =
        `<p>No resources found.</p>`;

        return;

    }


    resourceContainer.innerHTML = "";


    resources.forEach(resource => {


        const card =
        document.createElement("div");


        card.className =
        "resource-card";


        card.innerHTML = `


    

        </div>


        <div class="resource-content">


            <h3>
                ${resource.title}
            </h3>


            <p>
                ${resource.description || 
                "No description available."}
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
            class="open-btn"
            href="${resource.pdf_url}"
            target="_blank">

                Open Resource

            </a>


        </div>


        `;


        resourceContainer.appendChild(card);


    });


}




// ------------------------------
// Search
// ------------------------------
searchInput.addEventListener(
"input",
()=>{


const keyword =
searchInput.value
.toLowerCase()
.trim();



const filtered =
allResources.filter(resource=>{


return (

(resource.title || "")
.toLowerCase()
.includes(keyword)


||

(resource.subject || "")
.toLowerCase()
.includes(keyword)


||

(resource.chapter || "")
.toLowerCase()
.includes(keyword)


);


});


displayResources(filtered);



});



// ------------------------------
// Initialize
// ------------------------------

async function init(){

await loadAnnouncements();

await loadResources();

}


init();
