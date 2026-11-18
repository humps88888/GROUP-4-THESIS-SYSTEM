

let clients =
JSON.parse(
localStorage.getItem("novaTechClients")
) || [];

let videos = [];


let videoDB = null;

const DB_NAME = "NovaTechSecurityDB";
const DB_VERSION = 1;
const VIDEO_STORE = "videos";

function openVideoDatabase() {

return new Promise((resolve, reject) => {

    const request =
        indexedDB.open(
            DB_NAME,
            DB_VERSION
        );


    request.onupgradeneeded = function(event) {

        const db = event.target.result;

        if (!db.objectStoreNames.contains(VIDEO_STORE)) {

            db.createObjectStore(
                VIDEO_STORE,
                {
                    keyPath: "id"
                }
            );

        }

    };


    request.onsuccess = function(event) {

        videoDB = event.target.result;

        resolve(videoDB);

    };


    request.onerror = function() {

        reject(request.error);

    };

});

}

/* GET ALL VIDEOS */

function getAllVideos() {

return new Promise((resolve, reject) => {

    if (!videoDB) {

        resolve([]);

        return;

    }

    const transaction =
        videoDB.transaction(
            VIDEO_STORE,
            "readonly"
        );

    const store =
        transaction.objectStore(
            VIDEO_STORE
        );

    const request =
        store.getAll();


    request.onsuccess = function() {

        resolve(
            request.result || []
        );

    };


    request.onerror = function() {

        reject(request.error);

    };

});

}

/* SAVE VIDEO */

function saveVideoToDatabase(video) {

return new Promise((resolve, reject) => {

    const transaction =
        videoDB.transaction(
            VIDEO_STORE,
            "readwrite"
        );

    const store =
        transaction.objectStore(
            VIDEO_STORE
        );

    const request =
        store.put(video);


    request.onsuccess = function() {

        resolve();

    };


    request.onerror = function() {

        reject(request.error);

    };

});

}

/* DELETE VIDEO */

function deleteVideoFromDatabase(id) {

return new Promise((resolve, reject) => {

    const transaction =
        videoDB.transaction(
            VIDEO_STORE,
            "readwrite"
        );

    const store =
        transaction.objectStore(
            VIDEO_STORE
        );

    const request =
        store.delete(id);


    request.onsuccess = function() {

        resolve();

    };


    request.onerror = function() {

        reject(request.error);

    };

});

}



const sections =
document.querySelectorAll(
".page-section"
);

const navLinks =
document.querySelectorAll(
".nav-link"
);

const sidebar =
document.querySelector(
".sidebar"
);

const menuButton =
document.getElementById(
"menuButton"
);



function showPage(pageId) {

sections.forEach(section => {

    section.classList.add(
        "hidden"
    );

});


const selected =
    document.getElementById(
        pageId
    );


if (!selected) {

    pageId = "dashboard";

    document
        .getElementById("dashboard")
        .classList.remove("hidden");

} else {

    selected.classList.remove(
        "hidden"
    );

}


navLinks.forEach(link => {

    link.classList.remove(
        "active"
    );


    if (
        link.getAttribute("href") ===
        "#" + pageId
    ) {

        link.classList.add(
            "active"
        );

    }

});


updatePageTitle(pageId);


if (pageId === "dashboard") {

    updateDashboard();

}


if (pageId === "clients") {

    displayClients();

}


if (pageId === "records") {

    displayRecords();

}


if (pageId === "camera") {

    updateVideoClientList();

    displayVideos();

}


/* Close mobile menu */

if (sidebar) {

    sidebar.classList.remove(
        "open"
    );

}


window.scrollTo({
    top: 0,
    behavior: "smooth"
});

}

/* =========================================================
PAGE TITLE
========================================================= */

