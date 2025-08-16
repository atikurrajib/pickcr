
document.addEventListener("DOMContentLoaded", async () => {
  const studentId = localStorage.getItem("studentId");
  const container = document.getElementById("candidates-container");
  const submitBtn = document.getElementById("submitVoteBtn");

  if (!studentID) {
    alert("Unauthorized access! Please login first.");
    window.location.href = "index.html";
    return;
  }

  const API_BASE = "https://script.google.com/macros/s/AKfycbwPJobti3k26TWLGN1UIcn65LPzWNx0G7zFXae-UafZihyeA4Hi_0ojwH9OyvNiUfaH/exec";


  try {
    const res = await fetch(`${API_BASE}?action=getCandidates`);
    const data = await res.json();

    if (!data.candidates || data.candidates.length === 0) {
      container.innerHTML = "<p>No candidates available.</p>";
      submitBtn.disabled = true;
      return;
    }

    data.candidates.forEach((c, idx) => {
      const div = document.createElement("div");
      div.classList.add("candidate");
      div.innerHTML = `
        <input type="radio" name="candidate" id="cand${idx}" value="${c.name}" />
        <label for="cand${idx}">
          ${c.image ? `<img src="assets/images/${c.image}" alt="${c.name}" />` : ""}
          ${c.name}
        </label>
      `;
      container.appendChild(div);
    });
  } catch (e) {
    console.error("Error loading candidates:", e);
    container.innerHTML = "<p>Failed to load candidates.</p>";
    submitBtn.disabled = true;
  }

  
  container.addEventListener("change", (e) => {
    if (e.target.name === "candidate") {
      submitBtn.disabled = false;
    }
  });


  submitBtn.addEventListener("click", async () => {
    const selected = document.querySelector('input[name="candidate"]:checked');
    if (!selected) {
      alert("Please select a candidate.");
      return;
    }

    const payload = {
      action: "submitVote",
      studentId,
      candidateName: selected.value
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.status === "success") {
        alert("✅ Your vote has been submitted successfully!");
        sessionStorage.setItem("voted", "true");
        window.location.href = "result.html";
      } else if (data.status === "already_voted") {
        alert("⚠️ You have already voted.");
        window.location.href = "result.html";
      } else if (data.status === "time_over") {
        alert("🕒 Voting has ended. Redirecting to results...");
        window.location.href = "result.html";
      } else {
        alert("❌ Failed to submit vote. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  });
});
