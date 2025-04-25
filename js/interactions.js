
// ==========
  const populateFilters = (data) => {

    // Add role and aria-label to the container for screen readers
    d3.select("#filters_gender")
      .attr("role", "group") // Define the container as a group
      .attr("aria-label", "Filter by gender") // Provide a descriptive label for the group
      .selectAll(".filter")
      .data(filters_gender)
      .join("button")
        .attr("type", "button") // Explicitly set the button type
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .attr("aria-pressed", d => d.isActive) // Indicate the toggle state
        .text(d => d.label)
        .on("click", (e, d) => {
            console.log("DOM event", e);
            console.log("Attached datum", d);

            if (!d.isActive) {
                // Update the isActive state for all filters
                filters_gender.forEach(filter => {
                    filter.isActive = d.id === filter.id; // Set true only for the clicked filter
                });

                // Update the filter buttons' active class and aria-pressed attribute
                d3.selectAll("#filters_gender .filter")
                  .classed("active", filter => filter.isActive)
                  .attr("aria-pressed", filter => filter.isActive); // Update aria-pressed

                // Update the histogram
                updateHistogram(d.id, data);
            }
        });
  };
// ======
const updateHistogram = (filterId, data) => {

    const updatedData = filterId === "all"                          
        ? data                                                       
        : data.filter(respondent => respondent.gender === filterId); 

    const updatedBins = binGenerator(updatedData);                  

        d3.selectAll("#histogram rect")                                 
          .data(updatedBins)
          .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)                                  
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));  
};  


const createTooltip = () => {

  const tooltip = innerChart
      .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);

  tooltip                                       
  .append("rect")                             
      .attr("width", tooltipWidth)             
      .attr("height", tooltipHeight)          
      .attr("rx", 3)                            
      .attr("ry", 3)                            
      .attr("fill", aubergine)                 
      .attr("fill-opacity", 1);              

  tooltip                                       
  .append("text")                                                   
      .attr("x", tooltipWidth/2)                
      .attr("y", tooltipHeight/2 + 5)         
      .attr("text-anchor", "middle")            
      .attr("alignment-baseline", "middle")     
      .attr("fill", "white")                    
      .style("font-weight", 900);  
}

  const handleMouseEvents = () => {

    // Create a live region for screen reader announcements if it doesn't exist
    if (!document.getElementById("tooltip-announcer")) {
      const announcer = document.createElement("div");
        announcer.id = "tooltip-announcer";
        announcer.setAttribute("aria-live", "polite");
        announcer.className = "sr-only"; // Style this with CSS to be visually hidden
        document.body.appendChild(announcer);
    }
    // Shared function to show tooltip (used by both mouse and keyboard events)
    const showTooltip = (e, d) => {
      // Update the tooltip text
      d3.select(".tooltip text")
        .text(`${d.x0} to ${d.x1} hours: ${d.length} children`);
      
      // Position the tooltip
      const rect = e.target;
      const rectX = parseFloat(rect.getAttribute("x"));
      const rectY = parseFloat(rect.getAttribute("y"));
      
      d3.select(".tooltip")
        .attr("transform", `translate(${rectX}, ${rectY})`)
        .transition()
          .duration(200)
          .style("opacity", 1);
      
      // Announce to screen readers
      document.getElementById("tooltip-announcer").textContent = 
        `${d.x0} to ${d.x1} hours: ${d.length} children`;
    };
  
    // Shared function to hide tooltip
    const hideTooltip = () => {
      d3.select(".tooltip")
        .transition()
          .duration(200)
          .style("opacity", 0);
    };
  
    // Select all data-bound rectangles
    innerChart.selectAll("rect")
      .filter(function(d) { return d !== undefined; })
      .attr("tabindex", 0)
      .attr("aria-label", d => `Bar representing ${d.x0} to ${d.x1} hours with ${d.length} children`)

      // Mouse events
      .on("mouseenter", showTooltip)
      .on("mouseleave", hideTooltip)

      // Keyboard events (for accessibility)
      .on("focus", showTooltip)  // Show tooltip when focused with Tab key
      .on("blur", hideTooltip)   // Hide tooltip when focus moves away

      // Add keyboard navigation between bars
      .on("keydown", (e, d) => {
        // Navigate between bars with arrow keys
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          const nextBar = e.target.nextElementSibling;
          if (nextBar && nextBar.tagName.toLowerCase() === "rect") {
            nextBar.focus();
          }
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          const prevBar = e.target.previousElementSibling;
          if (prevBar && prevBar.tagName.toLowerCase() === "rect") {
            prevBar.focus();
          }
        }
      });
  }

 