function updatePageTitle(pageId) {

const title =
    document.getElementById(
        "pageTitle"
    );


const subtitle =
    document.getElementById(
        "pageSubtitle"
    );


const pages = {

    dashboard: [
        "Security Dashboard",
        "Manage clients, records and security events."
    ],

    clients: [
        "Client Records",
        "Search and manage registered clients."
    ],

    register: [
        "Register New Client",
        "Create a complete client profile."
    ],

    camera: [
        "Video Recording",
        "Record security events using your device camera."
    ],

    records: [
        "Security Records",
        "Client activity and security information."
    ]

};


if (pages[pageId]) {

    title.textContent =
        pages[pageId][0];

    subtitle.textContent =
        pages[pageId][1];

}

}

/* =========================================================
BROWSER NAVIGATION
========================================================= */

function handleNavigation() {

let page =
    window.location.hash.substring(1);


if (!page) {

    page = "dashboard";

}


showPage(page);

}

window.addEventListener(
"hashchange",
handleNavigation
);

/* =========================================================
MOBILE MENU
========================================================= */

if (menuButton) {

menuButton.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);

}

/* =========================================================
NOTIFICATION
========================================================= */

function notify(message) {

const notification =
    document.getElementById(
        "notification"
    );


const text =
    document.getElementById(
        "notificationText"
    );


if (!notification || !text) {

    return;

}


text.textContent =
    message;


notification.classList.add(
    "show"
);


setTimeout(() => {

    notification.classList.remove(
        "show"
    );

}, 3000);

}

/* =========================================================
CLIENT FORM
========================================================= */

const clientForm =
document.getElementById(
"clientForm"
);

/* =========================================================
REGISTER CLIENT
========================================================= */

if (clientForm) {

clientForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const client = {

            id:
                document
                    .getElementById(
                        "clientId"
                    )
                    .value
                    .trim(),

            name:
                document
                    .getElementById(
                        "fullName"
                    )
                    .value
                    .trim(),

            dob:
                document
                    .getElementById(
                        "dob"
                    )
                    .value,

            gender:
                document
                    .getElementById(
                        "gender"
                    )
                    .value,

            phone:
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim(),

            email:
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim(),

            address:
                document
                    .getElementById(
                        "address"
                    )
                    .value
                    .trim(),

            notes:
                document
                    .getElementById(
                        "notes"
                    )
                    .value
                    .trim(),

            createdAt:
                new Date().toISOString()

        };


        /* Check required fields */

        if (
            client.id === "" ||
            client.name === ""
        ) {

            notify(
                "Please complete the required fields."
            );

            return;

        }


        /* Check duplicate Client ID */

        const duplicate =
            clients.some(
                existing =>
                    existing.id.toLowerCase() ===
                    client.id.toLowerCase()
            );


        if (duplicate) {

            notify(
                "Client ID already exists."
            );

            return;

        }


        /* Save client */

        clients.push(
            client
        );


        saveClients();


        clientForm.reset();


        notify(
            "Client registered successfully."
        );


        updateDashboard();


        updateVideoClientList();


        setTimeout(() => {

            window.location.hash =
                "clients";

        }, 500);

    }
);

}

/* =========================================================
SAVE CLIENTS
========================================================= */

function saveClients() {

localStorage.setItem(
    "novaTechClients",
    JSON.stringify(clients)
);

}

/* =========================================================
DASHBOARD
========================================================= */

function updateDashboard() {

const totalClients =
    document.getElementById(
        "totalClients"
    );


const todayClients =
    document.getElementById(
        "todayClients"
    );


const totalVideos =
    document.getElementById(
        "totalVideos"
    );


const totalRecords =
    document.getElementById(
        "totalRecords"
    );


if (totalClients) {

    totalClients.textContent =
        clients.length;

}


const today =
    new Date().toDateString();


const todayCount =
    clients.filter(client => {

        return (
            new Date(
                client.createdAt
            ).toDateString() === today
        );

    }).length;


if (todayClients) {

    todayClients.textContent =
        todayCount;

}


if (totalVideos) {

    totalVideos.textContent =
        videos.length;

}


const recordsCount =
    clients.filter(client => {

        return (
            client.notes &&
            client.notes.trim() !== ""
        );

    }).length;


if (totalRecords) {

    totalRecords.textContent =
        recordsCount;

}


displayRecentClients();

}

