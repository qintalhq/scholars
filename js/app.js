/*==================================================
THE SCHOLARS
Premium App v3.0

app.js
Part 1 - Core Setup
==================================================*/


//==============================
// DOM ELEMENTS
//==============================

const resourceContainer =
document.getElementById("resourceContainer");

const announcementBox =
document.getElementById("announcementBox");

const searchInput =
document.getElementById("searchInput");

const loadingScreen =
document.getElementById("loadingScreen");

const toast =
document.getElementById("toast");

const toastText =
document.getElementById("toastText");

const topButton =
document.getElementById("topBtn");

const navbar =
document.getElementById("navbar");

const themeButton =
document.getElementById("themeBtn");

const mobileMenu =
document.getElementById("mobileMenu");


// Access Popup

const unlockPopup =
document.getElementById("unlockPopup");

const codeInput =
document.getElementById("codeInput");

const errorMessage =
document.getElementById("errorMsg");



//==============================
// GLOBAL VARIABLES
//==============================

let allResources = [];

let selectedPDF = "";

let currentTheme =
localStorage.getItem("theme") || "dark";



//==============================
// APPLY THEME
//==============================

function applyTheme(){

if(currentTheme==="light"){

document.body.classList.add("light");

}

else{

document.body.classList.remove("light");

}

}


applyTheme();



//==============================
// TOAST SYSTEM
//==============================

function showToast(message,type="success"){

if(!toast || !toastText)
return;


toastText.innerText = message;


toast.className =
"ts-toast";


toast.classList.add(type);


setTimeout(()=>{

toast.classList.add("show");

},50);



setTimeout(()=>{

toast.classList.remove("show");

},3500);


}



//==============================
// LOADING SCREEN
//==============================

function hideLoading(){

if(!loadingScreen)
return;


loadingScreen.style.opacity="0";


setTimeout(()=>{

loadingScreen.style.display="none";

},500);


}



//==============================
// SKELETON LOADER
//==============================

function showSkeleton(){

if(!resourceContainer)
return;


resourceContainer.innerHTML="";


for(let i=0;i<6;i++){


resourceContainer.innerHTML += `

<div class="ts-card">

<div class="ts-skeleton ts-skeleton-title"></div>

<div class="ts-skeleton ts-skeleton-text"></div>

<div class="ts-skeleton ts-skeleton-text"></div>

<div class="ts-skeleton ts-skeleton-btn"></div>

</div>

`;

}


}



//==============================
// MOBILE MENU
//==============================

function toggleMenu(){

if(!mobileMenu)
return;


mobileMenu.classList.toggle("show");

}



//==============================
// THEME BUTTON
//==============================

if(themeButton){

themeButton.addEventListener(

"click",

()=>{


if(currentTheme==="dark"){

currentTheme="light";

}

else{

currentTheme="dark";

}


localStorage.setItem(

"theme",

currentTheme

);


applyTheme();


}

);

}



//==============================
// NAVBAR SCROLL EFFECT
//==============================

window.addEventListener(

"scroll",

()=>{


if(!navbar)
return;


if(window.scrollY>50){

navbar.classList.add(
"scrolled"
);

}

else{

navbar.classList.remove(
"scrolled"
);

}


if(topButton){

if(window.scrollY>500){

topButton.classList.add(
"show"
);

}

else{

topButton.classList.remove(
"show"
);

}

}


}

);



//==============================
// BACK TO TOP
//==============================

if(topButton){

topButton.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};

}



//==============================
// UTILITY FUNCTIONS
//==============================


function escapeHTML(text){

if(!text)
return "";


return text

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#039;");

}



function countUnique(array,key){

return new Set(

array

.map(item=>item[key])

.filter(Boolean)

).size;


}
/*==================================================
PART 2
Supabase Loading System
==================================================*/


//==============================
// LOAD ANNOUNCEMENTS
//==============================

