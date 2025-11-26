const content = document.getElementById("content");
const reloadBtn = document.getElementById("reloadBtn");
const searchInput = document.getElementById("searchInput");

let allUsers = []; // store original data

async function fetchUsers() {
  content.innerHTML = renderSkeletons();

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const users = await response.json();
    allUsers = users; // store for searching

    content.innerHTML = renderUsers(users);

  } catch (error) {
    content.innerHTML = renderError(error.message);
  }
}

function renderSkeletons() {
  let skeletonHTML = `<div class="grid">`;
  for (let i = 0; i < 6; i++) {
    skeletonHTML += `
      <div class="card">
        <div class="skeleton" style="height: 22px; width: 70%;"></div>
        <div class="skeleton skeleton-line" style="width: 90%;"></div>
        <div class="skeleton skeleton-line" style="width: 80%;"></div>
        <div class="skeleton skeleton-line" style="width: 60%;"></div>
      </div>
    `;
  }
  skeletonHTML += `</div>`;
  return skeletonHTML;
}

function renderUsers(users) {
  if (users.length === 0) {
    return `
      <p style="text-align:center; font-size:18px; margin-top:20px;">
        No matching users found.
      </p>
    `;
  }

  let html = `<div class="grid">`;

  users.forEach((user) => {
    html += `
      <div class="card">
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Address:</strong><br>
          ${user.address.street}, ${user.address.suite}<br>
          ${user.address.city} - ${user.address.zipcode}
        </p>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

function renderError(message) {
  return `
    <div class="error-box">
      <h2>Error Loading Users</h2>
      <p>${message}</p>
      <button class="reload-btn" onclick="fetchUsers()">Try Again</button>
    </div>
  `;
}

/* 🔍 Search Feature */
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();

  const filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.address.city.toLowerCase().includes(query)
  );

  content.innerHTML = renderUsers(filtered);
});

reloadBtn.addEventListener("click", fetchUsers);

fetchUsers();