/* =========================================================
RECENT CLIENTS
========================================================= */

function displayRecentClients() {

const container =
    document.getElementById(
        "recentClients"
    );


if (!container) {

    return;

}


if (clients.length === 0) {

    container.innerHTML = `

        <div class="empty">

            No clients registered yet.

        </div>

    `;

    return;

}


const recent =
    [...clients]
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, 5);


container.innerHTML = `

    <div class="table-row table-header">

        <div>CLIENT</div>

        <div>CLIENT ID</div>

        <div>PHONE</div>

        <div>DATE</div>

    </div>

`;


recent.forEach(client => {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "table-row";


    row.innerHTML = `

        <div class="client-name">

            <div class="client-avatar">

                ${getInitial(client.name)}

            </div>

            <strong>

                ${escapeHTML(client.name)}

            </strong>

        </div>


        <div>

            ${escapeHTML(client.id)}

        </div>


        <div>

            ${escapeHTML(
                client.phone || "-"
            )}

        </div>


        <div>

            ${formatDate(
                client.createdAt
            )}

        </div>

    `;


    container.appendChild(
        row
    );

});

}

/* =========================================================
SEARCH CLIENTS
========================================================= */

const searchInput =
document.getElementById(
"searchInput"
);

if (searchInput) {

searchInput.addEventListener(
    "input",
    displayClients
);

}

/* =========================================================
DISPLAY CLIENTS
========================================================= */

function displayClients() {

const container =
    document.getElementById(
        "clientList"
    );


if (!container) {

    return;

}


const search =
    searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


const filtered =
    clients.filter(client => {

        return (

            client.name
                .toLowerCase()
                .includes(search)

            ||

            client.id
                .toLowerCase()
                .includes(search)

            ||

            (client.phone || "")
                .toLowerCase()
                .includes(search)

            ||

            (client.email || "")
                .toLowerCase()
                .includes(search)

        );

    });


if (filtered.length === 0) {

    container.innerHTML = `

        <div class="panel">

            No client records found.

        </div>

    `;

    return;

}


container.innerHTML = "";


filtered.forEach(client => {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "client-card";


    card.innerHTML = `

        <div class="client-card-header">

            <div class="client-avatar">

                ${getInitial(client.name)}

            </div>


            <div>

                <h3>

                    ${escapeHTML(client.name)}

                </h3>


                <span>

                    ${escapeHTML(client.id)}

                </span>

            </div>

        </div>


        <div class="client-details">


            <div class="detail">

                <span>
                    Phone
                </span>

                <strong>

                    ${escapeHTML(
                        client.phone || "-"
                    )}

                </strong>

            </div>


            <div class="detail">

                <span>
                    Email
                </span>

                <strong>

                    ${escapeHTML(
                        client.email || "-"
                    )}

                </strong>

            </div>


            <div class="detail">

                <span>
                    Gender
                </span>

                <strong>

                    ${escapeHTML(
                        client.gender || "-"
                    )}

                </strong>

            </div>


            <div class="detail">

                <span>
                    Registered
                </span>

                <strong>

                    ${formatDate(
                        client.createdAt
                    )}

                </strong>

            </div>

        </div>


        <div class="client-card-actions">


            <button
                type="button"
                class="primary-button"
                onclick="viewClient('${escapeAttribute(client.id)}')">

                View Record

            </button>


            <button
                type="button"
                class="secondary-button"
                onclick="editClient('${escapeAttribute(client.id)}')">

                Edit

            </button>


            <button
                type="button"
                class="secondary-button"
                onclick="deleteClient('${escapeAttribute(client.id)}')">

                Delete

            </button>


        </div>

    `;


    container.appendChild(
        card
    );

});

}

