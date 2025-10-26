const darkToggle = document.getElementById("darkToggle");
darkToggle.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = dark ? "light" : "dark";
  localStorage.setItem("theme", dark ? "light" : "dark");
});
if (localStorage.getItem("theme") === "dark")
  document.documentElement.dataset.theme = "dark";

// Emergency modal
const emergencyBtn = document.getElementById("emergencyBtn");
const modal = document.getElementById("helplineModal");
const closeModal = document.getElementById("closeModal");

emergencyBtn.addEventListener("click", () => modal.classList.add("show"));
closeModal.addEventListener("click", () => modal.classList.remove("show"));

// Share location
document.getElementById("shareLocation").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://maps.google.com?q=${pos.coords.latitude},${pos.coords.longitude}`;
        window.open(url, "_blank");
      },
      () => alert("Location permission denied.")
    );
  } else {
    alert("Geolocation not supported.");
  }
});

// Contact form local save
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm));
  let msgs = JSON.parse(localStorage.getItem("messages") || "[]");
  msgs.push({ ...data, date: new Date().toISOString() });
  localStorage.setItem("messages", JSON.stringify(msgs));
  formStatus.textContent = "✅ Message saved locally (demo mode).";
  contactForm.reset();
});
// Open helpline modal when clicking the Emergency Alert card
document.getElementById("openHelpline").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("helplineModal").classList.add("show");
});
// Emergency Alert card -> open helpline modal
document.addEventListener("DOMContentLoaded", () => {
  const openHelpline = document.getElementById("openHelpline");
  const modal = document.getElementById("helplineModal");
  const closeModal = document.getElementById("closeModal");

  if (openHelpline && modal && closeModal) {
    openHelpline.addEventListener("click", () => {
      modal.classList.add("show");
    });

    closeModal.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }
});
// 📍 Share location button (front page)
document.addEventListener("DOMContentLoaded", () => {
  const shareBtn = document.getElementById("shareLocation");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
            window.open(mapUrl, "_blank");
          },
          (err) => {
            alert("⚠️ Please allow location permission to share your location.");
          }
        );
      } else {
        alert("❌ Geolocation is not supported by your browser.");
      }
    });
  }
});

// My Emergency Contacts
const contactFormList = document.getElementById("contactListForm");
const savedContactsDiv = document.getElementById("savedContacts");

function loadContacts() {
  const contacts = JSON.parse(localStorage.getItem("myContacts") || "[]");
  savedContactsDiv.innerHTML = "";
  contacts.forEach((c, index) => {
    const card = document.createElement("div");
    card.className = "contact-card";
    card.innerHTML = `
      <h3>${c.name}</h3>
      <p>${c.number}</p>
      <a href="tel:${c.number}">Call</a>
      <button onclick="removeContact(${index})" style="margin-top:10px; padding:5px 10px; border:none; border-radius:5px; background:#333; color:#fff; cursor:pointer;">Delete</button>
    `;
    savedContactsDiv.appendChild(card);
  });
}

function removeContact(index) {
  const contacts = JSON.parse(localStorage.getItem("myContacts") || "[]");
  contacts.splice(index, 1);
  localStorage.setItem("myContacts", JSON.stringify(contacts));
  loadContacts();
}

contactFormList.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const number = document.getElementById("contactNumber").value.trim();
  if (!name || !number) return;

  const contacts = JSON.parse(localStorage.getItem("myContacts") || "[]");
  contacts.push({ name, number });
  localStorage.setItem("myContacts", JSON.stringify(contacts));

  document.getElementById("contactName").value = "";
  document.getElementById("contactNumber").value = "";
  loadContacts();
});

// Load contacts on page load
document.addEventListener("DOMContentLoaded", loadContacts);

