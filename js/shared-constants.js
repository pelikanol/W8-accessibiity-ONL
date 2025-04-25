  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 50, right: 30, bottom: 60, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const aubergine = '#6F2C91';
  const tooltipWidth = 190;
  const tooltipHeight = 40;

  let innerChart;

/*****************************************/
/*  Make the bin Generator accessible globally  */
/*****************************************/
  const binGenerator = d3.bin() // Create a bin generator
    .value(d => d.average_screen_time);


/*****************************************/
/*  Make the scales accessible globally  */
/*****************************************/
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();
const fontSizeScale = d3.scaleLinear()
  .domain([315, 1000])
  .range([30, 15])
  .clamp(true);

/*****************************************/
/*  Make the colours accessible globally  */
/*****************************************/
const slateGray = "#305252";
const gray = "#606464";
const white = "#faffff";
const femaleColor = "#826C7F";
const maleColor = "#FA7E61";

/*****************************************/
/*  Make the filter options accessible globally  */
/*****************************************/
const filters_gender = [
    { id: "all", label: "All", isActive: true },
    { id: "female", label: "Female", isActive: false },
    { id: "male", label: "Male", isActive: false },
    { id: "other_prefer_not_to_say", label: "Other/Prefer Not to Say", isActive: false }
  ];

  const filters_day = [
    { id: "all", label: "All", isActive: true },
    { id: "weekday", label: "Weekday", isActive: false },
    { id: "weekend", label: "Weekend", isActive: false }
  ];