/* =========================================================
VIEW CLIENT
========================================================= */

function viewClient(id) {

const client =
    clients.find(
        item =>
            item.id === id
    );


if (!client) {

    notify(
        "Client not found."
    );

    return;

}


alert(

    "CLIENT RECORD\n\n" +

    "Name: " +
    client.name +
    "\n\n" +

    "Client ID: " +
    client.id +
    "\n\n" +

    "Date of Birth: " +
    (client.dob || "-") +
    "\n\n" +

    "Gender: " +
    (client.gender || "-") +
    "\n\n" +

    "Phone: " +
    (client.phone || "-") +
    "\n\n" +

    "Email: " +
    (client.email || "-") +
    "\n\n" +

    "Address:\n" +
    (client.address || "-") +
    "\n\n" +

    "Security Record:\n" +
    (client.notes || "No record.") +
    "\n\n" +

    "Registered:\n" +
    formatDateTime(
        client.createdAt
    )

);

}

/* =========================================================
EDIT CLIENT
========================================================= */

function editClient(id) {

const client =
    clients.find(
        item =>
            item.id === id
    );


if (!client) {

    notify(
        "Client not found."
    );

    return;

}


/* Open registration page */

window.location.hash =
    "register";


setTimeout(() => {

    document.getElementById(
        "clientId"
    ).value =
        client.id;


    document.getElementById(
        "fullName"
    ).value =
        client.name;


    document.getElementById(
        "dob"
    ).value =
        client.dob || "";


    document.getElementById(
        "gender"
    ).value =
        client.gender || "";


    document.getElementById(
        "phone"
    ).value =
        client.phone || "";


    document.getElementById(
        "email"
    ).value =
        client.email || "";


    document.getElementById(
        "address"
    ).value =
        client.address || "";


    document.getElementById(
        "notes"
    ).value =
        client.notes || "";


    clientForm.dataset.editing =
        id;


    const button =
        clientForm.querySelector(
            'button[type="submit"]'
        );


    if (button) {

        button.textContent =
            "Update Client";

    }


    notify(
        "Edit client information and click Update Client."
    );

}, 100);

}

/* =========================================================
HANDLE CLIENT UPDATE
========================================================= */

if (clientForm) {

clientForm.addEventListener(
    "submit",
    function(event) {

        const editingId =
            clientForm.dataset.editing;


        if (!editingId) {

            return;

        }


        event.preventDefault();


        const index =
            clients.findIndex(
                client =>
                    client.id ===
                    editingId
            );


        if (index === -1) {

            notify(
                "Client not found."
            );

            return;

        }


        const updatedClient = {

            id:
                document
                    .getElementById(
                        "clientId"
                    )
                    .value
                    .trim(),

            name:
                document
                    .getElementById(
                        "fullName"
                    )
                    .value
                    .trim(),

            dob:
                document
                    .getElementById(
                        "dob"
                    )
                    .value,

            gender:
                document
                    .getElementById(
                        "gender"
                    )
                    .value,

            phone:
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim(),

            email:
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim(),

            address:
                document
                    .getElementById(
                        "address"
                    )
                    .value
                    .trim(),

            notes:
                document
                    .getElementById(
                        "notes"
                    )
                    .value
                    .trim(),

            createdAt:
                clients[index].createdAt,

            updatedAt:
                new Date().toISOString()

        };


        /* Check duplicate ID */

        const duplicate =
            clients.some(
                (client, i) =>
                    i !== index &&
                    client.id.toLowerCase() ===
                    updatedClient.id.toLowerCase()
            );


        if (duplicate) {

            notify(
                "Another client already uses this Client ID."
            );

            return;

        }


        clients[index] =
            updatedClient;


        saveClients();


        delete clientForm.dataset.editing;


        clientForm.reset();


        const button =
            clientForm.querySelector(
                'button[type="submit"]'
            );


        if (button) {

            button.textContent =
                "Save Client";

        }


        notify(
            "Client information updated successfully."
        );


        updateDashboard();


        updateVideoClientList();


        window.location.hash =
            "clients";

    }
);

}