async function loadAnnouncements(){

if(!announcementBox)
return;


announcementBox.innerHTML=`

<div class="ts-skeleton ts-skeleton-title"></div>

<div class="ts-skeleton ts-skeleton-text"></div>

`;



try{


const {data,error}=

await window.supabaseClient

.from("announcements")

.select("*")

.order(

"created_at",

{

ascending:false

}

)

.limit(1);



if(error)

throw error;



if(!data || data.length===0){


announcementBox.innerHTML=`

<div class="ts-announcement">

<h3>

No Announcements

</h3>

<p>

There are no announcements available currently.

</p>

</div>

`;

return;

}



const announcement=data[0];



announcementBox.innerHTML=`

<div class="ts-announcement ts-reveal active">

<h3>

📢 ${escapeHTML(announcement.title)}

</h3>


<p>

${escapeHTML(announcement.message)}

</p>


</div>

`;



}

catch(error){


console.error(

"Announcement Error:",

error

);



announcementBox.innerHTML=`

<div class="ts-announcement">

<h3>

Unable to load announcement

</h3>

<p>

Please try again later.

</p>

</div>

`;


showToast(

"Announcement loading failed",

"error"

);


}



}





//==============================
// LOAD RESOURCES
//==============================


async function loadResources(){


if(!resourceContainer)

return;



showSkeleton();



try{


const {data,error}=

await window.supabaseClient

.from("resources")

.select("*")

.order(

"uploaded_date",

{

ascending:false

}

);



if(error)

throw error;



allResources=data || [];



updateStatistics();



displayResources(allResources);



}

catch(error){


console.error(

"Resource Error:",

error

);



resourceContainer.innerHTML=`

<div class="ts-empty">

<h3>

Failed to load resources

</h3>


<p>

Check your internet connection and try again.

</p>

</div>

`;



showToast(

"Resource loading failed",

"error"

);



}



}





//==============================
// STATISTICS
//==============================


function updateStatistics(){


const totalResources=

document.getElementById(

"totalResources"

);


const totalSubjects=

document.getElementById(

"totalSubjects"

);


const totalClasses=

document.getElementById(

"totalClasses"

);



if(totalResources)

totalResources.innerText=

allResources.length;



if(totalSubjects)

totalSubjects.innerText=

countUnique(

allResources,

"subject"

);



if(totalClasses)

totalClasses.innerText=

countUnique(

allResources,

"class"

);



}





//==============================
// REFRESH SYSTEM
//==============================


async function refreshData(){


showToast(

"Refreshing data...",

"warning"

);



await loadAnnouncements();

await loadResources();



showToast(

"Updated successfully",

"success"

);


}





//==============================
// CONNECTION STATUS
//==============================


window.addEventListener(

"offline",

()=>{


showToast(

"No internet connection",

"error"

);


}

);



window.addEventListener(

"online",

()=>{


showToast(

"Connection restored",

"success"

);


refreshData();


});





//==============================
// AUTO UPDATE ANNOUNCEMENTS
//==============================


setInterval(()=>{


loadAnnouncements();


},60000);

/*==================================================
PART 3
Resource Cards • Search • Filters
==================================================*/


//==============================
// DISPLAY RESOURCES
//==============================

function displayResources(resources){


if(!resourceContainer)

return;



if(resources.length===0){


resourceContainer.innerHTML=`

<div class="ts-empty">

<h3>

No Resources Found

</h3>

<p>

Try searching something else.

</p>

</div>

`;

return;

}



resourceContainer.innerHTML="";



resources.forEach((resource,index)=>{



const card=document.createElement("div");


card.className=

"ts-card ts-reveal";



card.style.animationDelay=

`${index*0.08}s`;



const isNew=index<3;



card.innerHTML=`

${isNew ? `

<div class="ts-badge-new">

NEW

</div>

`:""}



<h3 class="ts-card-title">

${escapeHTML(resource.title)}

</h3>



<p class="ts-card-desc">

${escapeHTML(

resource.description ||

"No description available."

)}

</p>



<div class="ts-meta">


<span>

📚 ${escapeHTML(

resource.subject || "Subject"

)}

</span>



<span>

📖 ${escapeHTML(

resource.chapter || "Chapter"

)}

</span>



<span>

🎓 Class ${escapeHTML(

resource.class || "-"

)}

</span>



<span>

📄 ${escapeHTML(

resource.resource_type || "Notes"

)}

</span>



</div>



<div class="ts-card-footer">


<button

class="ts-btn-open"

onclick="openProtectedResource('${resource.pdf_url}')">

Open Resource

</button>



</div>

`;



resourceContainer.appendChild(card);



});



activateReveal();


}





