const drawHistogram = (data) => {


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`)
      .attr("role", "img")
      .attr("aria-labelledby", "histogramTitle histogramDescription");

      svg
      .append("title")
        .attr("id", "histogramTitle")
        .text("Visualisation of tv screen time data for children in hours");

     /***************************/
  /*    Generate the bins    */
  /***************************/
  const bins = binGenerator(data); //save the bins into an array
 
  console.log(bins); // Log the bins to the console for debugging


  const generateDescription = (bins) => {

    const desc = [];
    
    // Add introductory text
    desc.push("This histogram visualizes the frequency of hours children spend watching TV.");
  
    // Add details for each bin
    bins.forEach((bin, index) => {
      const rangeStart = bin.x0; // Start of the bin range
      const rangeEnd = bin.x1;   // End of the bin range
      const count = bin.length;  // Number of children in this bin
  
      // Generate a description for the current bin
      const binDescription = `${rangeStart} to ${rangeEnd} hours: ${count} children.`;
      desc.push(binDescription);
    });
  
    // Return the description as a single string
    return desc.join(" ");
  };


      // svg
      // .append("desc")
      //   .attr("id", "scatterplotDescription")
      //   // .text("Most children spend between 1 to 2 hours a day watching TV. A bit over half that amount watch between 0 and 1 hour a day. The hours watched steady decreases up to 7 hours per day.");
      //   .text(generateDescription(bins));
 
      //   console.log(description);

        const description = generateDescription(bins);
          console.log(description);

        // Append the group that will contain the inner chart
innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  

 


   /****************************/
  /*    Declare the scales    */
  /****************************/
  // X scale

  const minTime = bins[0].x0; //lower bound of the first bin                
  const maxTime = bins[bins.length - 1].x1;  //upper bound of the last bin
  
  xScale         
    .domain([minTime, maxTime])               
    .range([0, innerWidth]);  
  
  const binsMaxLength = d3.max(bins, d => d.length);   // Get the maximum length of the bins
    
  yScale
      .domain([0, binsMaxLength])     
      .range([innerHeight, 0])        
      .nice();
 

  innerChart
  .selectAll("rect")                                        
  .data(bins)                                             
  .join("rect")                                           
    .attr("x", d => xScale(d.x0))                          
    .attr("y", d => yScale(d.length))                      
    .attr("width", d => xScale(d.x1) - xScale(d.x0))      
    .attr("height", d => innerHeight - yScale(d.length))  
    .attr("fill", slateGray)                               
    .attr("stroke", white)                                
    .attr("stroke-width", 2);                             

    // construct the x-axis
    const bottomAxis = d3.axisBottom(xScale);

    // Add the x-axis to the bottom of the chart relative to the inner chart         
    innerChart                                                
      .append("g")                                            
        .attr("transform", `translate(0, ${innerHeight})`)    
        .call(bottomAxis);                                    
    
  // Add the x-axis label
    svg                                                       
      .append("text")                                        
        .text("Average Screen Time (hours)")
        .attr("class", "axis-label axis-label-bottom")                            
        .attr("text-anchor", "end")                           
        .attr("x", width)                                     
        .attr("y", height - 5);      

  // construct the x-axis
    const leftAxis = d3.axisLeft(yScale);            

    // Add the y-axis to the left of the chart relative to the inner chart
    innerChart                     
      .append("g")                    
        .call(leftAxis); 

  // Add the y-axis label                                   
    svg                                                        
      .append("text")                                         
        .text("Frequency")
        .attr("class", "axis-label axis-label-left")                                    
        .attr("x", 5)                                      
        .attr("y", 20); 

resizeChart();

};