/* =========================================================
CLEAR / RESET FORM
========================================================= */

if (clientForm) {

clientForm.addEventListener(
    "reset",
    function() {

        delete clientForm.dataset.editing;


        setTimeout(() => {

            const button =
                clientForm.querySelector(
                    'button[type="submit"]'
                );


            if (button) {

                button.textContent =
                    "Save Client";

            }

        }, 0);

    }
);

}

/* =========================================================
DELETE CLIENT
========================================================= */

async function deleteClient(id) {

const client =
    clients.find(
        item =>
            item.id === id
    );


if (!client) {

    notify(
        "Client not found."
    );

    return;

}


const confirmed =
    confirm(
        "Delete " +
        client.name +
        "?\n\nThis will also delete videos associated with this client."
    );


if (!confirmed) {

    return;

}


clients =
    clients.filter(
        client =>
            client.id !== id
    );


saveClients();


/* Delete associated videos */

const associatedVideos =
    videos.filter(
        video =>
            video.clientId === id
    );


for (
    const video
    of associatedVideos
) {

    await deleteVideoFromDatabase(
        video.id
    );

}


videos =
    videos.filter(
        video =>
            video.clientId !== id
    );


displayClients();

displayRecords();

displayVideos();

updateDashboard();

updateVideoClientList();


notify(
    "Client and associated records deleted."
);

}

/* =========================================================
CAMERA VARIABLES
========================================================= */

let cameraStream = null;

let mediaRecorder = null;

let recordedChunks = [];

let recordingStartTime = null;

const cameraVideo =
document.getElementById(
"cameraVideo"
);

const cameraPlaceholder =
document.getElementById(
"cameraPlaceholder"
);

const cameraStatus =
document.getElementById(
"cameraStatus"
);

const recordButton =
document.getElementById(
"recordButton"
);

const recordState =
document.getElementById(
"recordState"
);

const recordStatus =
document.getElementById(
"recordStatus"
);

/* =========================================================
START CAMERA BUTTON
========================================================= */

const startCameraButton =
document.getElementById(
"startCamera"
);

if (startCameraButton) {

startCameraButton.addEventListener(
    "click",
    startCamera
);

}

/* =========================================================
START CAMERA
========================================================= */

async function startCamera() {

if (!navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia) {

    alert(
        "Your browser does not support camera access."
    );

    return;

}


try {

    /* Stop old camera first */

    if (cameraStream) {

        stopCamera();

    }


    cameraStream =
        await navigator.mediaDevices.getUserMedia({

            video: true,

            audio: true

        });


    cameraVideo.srcObject =
        cameraStream;


    cameraVideo.style.display =
        "block";


    cameraPlaceholder.style.display =
        "none";


    recordButton.disabled =
        false;


    cameraStatus.textContent =
        "Camera active";


    recordState.textContent =
        "Ready";


    recordStatus.textContent =
        "";


    notify(
        "Camera started successfully."
    );

}

catch (error) {

    console.error(
        "Camera error:",
        error
    );


    cameraStatus.textContent =
        "Camera unavailable";


    alert(
        "Camera access was denied or unavailable.\n\nPlease allow camera and microphone permission in your browser."
    );

}

}

/* =========================================================
STOP CAMERA BUTTON
========================================================= */

const stopCameraButton =
document.getElementById(
"stopCamera"
);

if (stopCameraButton) {

stopCameraButton.addEventListener(
    "click",
    stopCamera
);

}

/* =========================================================
STOP CAMERA
========================================================= */

function stopCamera() {

if (
    mediaRecorder &&
    mediaRecorder.state ===
    "recording"
) {

    mediaRecorder.stop();

}


if (cameraStream) {

    cameraStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });

}


