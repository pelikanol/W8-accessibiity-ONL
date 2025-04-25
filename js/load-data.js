// Load data
d3.csv("./data/screen_timev3.csv", d => {
  return {
    age: +d.age, // Convert Age to a number
    gender: d.gender.toLowerCase().replace(/\s+/g, "_").replace(/\//g, "_"),
    screen_time_type: d.screen_time_type,
    day_type: d.day_type,
    average_screen_time: +d.average_screen_time, // Convert to a number
    sample_Size: +d.sample_size // Convert to a number
  };
}).then(data => {
  console.log("Processed Data:", data);
  console.log("Loaded Data:", data.map(d => d.gender));

  drawHistogram(data);
  populateFilters(data);
  createTooltip();
  handleMouseEvents();



});