//==============================
// SEARCH SYSTEM
//==============================


if(searchInput){


searchInput.addEventListener(

"input",

()=>{


const keyword=

searchInput.value

.toLowerCase()

.trim();



if(keyword===""){


displayResources(allResources);

return;

}



const filtered=

allResources.filter(resource=>{


return(

(resource.title||"")

.toLowerCase()

.includes(keyword)


||

(resource.description||"")

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

(resource.resource_type||"")

.toLowerCase()

.includes(keyword)

);


});



displayResources(filtered);



}

);


}




//==============================
// FILTER SYSTEM
//==============================


const filterButtons=

document.querySelectorAll(

".ts-filter"

);



filterButtons.forEach(button=>{


button.addEventListener(

"click",

()=>{


filterButtons.forEach(btn=>{

btn.classList.remove("active");

});



button.classList.add("active");



const filter=

button.dataset.filter;



if(!filter || filter==="all"){


displayResources(allResources);

return;

}



const filtered=

allResources.filter(resource=>{


return(

resource.resource_type &&

resource.resource_type

.toLowerCase()

===filter.toLowerCase()

);


});



displayResources(filtered);



}

);


});




//==============================
// SCROLL REVEAL
//==============================


function activateReveal(){


const elements=

document.querySelectorAll(

".ts-reveal"

);



const observer=

new IntersectionObserver(

(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add(

"active"

);


observer.unobserve(

entry.target

);


}


});


},

{

threshold:.15

}

);



elements.forEach(element=>{


observer.observe(element);


});


}
/*==================================================
PART 4
Access Code Protection System
==================================================*/


//==============================
// OPEN PROTECTED RESOURCE
//==============================

function openProtectedResource(pdfUrl){


if(!unlockPopup){

console.error(
"Access popup not found"
);

return;

}


selectedPDF = pdfUrl;


if(codeInput){

codeInput.value="";

}


if(errorMessage){

errorMessage.innerText="";

}


unlockPopup.classList.add("active");


}



//==============================
// CLOSE POPUP
//==============================

function closePopup(){


if(!unlockPopup)

return;



unlockPopup.classList.remove("active");



if(codeInput){

codeInput.value="";

}



if(errorMessage){

errorMessage.innerText="";

}


}




//==============================
// VERIFY ACCESS CODE
//==============================


async function checkAccessCode(){



const code =

codeInput.value.trim();



if(!code){


errorMessage.innerText=

"Enter access code";


showToast(

"Access code required",

"warning"

);


return;

}



try{


const now =

new Date()

.toISOString();



const {data,error}=

await window.supabaseClient

.from("access_codes")

.select("*")

.eq(

"access_code",

code

)

.eq(

"active",

true

)

.limit(1);



if(error)

throw error;



if(!data || data.length===0){


errorMessage.innerText=

"Invalid access code";


showToast(

"Access denied",

"error"

);


return;

}





const access=data[0];



// Check expiry

if(

access.expires_at &&

new Date(access.expires_at)

< new Date()

){


errorMessage.innerText=

"Access code expired";


showToast(

"Code expired",

"error"

);


return;

}




// Save session

sessionStorage.setItem(

"ts_access",

code

);



showToast(

"Access granted",

"success"

);



closePopup();



// Open PDF

window.open(

selectedPDF,

"_blank"

);



}

catch(error){


console.error(

"Access Error:",

error

);



showToast(

"Verification failed",

"error"

);


}



}





//==============================
// REMEMBER ACCESS SESSION
//==============================


function hasAccess(){


return Boolean(

sessionStorage.getItem(

"ts_access"

)

);


}





//==============================
// POPUP EVENTS
//==============================


if(codeInput){


codeInput.addEventListener(

"keydown",

(event)=>{


if(event.key==="Enter"){

checkAccessCode();

}


}

);


}




// Close on outside click

if(unlockPopup){


unlockPopup.addEventListener(

"click",

(event)=>{


if(

event.target===unlockPopup

){


closePopup();


}


}

);


}





// ESC close

document.addEventListener(

"keydown",

(event)=>{


if(event.key==="Escape"){

closePopup();

}


});