cameraStream = null;


if (cameraVideo) {

    cameraVideo.srcObject =
        null;

    cameraVideo.style.display =
        "none";

}


if (cameraPlaceholder) {

    cameraPlaceholder.style.display =
        "flex";

}


if (recordButton) {

    recordButton.disabled =
        true;

}


if (cameraStatus) {

    cameraStatus.textContent =
        "Camera inactive";

}


if (recordState) {

    recordState.textContent =
        "Ready";

}


const indicator =
    document.getElementById(
        "recordIndicator"
    );


if (indicator) {

    indicator.innerHTML =
        "";

}


if (recordStatus) {

    recordStatus.textContent =
        "";

}

}

/* =========================================================
RECORD BUTTON
========================================================= */

if (recordButton) {

recordButton.addEventListener(
    "click",
    function() {

        if (
            mediaRecorder &&
            mediaRecorder.state ===
            "recording"
        ) {

            stopRecording();

        } else {

            startRecording();

        }

    }
);

}

/* =========================================================
START RECORDING
========================================================= */

function startRecording() {

if (!cameraStream) {

    notify(
        "Start the camera first."
    );

    return;

}


if (
    !window.MediaRecorder
) {

    alert(
        "Your browser does not support video recording."
    );

    return;

}


recordedChunks = [];


let mimeType =
    "video/webm;codecs=vp9";


if (
    !MediaRecorder.isTypeSupported(
        mimeType
    )
) {

    mimeType =
        "video/webm;codecs=vp8";

}


if (
    !MediaRecorder.isTypeSupported(
        mimeType
    )
) {

    mimeType =
        "video/webm";

}


try {

    mediaRecorder =
        new MediaRecorder(
            cameraStream,
            {
                mimeType:
                    mimeType
            }
        );

}

catch (error) {

    console.error(error);

    notify(
        "Unable to start video recording."
    );

    return;

}


mediaRecorder.ondataavailable =
    function(event) {

        if (
            event.data &&
            event.data.size > 0
        ) {

            recordedChunks.push(
                event.data
            );

        }

    };


mediaRecorder.onstop =
    function() {

        saveRecording();

    };


mediaRecorder.onerror =
    function(event) {

        console.error(
            "Recording error:",
            event
        );

        notify(
            "An error occurred during recording."
        );

    };


mediaRecorder.start(
    1000
);


recordingStartTime =
    new Date();


recordButton.textContent =
    "■ Stop Recording";


recordButton.classList.add(
    "recording"
);


recordState.textContent =
    "Recording";


recordStatus.textContent =
    "● Recording security video...";


const indicator =
    document.getElementById(
        "recordIndicator"
    );


if (indicator) {

    indicator.innerHTML =
        '<span class="recording">● REC</span>';

}

}

/* =========================================================
STOP RECORDING
========================================================= */

function stopRecording() {

if (
    mediaRecorder &&
    mediaRecorder.state ===
    "recording"
) {

    mediaRecorder.stop();

}


recordButton.textContent =
    "● Start Recording";


recordButton.classList.remove(
    "recording"
);


recordState.textContent =
    "Processing";


recordStatus.textContent =
    "Processing recording...";


const indicator =
    document.getElementById(
        "recordIndicator"
    );


if (indicator) {

    indicator.innerHTML =
        "";

}

}

/* =========================================================
SAVE RECORDING
========================================================= */

