// ==========================================
// THE SCHOLARS
// Premium App v2.0
// ==========================================

// ---------- Elements ----------

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

const topBtn =
document.getElementById("topBtn");

const navbar =
document.getElementById("navbar");

const themeBtn =
document.getElementById("themeBtn");

const mobileMenu =
document.getElementById("mobileMenu");


// ---------- Variables ----------

let allResources = [];

let selectedPDF = "";

let currentTheme = "dark";


// ---------- Loading Screen ----------

window.addEventListener("load",()=>{

setTimeout(()=>{

loadingScreen.style.opacity="0";

loadingScreen.style.visibility="hidden";

},700);

});


// ---------- Toast ----------

function showToast(message,type="success"){

toastText.innerText=message;

toast.className="toast";

toast.classList.add(type);

setTimeout(()=>{

toast.classList.add("show");

},50);

setTimeout(()=>{

toast.classList.remove("show");

},3500);

}


// ---------- Theme ----------

if(themeBtn){

themeBtn.onclick=()=>{

document.body.classList.toggle("light");

currentTheme=

document.body.classList.contains("light")

? "light"

: "dark";

themeBtn.innerHTML=

currentTheme==="dark"

? "🌙"

: "☀️";

localStorage.setItem(

"theme",

currentTheme

);

};

}


// Restore Theme

const savedTheme=

localStorage.getItem("theme");

if(savedTheme==="light"){

document.body.classList.add("light");

themeBtn.innerHTML="☀️";

}


// ---------- Mobile Menu ----------

let mobileOpen=false;

function toggleMenu(){

mobileOpen=!mobileOpen;

mobileMenu.classList.toggle(

"show",

mobileOpen

);

}


// ---------- Utility ----------

function countUnique(arr,key){

return new Set(

arr.map(item=>item[key])

).size;

}


// ---------- Statistics ----------

function updateStats(){

document.getElementById(

"totalResources"

).innerText=

allResources.length;


document.getElementById(

"liveResources"

).innerText=

allResources.length;


document.getElementById(

"totalSubjects"

).innerText=

countUnique(

allResources,

"subject"

);


document.getElementById(

"liveSubjects"

).innerText=

countUnique(

allResources,

"subject"

);


document.getElementById(

"totalClasses"

).innerText=

countUnique(

allResources,

"class"

);


document.getElementById(

"liveClasses"

).innerText=

countUnique(

allResources,

"class"

);

}


// ---------- Skeleton Loader ----------

function showSkeleton(){

resourceContainer.innerHTML="";

for(let i=0;i<6;i++){

resourceContainer.innerHTML+=`

<div class="resource-card">

<div class="skeleton skeletonTitle"></div>

<div class="skeleton skeletonText"></div>

<div class="skeleton skeletonText"></div>

<div class="skeleton skeletonBtn"></div>

</div>

`;

}

}

showSkeleton();
// ==========================================
// PART 5B
// Supabase Loading
// ==========================================


// ---------- Load Announcements ----------

async function loadAnnouncements(){

try{

announcementBox.innerHTML=`

<div class="announcement-card">

<div class="spinner"></div>

</div>

`;

const {data,error}=

await window.supabaseClient

.from("announcements")

.select("*")

.order("created_at",{ascending:false})

.limit(1);


if(error) throw error;


if(!data || data.length===0){

announcementBox.innerHTML=`

<div class="announcement-card">

<h3>No Announcements</h3>

<p>

There are currently no announcements.

</p>

</div>

`;

return;

}


const item=data[0];

announcementBox.innerHTML=`

<div class="announcement-card reveal glow">

<h3>

📢 ${item.title}

</h3>

<p>

${item.message}

</p>

</div>

`;

}catch(err){

console.error(err);

announcementBox.innerHTML=`

<div class="announcement-card">

<h3>

Unable to load announcement

</h3>

</div>

`;

showToast(

"Announcement loading failed",

"error"

);

}

}



// ---------- Load Resources ----------

