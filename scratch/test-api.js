async function testAPI() {
  try {
    const res = await fetch("http://localhost:3000/api/analytics/team-performance");
    const json = await res.json();
    console.log("API Response Status:", res.status);
    console.log("API Response Success:", json.success);
    if (json.data && json.data.performance) {
      console.log("Performance Count:", json.data.performance.length);
      console.log("First Member:", JSON.stringify(json.data.performance[0], null, 2));
    } else {
      console.log("No performance data in response");
    }
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

testAPI();
