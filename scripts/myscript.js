// add your JavaScript/D3 to this file
// myscript.js
document.addEventListener('DOMContentLoaded', function() {

  const data = [
  { year: 2012, gender: 'female', percent_none: 0.003253381 },
  { year: 2012, gender: 'male', percent_none: 0.003517549 },
  { year: 2013, gender: 'female', percent_none: 0.003703471 },
  { year: 2013, gender: 'male', percent_none: 0.004649745 },
  { year: 2014, gender: 'female', percent_none: 0.002540115 },
  { year: 2014, gender: 'male', percent_none: 0.004481960 },
  { year: 2015, gender: 'female', percent_none: 0.003342652 },
  { year: 2015, gender: 'male', percent_none: 0.002198608 },
  { year: 2016, gender: 'female', percent_none: 0.002765753 },
  { year: 2016, gender: 'male', percent_none: 0.002445164 },
  { year: 2017, gender: 'female', percent_none: 0.004580879 },
  { year: 2017, gender: 'male', percent_none: 0.003490526 },
  { year: 2018, gender: 'female', percent_none: 0.003859875 },
  { year: 2018, gender: 'male', percent_none: 0.001946743 },
  { year: 2019, gender: 'female', percent_none: 0.005167809 },
  { year: 2019, gender: 'male', percent_none: 0.003524777 },
  { year: 2020, gender: 'female', percent_none: 0.002976190 },
  { year: 2020, gender: 'male', percent_none: 0.001980333 },
  { year: 2021, gender: 'female', percent_none: 0.001820354 },
  { year: 2021, gender: 'male', percent_none: 0.002769522 }
  ];

  // Set the dimensions of the canvas / graph
  const margin = {top: 20, right: 20, bottom: 70, left: 40},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  // Set the ranges
  const x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
  const x1 = d3.scaleBand().padding(0.05);
  const y = d3.scaleLinear().range([height, 0]);
  const color = d3.scaleOrdinal().range(["pink", "blue"]);

  // Append the svg object to the div with id 'plot'
  const svg = d3.select("#plot").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Format the data
  const years = [...new Set(data.map(d => d.year))];
  const genderCategories = ['female', 'male'];
  x0.domain(years);
  x1.domain(genderCategories).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, d => d.percent_none)]);

  // Create the grouped bars
  const yearGroups = svg.selectAll(".yearGroup")
    .data(years)
    .enter().append("g")
      .attr("class", "yearGroup")
      .attr("transform", d => `translate(${x0(d)},0)`);

  yearGroups.selectAll("rect")
    .data(d => genderCategories.map(key => ({ key, value: data.find(dat => dat.year === d && dat.gender === key).percent_none })))
    .enter().append("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key));

  // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));

  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));

  // Add a legend
  const legend = svg.selectAll(".legend")
      .data(genderCategories.slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => d === 'female' ? 'Female' : 'Male');

  // Add Graph title
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 0 - (margin.top / 2))
    .attr("font-size", "13px") // Adjust font size as needed
    .attr("font-weight", "bold")
    .text("Percentage of People with No Education History by Year and Gender");

  // Add X axis title
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10) // Adjust the position based on your margin
    .attr("font-size", "12px") // Adjust font size as needed
    .text("Year");

  // Add Y axis title
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em") // To align the text properly
    .attr("font-size", "12px") // Adjust font size as needed
    .text("Percentage of People with No Education History");

// Set the x0 domain to include all years, which makes it static
  const allYears = [...new Set(data.map(d => d.year))];
  x0.domain(allYears);

  // Function to hide the bars of selected years for a specific gender
  function hideBarsOfSelectedYearsAndGender(selectedYears, selectedGender) {
    svg.selectAll(".yearGroup").selectAll("rect")
      .style("opacity", function(d) {
        const dataYear = d3.select(this.parentNode).datum();
        const dataGender = d.key;
        // If the year is selected and (gender matches or all genders are selected), hide the bar
        return selectedYears.includes(String(dataYear)) && (selectedGender === 'All' || dataGender === selectedGender) ? 0 : 1;
      });
  }

  // Event listener for the year selection change
  document.getElementById('yearSelect').addEventListener('change', function(e) {
    const selectedOptions = e.target.selectedOptions;
    const selectedYears = Array.from(selectedOptions).map(opt => opt.value);
    const selectedGender = document.getElementById('genderSelect').value;
    hideBarsOfSelectedYearsAndGender(selectedYears, selectedGender);
  });

  // Event listener for the gender selection change
  document.getElementById('genderSelect').addEventListener('change', function(e) {
    const selectedOptions = document.getElementById('yearSelect').selectedOptions;
    const selectedYears = Array.from(selectedOptions).map(opt => opt.value);
    const selectedGender = e.target.value;
    hideBarsOfSelectedYearsAndGender(selectedYears, selectedGender);
  });

  // Initial rendering of the chart with all data
  // Render all bars with full opacity
  svg.selectAll(".yearGroup").selectAll("rect").style("opacity", 1);
});