async function loadResources(){

showSkeleton();

try{

const {data,error}=

await window.supabaseClient

.from("resources")

.select("*")

.order("uploaded_date",{

ascending:false

});


if(error) throw error;


allResources=data || [];


updateStats();


displayResources(

allResources

);


showToast(

"Resources Loaded",

"success"

);


}catch(err){

console.error(err);

resourceContainer.innerHTML=`

<div class="resource-card">

<h3>

Failed to load resources

</h3>

<p>

Please try again later.

</p>

</div>

`;

showToast(

"Resource loading failed",

"error"

);

}

}



// ---------- Refresh Button ----------

async function refreshResources(){

showToast(

"Refreshing...",

"warning"

);

await loadAnnouncements();

await loadResources();

}



// ---------- Auto Refresh ----------

setInterval(()=>{

loadAnnouncements();

},60000);



// ---------- Connection Check ----------

window.addEventListener(

"offline",

()=>{

showToast(

"You are offline",

"error"

);

}

);


window.addEventListener(

"online",

()=>{

showToast(

"Back online",

"success"

);

refreshResources();

}

);



// ---------- Loading Complete ----------

async function loadAll(){

await loadAnnouncements();

await loadResources();

}

// ==========================================
// PART 5C
// Display Resources & Filters
// ==========================================

// ---------- Display Resources ----------

function displayResources(resources){

resourceContainer.innerHTML="";

if(resources.length===0){

resourceContainer.innerHTML=`

<div class="resource-card">

<h2>

😕 No Resources Found

</h2>

<p>

Try another search or filter.

</p>

</div>

`;

return;

}

resources.forEach((resource,index)=>{

const card=document.createElement("div");

card.className="resource-card reveal glow";

card.style.animationDelay=`${index*0.08}s`;

const badge=

index<3

? `<div class="featuredBadge">🔥 NEW</div>`

: "";

card.innerHTML=`

${badge}

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

📚 ${resource.subject || "Subject"}

</span>

<span>

📖 ${resource.chapter || "Chapter"}

</span>

<span>

🎓 Class ${resource.class || "-"}

</span>

<span>

📄 ${resource.resource_type || "Notes"}

</span>

</div>

<button

class="open-btn"

onclick="openProtectedResource('${resource.pdf_url}')">

Open Resource

</button>

</div>

`;

resourceContainer.appendChild(card);

});

observeReveal();

}



// ---------- Subject Filters ----------

const filterButtons=

document.querySelectorAll(".filter");

filterButtons.forEach(button=>{

button.addEventListener("click",()=>{

filterButtons.forEach(btn=>

btn.classList.remove("active")

);

button.classList.add("active");

const filter=

button.innerText.toLowerCase();

if(filter==="all"){

displayResources(allResources);

return;

}

const filtered=

allResources.filter(resource=>{

const type=

(resource.resource_type||"")

.toLowerCase();

return type.includes(filter);

});

displayResources(filtered);

});

});



// ---------- Reveal Animation ----------

function observeReveal(){

const cards=

document.querySelectorAll(".reveal");

const observer=

new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

}

});

},{

threshold:.15

});

cards.forEach(card=>{

observer.observe(card);

});

}



// ---------- Featured Badge ----------

document.head.insertAdjacentHTML(

"beforeend",

`

<style>

.featuredBadge{

position:absolute;

top:18px;

right:18px;

padding:6px 12px;

border-radius:30px;

font-size:12px;

font-weight:700;

background:linear-gradient(135deg,#ff2d2d,#ff8080);

color:white;

box-shadow:0 8px 20px rgba(255,45,45,.35);

z-index:2;

}

</style>

`

);
// ==========================================
// PART 5D
// Search • Scroll • Particles • UI Effects
// ==========================================


// ---------- Live Search ----------

if(searchInput){

searchInput.addEventListener("input",()=>{

const keyword=searchInput.value
.toLowerCase()
.trim();

if(keyword===""){

displayResources(allResources);

return;

}

const filtered=allResources.filter(resource=>{

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

});

}



// ---------- Back To Top ----------

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.classList.add("show");

navbar.classList.add("scrolled");

}else{

topBtn.classList.remove("show");

navbar.classList.remove("scrolled");

}

});

if(topBtn){

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}