async function saveRecording() {

if (
    recordedChunks.length ===
    0
) {

    notify(
        "No video data was recorded."
    );

    return;

}


try {

    const blob =
        new Blob(
            recordedChunks,
            {
                type:
                    "video/webm"
            }
        );


    const clientId =
        document.getElementById(
            "videoClient"
        ).value;


    const client =
        clients.find(
            item =>
                item.id ===
                clientId
        );


    const video = {

        id:
            Date.now(),

        clientId:
            clientId,

        clientName:
            client
                ? client.name
                : "Unassigned Recording",

        date:
            new Date().toISOString(),

        duration:
            recordingStartTime
                ? Math.round(
                    (
                        new Date() -
                        recordingStartTime
                    ) / 1000
                )
                : 0,

        type:
            "video/webm",

        blob:
            blob

    };


    await saveVideoToDatabase(
        video
    );


    videos =
        await getAllVideos();


    recordState.textContent =
        "Ready";


    recordStatus.textContent =
        "Recording saved successfully.";


    displayVideos();


    updateDashboard();


    notify(
        "Video recording saved successfully."
    );


    recordedChunks = [];

}

catch (error) {

    console.error(
        "Could not save recording:",
        error
    );


    recordState.textContent =
        "Error";


    recordStatus.textContent =
        "Could not save recording.";


    notify(
        "Could not save video."
    );

}

}

/* =========================================================
VIDEO CLIENT DROPDOWN
========================================================= */

function updateVideoClientList() {

const select =
    document.getElementById(
        "videoClient"
    );


if (!select) {

    return;

}


const currentValue =
    select.value;


select.innerHTML = `

    <option value="">
        No client selected
    </option>

`;


clients.forEach(client => {

    const option =
        document.createElement(
            "option"
        );


    option.value =
        client.id;


    option.textContent =
        client.name +
        " (" +
        client.id +
        ")";


    select.appendChild(
        option
    );

});


if (
    clients.some(
        client =>
            client.id ===
            currentValue
    )
) {

    select.value =
        currentValue;

}

}

/* =========================================================
DISPLAY VIDEOS
========================================================= */

async function displayVideos() {

const container =
    document.getElementById(
        "videoList"
    );


if (!container) {

    return;

}


videos =
    await getAllVideos();


if (videos.length === 0) {

    container.innerHTML = `

        <div class="empty">

            <p>
                No video recordings yet.
            </p>

        </div>

    `;

    return;

}


container.innerHTML =
    "";


const sortedVideos =
    [...videos].sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


sortedVideos.forEach(video => {

    const client =
        clients.find(
            item =>
                item.id ===
                video.clientId
        );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "video-record-card";


    const videoElement =
        document.createElement(
            "video"
        );


    videoElement.controls =
        true;


    videoElement.preload =
        "metadata";


    const videoURL =
        URL.createObjectURL(
            video.blob
        );


    videoElement.src =
        videoURL;


    const title =
        document.createElement(
            "strong"
        );


    title.textContent =
        client
            ? client.name
            : "Unassigned Recording";


    const date =
        document.createElement(
            "p"
        );


    date.textContent =
        formatDateTime(
            video.date
        );


    const duration =
        document.createElement(
            "p"
        );


    duration.textContent =
        "Duration: " +
        formatDuration(
            video.duration
        );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "secondary-button";


    deleteButton.textContent =
        "Delete Recording";


    deleteButton.style.marginTop =
        "10px";


    deleteButton.addEventListener(
        "click",
        function() {

            deleteVideo(
                video.id
            );

        }
    );


    card.appendChild(
        title
    );


    card.appendChild(
        date
    );


    card.appendChild(
        duration
    );


    card.appendChild(
        videoElement
    );


    card.appendChild(
        deleteButton
    );


    container.appendChild(
        card
    );

});

}

/* =========================================================
DELETE VIDEO
========================================================= */

async function deleteVideo(id) {

const confirmed =
    confirm(
        "Delete this video recording?"
    );


if (!confirmed) {

    return;

}


try {

    await deleteVideoFromDatabase(
        id
    );


    videos =
        await getAllVideos();


    displayVideos();


    updateDashboard();


    notify(
        "Video recording deleted."
    );

}

catch (error) {

    console.error(
        error
    );


    notify(
        "Could not delete video."
    );

}

}

/* =========================================================
SECURITY RECORDS
========================================================= */

