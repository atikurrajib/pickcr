
document.addEventListener("DOMContentLoaded", async () => {
 
  if (!sessionStorage.getItem("voted")) {
    alert("You cannot access the results page without voting.");
    window.location.href = "index.html";
    return;
  }

  const container = document.getElementById("results-container");
  const API_BASE = "https://script.google.com/macros/s/AKfycbwPJobti3k26TWLGN1UIcn65LPzWNx0G7zFXae-UafZihyeA4Hi_0ojwH9OyvNiUfaH/exec";

  async function loadResults() {
    try {
      const res = await fetch(`${API_BASE}?action=getResults`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        container.innerHTML = "<p>No results available yet.</p>";
        return;
      }

      container.innerHTML = "";
      data.results.forEach((row) => {
        const pct = Number(row.votePercentage || 0).toFixed(2);
        const item = document.createElement("div");
        item.classList.add("result-item");
        item.innerHTML = `
          <h3>${row.name}</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%;">${pct}%</div>
          </div>
        `;
        container.appendChild(item);
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = "<p>Failed to load results.</p>";
    }
  }

 
  await loadResults();

  
  setInterval(loadResults, 1000000);
});