// ---------- Smooth Navigation ----------

document.querySelectorAll('a[href^="#"]').forEach(link=>{

link.addEventListener("click",function(e){

const target=document.querySelector(

this.getAttribute("href")

);

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

}

});

});




// ---------- Floating Particles ----------

const particleContainer=

document.getElementById("particles");

if(particleContainer){

for(let i=0;i<25;i++){

const particle=

document.createElement("div");

particle.className="particle";

particle.style.left=

Math.random()*100+"%";

particle.style.animationDuration=

(8+Math.random()*8)+"s";

particle.style.animationDelay=

Math.random()*6+"s";

particle.style.opacity=

Math.random();

particleContainer.appendChild(particle);

}

}



// ---------- Ripple Effect ----------

document.addEventListener("click",e=>{

const btn=e.target.closest("button,.open-btn");

if(!btn)return;

const ripple=

document.createElement("span");

ripple.className="ripple";

const rect=btn.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=

(e.clientX-rect.left-size/2)+"px";

ripple.style.top=

(e.clientY-rect.top-size/2)+"px";

btn.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});




// ---------- Keyboard Shortcut ----------

document.addEventListener("keydown",e=>{

if(e.key==="/"){

e.preventDefault();

searchInput.focus();

}

});




// ---------- Welcome ----------

setTimeout(()=>{

showToast(

"Welcome to The Scholars 🎓",

"success"

);

},1200);




// ---------- Resource Counter Animation ----------

function animateNumber(id,target){

const element=

document.getElementById(id);

if(!element)return;

let value=0;

const step=

Math.max(1,

Math.ceil(target/40)

);

const timer=

setInterval(()=>{

value+=step;

if(value>=target){

value=target;

clearInterval(timer);

}

element.innerText=value;

},25);

}
// ==========================================
// PART 5E
// Premium Access Code System
// ==========================================


// ---------- Elements ----------

const unlockPopup =
document.getElementById("unlockPopup");

const codeInput =
document.getElementById("codeInput");

const errorMsg =
document.getElementById("errorMsg");


// ---------- Open Protected Resource ----------

function openProtectedResource(pdf){

selectedPDF = pdf;

codeInput.value = "";

errorMsg.textContent = "";

unlockPopup.style.display = "flex";

setTimeout(()=>{

codeInput.focus();

},250);

}



// ---------- Close Popup ----------

function closePopup(){

unlockPopup.style.display = "none";

errorMsg.textContent = "";

codeInput.value = "";

}



// ---------- Verify Access Code ----------

async function checkAccessCode(){

const code =
codeInput.value.trim();

if(code===""){

errorMsg.textContent =
"Please enter your access code.";

showToast(
"Access code required",
"warning"
);

return;

}

try{

const now =
new Date().toISOString();

const {data,error} =

await window.supabaseClient

.from("access_codes")

.select("*")

.eq("access_code",code)

.eq("active",true)

.or(`expires_at.is.null,expires_at.gt.${now}`)

.limit(1);

if(error) throw error;

if(!data || data.length===0){

errorMsg.textContent =
"Invalid or expired access code.";

codeInput.classList.add("shake");

setTimeout(()=>{

codeInput.classList.remove("shake");

},500);

showToast(
"Access denied",
"error"
);

return;

}


// Save for this browser session

sessionStorage.setItem(

"scholars_access_code",

code

);

showToast(

"Access Granted 🎉",

"success"

);

closePopup();

window.open(

selectedPDF,

"_blank"

);

}catch(err){

console.error(err);

errorMsg.textContent =
"Unable to verify access code.";

showToast(

"Verification failed",

"error"

);

}

}



// ---------- Auto Unlock ----------

const savedCode =

sessionStorage.getItem(

"scholars_access_code"

);

if(savedCode){

async function verifySavedCode(){

try{

const now =
new Date().toISOString();

const {data} =

await window.supabaseClient

.from("access_codes")

.select("*")

.eq("access_code",savedCode)

.eq("active",true)

.or(`expires_at.is.null,expires_at.gt.${now}`)

.limit(1);

if(data && data.length){

window.open(

selectedPDF,

"_blank"

);

}else{

sessionStorage.removeItem(

"scholars_access_code"

);

}

}catch(e){

console.log(e);

}

}

}



