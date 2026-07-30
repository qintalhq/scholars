/*==================================================
THE SCHOLARS ADMIN PANEL

admin.js
PART 3 - Authentication & Dashboard
==================================================*/


//==============================
// ELEMENTS
//==============================

const loginBox =
document.getElementById("loginBox");

const dashboard =
document.getElementById("dashboard");


const emailInput =
document.getElementById("adminEmail");


const passwordInput =
document.getElementById("adminPassword");


const loginError =
document.getElementById("loginError");



// Stats

const resourceCount =
document.getElementById("resourceCount");


const announcementCount =
document.getElementById("announcementCount");


const codeCount =
document.getElementById("codeCount");




//==============================
// CHECK EXISTING SESSION
//==============================


async function checkSession(){


const {

data

}=

await window.supabaseClient
.auth
.getSession();



if(data.session){


showDashboard();


}

else{


showLogin();


}


}





//==============================
// LOGIN
//==============================


async function adminLogin(){


const email =
emailInput.value.trim();


const password =
passwordInput.value.trim();



if(!email || !password){


loginError.innerText =
"Enter email and password";


return;

}



const {

data,

error

}=

await window.supabaseClient
.auth
.signInWithPassword({

email,

password

});




if(error){


console.error(error);


loginError.innerText =
"Invalid login details";


return;


}



if(data.session){


showDashboard();


}



}





//==============================
// SHOW DASHBOARD
//==============================


function showDashboard(){


if(loginBox)

loginBox.style.display="none";



if(dashboard)

dashboard.style.display="flex";



loadStats();


}





//==============================
// SHOW LOGIN
//==============================


function showLogin(){


if(loginBox)

loginBox.style.display="flex";



if(dashboard)

dashboard.style.display="none";


}





//==============================
// LOGOUT
//==============================


async function logout(){


await window.supabaseClient
.auth
.signOut();


showLogin();


}




//==============================
// LOAD STATISTICS
//==============================


async function loadStats(){



try{


const resources =

await window.supabaseClient

.from("resources")

.select("id");



const announcements =

await window.supabaseClient

.from("announcements")

.select("id");



const codes =

await window.supabaseClient

.from("access_codes")

.select("id");





if(resourceCount)

resourceCount.innerText =

resources.data?.length || 0;



if(announcementCount)

announcementCount.innerText =

announcements.data?.length || 0;



if(codeCount)

codeCount.innerText =

codes.data?.length || 0;



}

catch(error){


console.error(

"Stats Error:",

error

);


}



}




//==============================
// PASSWORD ENTER KEY
//==============================


if(passwordInput){


passwordInput.addEventListener(

"keydown",

(e)=>{


if(e.key==="Enter"){

adminLogin();

}


}

);


}




//==============================
// START
//==============================


checkSession();

/*==================================================
THE SCHOLARS ADMIN PANEL

admin.js
PART 4 - RESOURCE MANAGEMENT
==================================================*/


//==============================
// ELEMENTS
//==============================


const resourceForm =
document.getElementById("resourceForm");


const adminResourceList =
document.getElementById("adminResourceList");



//==============================
// LOAD ADMIN RESOURCES
//==============================


async function loadAdminResources(){


if(!adminResourceList)
return;



const {

data,

error

}=

await window.supabaseClient

.from("resources")

.select("*")

.order(

"uploaded_date",

{

ascending:false

}

);



if(error){


console.error(error);


return;

}




adminResourceList.innerHTML="";



data.forEach(resource=>{


const row = document.createElement("tr");



row.innerHTML = `

<td>

${resource.title}

</td>


<td>

${resource.subject || "-"}

</td>


<td>

${resource.class || "-"}

</td>



<td>


<button

class="admin-btn"

onclick="deleteResource('${resource.id}')">

Delete

</button>


</td>

`;



adminResourceList.appendChild(row);



});


}