function displayRecords() {

const container =
    document.getElementById(
        "recordsList"
    );


if (!container) {

    return;

}


const clientsWithRecords =
    clients.filter(
        client =>
            client.notes &&
            client.notes.trim() !== ""
    );


if (
    clientsWithRecords.length ===
    0
) {

    container.innerHTML = `

        <div class="empty">

            <p>
                No security records available.
            </p>

        </div>

    `;

    return;

}


container.innerHTML =
    "";


const sorted =
    [...clientsWithRecords].sort(
        (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
    );


sorted.forEach(client => {

    const item =
        document.createElement(
            "div"
        );


    item.style.padding =
        "20px 0";


    item.style.borderBottom =
        "1px solid #e2e8f0";


    item.innerHTML = `

        <strong>

            ${escapeHTML(
                client.name
            )}

        </strong>


        <p style="margin-top:8px;">

            Client ID:
            ${escapeHTML(
                client.id
            )}

        </p>


        <p style="margin-top:8px;">

            ${escapeHTML(
                client.notes
            )}

        </p>


        <small>

            ${formatDateTime(
                client.createdAt
            )}

        </small>

    `;


    container.appendChild(
        item
    );

});

}

/* =========================================================
UTILITY FUNCTIONS
========================================================= */

function getInitial(name) {

if (!name) {

    return "?";

}


return name
    .charAt(0)
    .toUpperCase();

}

/* FORMAT DATE */

function formatDate(date) {

if (!date) {

    return "-";

}


const parsed =
    new Date(date);


if (
    Number.isNaN(
        parsed.getTime()
    )
) {

    return "-";

}


return parsed.toLocaleDateString(
    undefined,
    {
        year: "numeric",
        month: "short",
        day: "numeric"
    }
);

}

/* FORMAT DATE AND TIME */

function formatDateTime(date) {

if (!date) {

    return "-";

}


const parsed =
    new Date(date);


if (
    Number.isNaN(
        parsed.getTime()
    )
) {

    return "-";

}


return parsed.toLocaleString(
    undefined,
    {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }
);

}

/* FORMAT VIDEO DURATION */

function formatDuration(seconds) {

if (!seconds) {

    return "0 seconds";

}


const minutes =
    Math.floor(
        seconds / 60
    );


const remainingSeconds =
    seconds % 60;


if (minutes === 0) {

    return (
        remainingSeconds +
        " seconds"
    );

}


return (
    minutes +
    " min " +
    remainingSeconds +
    " sec"
);

}

/* =========================================================
SECURITY / HTML ESCAPING
========================================================= */

function escapeHTML(value) {

return String(value)

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}

/* =========================================================
ATTRIBUTE ESCAPING
========================================================= */

function escapeAttribute(value) {

return String(value)

    .replace(
        /\\/g,
        "\\\\"
    )

    .replace(
        /'/g,
        "\\'"
    );

}

/* =========================================================
KEYBOARD SHORTCUT
ESC = STOP CAMERA
========================================================= */

document.addEventListener(
"keydown",
function(event) {

    if (
        event.key ===
        "Escape"
    ) {

        if (cameraStream) {

            stopCamera();

            notify(
                "Camera stopped."
            );

        }

    }

}

);

/* =========================================================
PAGE EXIT
STOP CAMERA AUTOMATICALLY
========================================================= */

window.addEventListener(
"beforeunload",
function() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

    }

}

);

/* =========================================================
INITIALIZATION
========================================================= */

async function initializeSystem() {

try {

    await openVideoDatabase();


    videos =
        await getAllVideos();


    updateDashboard();


    updateVideoClientList();


    handleNavigation();


    console.log(
        "NovaTech Security Management System loaded."
    );

}

catch (error) {

    console.error(
        "System initialization error:",
        error
    );


    updateDashboard();


    handleNavigation();

}

}

/* START SYSTEM */

initializeSystem();