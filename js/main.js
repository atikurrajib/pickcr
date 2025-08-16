
document.getElementById("idForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const studentId = document.getElementById("studentId").value.trim();
  if (!studentId) {
    alert("Please enter your Student ID.");
    return;
  }

  
  const API_BASE = "https://script.google.com/macros/s/AKfycbwPJobti3k26TWLGN1UIcn65LPzWNx0G7zFXae-UafZihyeA4Hi_0ojwH9OyvNiUfaH/exec";

  try {

    const res = await fetch(`${API_BASE}?action=checkEligibility&studentId=${encodeURIComponent(studentId)}`);
    const data = await res.json();

    if (data.status === "eligible") {
      localStorage.setItem("studentId", studentId);
      sessionStorage.removeItem("voted");
      window.location.href = "vote.html";
    } else if (data.status === "already_voted") {
      alert("You have already voted.");
   
    } else if (data.status === "time_over") {
      alert("Voting time has ended. You can only view results now.");
      window.location.href = "result.html";
    } else {
      alert("Student ID not found or not eligible.");
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
});