//==============================
// ADD RESOURCE
//==============================


async function addResource(e){


e.preventDefault();



const resource={


title:

document.getElementById(

"resourceTitle"

).value,



description:

document.getElementById(

"resourceDescription"

).value,



subject:

document.getElementById(

"resourceSubject"

).value,



chapter:

document.getElementById(

"resourceChapter"

).value,



class:

document.getElementById(

"resourceClass"

).value,



resource_type:

document.getElementById(

"resourceType"

).value,



pdf_url:

document.getElementById(

"resourcePdf"

).value


};





const {

error

}=

await window.supabaseClient

.from("resources")

.insert([resource]);




if(error){


console.error(error);


alert(

"Failed to add resource"

);


return;


}




alert(

"Resource added successfully"

);



resourceForm.reset();



loadAdminResources();



}




//==============================
// DELETE RESOURCE
//==============================


async function deleteResource(id){



const confirmDelete =

confirm(

"Delete this resource?"

);



if(!confirmDelete)

return;




const {

error

}=

await window.supabaseClient

.from("resources")

.delete()

.eq(

"id",

id

);



if(error){


console.error(error);


alert(

"Delete failed"

);


return;

}



alert(

"Resource deleted"

);



loadAdminResources();



}





//==============================
// FORM EVENT
//==============================


if(resourceForm){


resourceForm.addEventListener(

"submit",

addResource

);


}



//==============================
// LOAD WHEN OPEN
//==============================


loadAdminResources();

/*==================================================
THE SCHOLARS ADMIN PANEL

admin.js
PART 5 - ANNOUNCEMENTS & ACCESS CODES
==================================================*/


//==============================
// ELEMENTS
//==============================


const announcementForm =
document.getElementById(
"announcementForm"
);


const announcementList =
document.getElementById(
"announcementList"
);



const codeForm =
document.getElementById(
"codeForm"
);


const codeList =
document.getElementById(
"codeList"
);




//==============================
// LOAD ANNOUNCEMENTS
//==============================


async function loadAdminAnnouncements(){


if(!announcementList)
return;



const {

data,

error

}=

await window.supabaseClient

.from("announcements")

.select("*")

.order(

"created_at",

{

ascending:false

}

);



if(error){

console.error(error);

return;

}




announcementList.innerHTML="";



data.forEach(item=>{


const row=document.createElement("tr");


row.innerHTML=`

<td>

${item.title}

</td>


<td>

${item.message}

</td>


<td>


<button

class="admin-btn"

onclick="deleteAnnouncement('${item.id}')">

Delete

</button>


</td>

`;



announcementList.appendChild(row);


});


}







//==============================
// ADD ANNOUNCEMENT
//==============================


async function addAnnouncement(e){


e.preventDefault();



const announcement={


title:

document.getElementById(

"announcementTitle"

).value,



message:

document.getElementById(

"announcementMessage"

).value


};




const {

error

}=

await window.supabaseClient

.from("announcements")

.insert([announcement]);




if(error){


console.error(error);


alert(

"Failed to add announcement"

);


return;

}



alert(

"Announcement added"

);



announcementForm.reset();


loadAdminAnnouncements();



}




//==============================
// DELETE ANNOUNCEMENT
//==============================


async function deleteAnnouncement(id){



if(!confirm(

"Delete announcement?"

))

return;



const {

error

}=

await window.supabaseClient

.from("announcements")

.delete()

.eq(

"id",

id

);



if(error){

console.error(error);

return;

}



loadAdminAnnouncements();



}






//==============================
// CREATE ACCESS CODE
//==============================


async function createAccessCode(e){


e.preventDefault();



const code =

document.getElementById(

"accessCode"

).value.trim();



const expiry =

document.getElementById(

"codeExpiry"

).value;




if(!code){


alert(

"Enter access code"

);


return;

}





const accessData={


access_code:code,


active:true,


expires_at:

expiry || null


};





const {

error

}=

await window.supabaseClient

.from("access_codes")

.insert([accessData]);





if(error){


console.error(error);


alert(

"Code creation failed"

);


return;

}




alert(

"Access code created"

);



codeForm.reset();


loadAccessCodes();



}







