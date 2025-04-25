
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

  // console.log("handleMouseEvents called");
  // console.log("innerChart in handleMouseEvents:", innerChart); 

  // not keyboard accessible
  // const handleMouseEvents = () => {
      
  //     innerChart.selectAll("rect")
  //     .filter(function(d) { return d !== undefined; }) // because there are rectangles without data (ie tooltips)
      
  //           .on("mouseenter", (e, d) => {
  //             console.log(d);
  //             // Update the tooltip text with the bin's data
  //             d3.select(".tooltip text")
  //               .text(`${d.x0} to ${d.x1} hours: ${d.length} children`);
              
            
  //             // Get the rectangle's position and dimensions
  //             const rect = e.target;
  //             const rectX = parseFloat(rect.getAttribute("x")); // X position of the rectangle
  //             const rectY = parseFloat(rect.getAttribute("y")); // Y position of the rectangle

  //             // Calculate the center of the rectangle
  //             const tooltipX = rectX  // Center X of the rectangle
  //             const tooltipY = rectY  // Center Y of the rectangle
            
  //             // Position the tooltip in the middle of the rectangle
  //             d3.select(".tooltip")
  //               .attr("transform", `translate(${tooltipX}, ${tooltipY})`)
  //               .transition()
  //                 .duration(200)
  //                 .style("opacity", 1); // Fade in the tooltip
  //           })
  //           .on("mouseleave", () => {
  //             // Hide the tooltip when the mouse leaves the rectangle
  //             d3.select(".tooltip")
  //               .transition()
  //                 .duration(200)
  //                 .style("opacity", 0); // Fade out the tooltip
  //           });
         
  // }

  // };
// ==========
// // Pre accessibility
// ==========
//   const populateFilters = (data) => {

//     d3.select("#filters_gender")                                        
//       .selectAll(".filter")                                          
//       .data(filters_gender)                                                
//       .join("button")                                              
//         .attr("class", d => `filter ${d.isActive ? 
//             "active" : ""}`)                                           
//         .text(d => d.label)
//         .on("click", (e, d) => {
//             console.log("DOM event", e);
//             console.log("Attached datum", d);

//             if (!d.isActive) {                                                   
//               // Update the isActive state for all filters
//               filters_gender.forEach(filter => {                                         
//                   filter.isActive = d.id === filter.id; // Set true only for the clicked filter
//               });    
          
//               // Update the filter buttons' active class
//               d3.selectAll("#filters_gender .filter")                                              
//                 .classed("active", filter => filter.isActive);  
          
//                 updateHistogram(d.id, data);                                        
            
//               }

//         });   


// *** github copilot list***
// Linear
// d3.easeLinear: A constant speed transition (no easing).
// Quad (Quadratic)
// d3.easeQuadIn: Accelerates quadratically.
// d3.easeQuadOut: Decelerates quadratically.
// d3.easeQuadInOut: Accelerates and then decelerates quadratically.
// Cubic
// d3.easeCubicIn: Accelerates cubically.
// d3.easeCubicOut: Decelerates cubically.
// d3.easeCubicInOut: Accelerates and then decelerates cubically.
// Sinusoidal
// d3.easeSinIn: Accelerates sinusoidally.
// d3.easeSinOut: Decelerates sinusoidally.
// d3.easeSinInOut: Accelerates and then decelerates sinusoidally.
// Exponential
// d3.easeExpIn: Accelerates exponentially.
// d3.easeExpOut: Decelerates exponentially.
// d3.easeExpInOut: Accelerates and then decelerates exponentially.
// Circle
// d3.easeCircleIn: Accelerates in a circular motion.
// d3.easeCircleOut: Decelerates in a circular motion.
// d3.easeCircleInOut: Accelerates and then decelerates in a circular motion.
// Bounce
// d3.easeBounceIn: Starts with a bounce effect.
// d3.easeBounceOut: Ends with a bounce effect.
// d3.easeBounceInOut: Bounces at both the start and end.
// Elastic
// d3.easeElasticIn: Starts with an elastic effect. 
// d3.easeElasticOut: Ends with an elastic effect.
// d3.easeElasticInOut: Elastic effect at both the start and end.
// Back
// d3.easeBackIn: Starts by slightly overshooting backward.
// d3.easeBackOut: Ends by slightly overshooting forward.
// d3.easeBackInOut: Overshoots both at the start and end.








//   const populateDaysFilters = (data) => {
//     d3.select("#filters_day")
//       .selectAll(".filter")
//       .data(filters_day)
//       .join("button")
//         .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
//         .text(d => d.label)
//         .on("click", (e, d) => {
//             console.log("Days filter clicked:", d);

//             if (!d.isActive) {
//                 // Update active state for days filters
//                 filters_day.forEach(filter => {
//                     filter.isActive = d.id === filter.id;
//                 });

//                 // Update the filter buttons
//                 d3.selectAll("#filters_day .filter")
//                   .classed("active", filter => filter.id === d.id);

//                 // Update the histogram
//                 updateDaysHistogram(data);
//             }
//         });
// };

// const updateDaysHistogram = (data) => {
//     const activeDaysFilter = filters_day.find(filter => filter.isActive);
//     const daysFilterId = activeDaysFilter ? activeDaysFilter.id : "all";

//     const updatedData = daysFilterId === "all"
//         ? data
//         : data.filter(respondent => respondent.day_type === daysFilterId);

//     const updatedBins = binGenerator(updatedData);

//     d3.selectAll("#histogram rect")
//       .data(updatedBins)
//       .attr("y", d => yScale(d.length))
//       .attr("height", d => innerHeight - yScale(d.length));
// // };  if (!d.isActive) {                                                   
//                 // make sure button clicked is not already active
//                 filters_gender.forEach(filter => {                                         
//                   filter.isActive = d.id === filter.id ? true : false;                                                   
//                 });    

//                 // update the filter buttons based on which one was clicked
//                 d3.selectAll("#filter_gender .filter")                                              
//                   .classed("active", filter => filter.id === d.id ? true : false);                                          
            