// ---------- Enter Key ----------

if(codeInput){

codeInput.addEventListener(

"keydown",

e=>{

if(e.key==="Enter"){

checkAccessCode();

}

}

);

}



// ---------- ESC ----------

document.addEventListener(

"keydown",

e=>{

if(e.key==="Escape"){

closePopup();

}

}

);



// ---------- Click Outside ----------

window.addEventListener(

"click",

e=>{

if(e.target===unlockPopup){

closePopup();

}

}

);



// ---------- Shake Animation ----------

document.head.insertAdjacentHTML(

"beforeend",

`

<style>

.shake{

animation:shake .45s;

}

@keyframes shake{

0%,100%{

transform:translateX(0);

}

20%{

transform:translateX(-8px);

}

40%{

transform:translateX(8px);

}

60%{

transform:translateX(-8px);

}

80%{

transform:translateX(8px);

}

}

</style>

`

);

// ==========================================
// PART 5F
// Final Initialization & Optimization
// ==========================================


// ---------- Initialize ----------

async function init(){

try{

showSkeleton();

await loadAnnouncements();

await loadResources();

animateNumber(
"totalResources",
allResources.length
);

animateNumber(
"liveResources",
allResources.length
);

animateNumber(
"totalSubjects",
countUnique(allResources,"subject")
);

animateNumber(
"liveSubjects",
countUnique(allResources,"subject")
);

animateNumber(
"totalClasses",
countUnique(allResources,"class")
);

animateNumber(
"liveClasses",
countUnique(allResources,"class")
);

observeReveal();

showToast(
"Welcome to The Scholars 🎓",
"success"
);

}catch(err){

console.error(err);

showToast(
"Initialization Failed",
"error"
);

}

}

init();



// ---------- Lazy Loading ----------

const lazyObserver=

new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("loaded");

lazyObserver.unobserve(entry.target);

}

});

},{
threshold:0.1
});

document.querySelectorAll(

".resource-card"

).forEach(card=>{

lazyObserver.observe(card);

});




// ---------- Mobile Menu ----------

document.querySelectorAll(

"#mobileMenu a"

).forEach(link=>{

link.onclick=()=>{

mobileMenu.classList.remove("show");

mobileOpen=false;

};

});




// ---------- Hide Loading Screen ----------

window.addEventListener(

"load",

()=>{

setTimeout(()=>{

loadingScreen.style.opacity="0";

loadingScreen.style.pointerEvents="none";

setTimeout(()=>{

loadingScreen.remove();

},500);

},500);

});




// ---------- Footer Year ----------

const yearSpan=

document.getElementById("year");

if(yearSpan){

yearSpan.innerText=

new Date().getFullYear();

}




// ---------- Performance ----------

window.addEventListener(

"pageshow",

()=>{

console.log(

"The Scholars Ready"

);

});




// ---------- Prevent Double Click ----------

document.addEventListener(

"dblclick",

e=>{

if(

e.target.classList.contains(

"open-btn"

)

){

e.preventDefault();

}

});




// ---------- Easter Egg ----------

let scholarClicks=0;

const logo=

document.querySelector(".logo");

if(logo){

logo.onclick=()=>{

scholarClicks++;

if(scholarClicks===10){

showToast(

"🎉 Hidden Mode Activated!",

"success"

);

document.body.classList.toggle(

"party-mode"

);

scholarClicks=0;

}

};

}




// ---------- Keyboard Shortcuts ----------

document.addEventListener(

"keydown",

e=>{

if(e.ctrlKey && e.key==="k"){

e.preventDefault();

searchInput.focus();

}

if(e.key==="Escape"){

closePopup();

}

});




// ---------- Console Branding ----------

console.log(

"%cThe Scholars",

"font-size:28px;color:#ff2d2d;font-weight:bold;"

);

console.log(

"%cPremium Learning Platform",

"font-size:14px;color:white;"

);




// ---------- Finish ----------

showToast(

"System Ready ✅",

"success"

);