//==============================
// LOAD ACCESS CODES
//==============================


async function loadAccessCodes(){


if(!codeList)

return;



const {

data,

error

}=

await window.supabaseClient

.from("access_codes")

.select("*")

.order(

"created_at",

{

ascending:false

}

);




if(error){

console.error(error);

return;

}




codeList.innerHTML="";



data.forEach(code=>{


const row=document.createElement("tr");



row.innerHTML=`

<td>

${code.access_code}

</td>


<td>

${code.active ? "Active":"Disabled"}

</td>


<td>

${

code.expires_at || "No expiry"

}

</td>



<td>


<button

class="admin-btn"

onclick="toggleCode('${code.id}',${code.active})">

Toggle

</button>



<button

class="admin-btn"

onclick="deleteCode('${code.id}')">

Delete

</button>



</td>

`;



codeList.appendChild(row);



});


}






//==============================
// TOGGLE CODE STATUS
//==============================


async function toggleCode(id,status){



await window.supabaseClient

.from("access_codes")

.update({

active:!status

})

.eq(

"id",

id

);



loadAccessCodes();



}






//==============================
// DELETE ACCESS CODE
//==============================


async function deleteCode(id){


if(!confirm(

"Delete access code?"

))

return;



await window.supabaseClient

.from("access_codes")

.delete()

.eq(

"id",

id

);



loadAccessCodes();



}






//==============================
// EVENTS
//==============================


if(announcementForm){


announcementForm.addEventListener(

"submit",

addAnnouncement

);


}




if(codeForm){


codeForm.addEventListener(

"submit",

createAccessCode

);


}






//==============================
// START LOAD
//==============================


loadAdminAnnouncements();

loadAccessCodes();

/*==================================================
THE SCHOLARS ADMIN PANEL

admin.js
PART 6 - ADVANCED FEATURES & FINAL SYSTEM
==================================================*/


//==============================
// ADMIN SEARCH
//==============================


const adminSearch =

document.getElementById(
"adminSearch"
);



if(adminSearch){


adminSearch.addEventListener(

"input",

()=>{


const keyword =

adminSearch.value

.toLowerCase()

.trim();



document

.querySelectorAll(

".admin-table tbody tr"

)

.forEach(row=>{


const text =

row.innerText

.toLowerCase();



if(text.includes(keyword)){


row.style.display="";


}

else{


row.style.display="none";


}



});


});


}





//==============================
// DASHBOARD REFRESH
//==============================


async function refreshDashboard(){


await loadStats();


await loadAdminResources();


await loadAdminAnnouncements();


await loadAccessCodes();



console.log(

"Dashboard refreshed"

);


}






//==============================
// AUTO REFRESH
//==============================


setInterval(()=>{


const dashboardVisible =

dashboard &&

dashboard.style.display !== "none";



if(dashboardVisible){


refreshDashboard();


}



},120000);






//==============================
// AUTH PROTECTION
//==============================


async function protectAdmin(){



const {

data

}=

await window.supabaseClient

.auth

.getSession();




if(!data.session){


showLogin();


}



}





//==============================
// ERROR LOGGER
//==============================


window.addEventListener(

"error",

(event)=>{


console.error(

"Admin Error:",

event.error

);


});






//==============================
// DATE FORMATTER
//==============================


function formatDate(date){


if(!date)

return "-";



return new Date(date)

.toLocaleDateString(

"en-IN",

{

day:"2-digit",

month:"short",

year:"numeric"

}

);


}





//==============================
// FINAL STARTUP
//==============================


async function adminStart(){


await protectAdmin();



checkSession();



}




adminStart();
