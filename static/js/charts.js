function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // create a variable for metadata
    var metadata = data.metadata
    // 4. Create a variable that filters the samples for the object with the desired sample number.
     var resultArrayc = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArraym = metadata.filter(person => person.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var resultc = resultArrayc[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var resultm = resultArraym[0];
    console.log(resultm)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids  = resultc.otu_ids;
    var otu_labels = resultc.otu_labels;
    var sample_values = resultc.sample_values;
    
    // 3. Create a variable that holds the washing frequency.
    //  var w_freg = resultArraym.map(person => person.wfreq)
    //  console.log(w_freg)
    var wash_freq = resultm.wfreq;
    freq = parseFloat(wash_freq);
    //console.log(freq)

    
   
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    //var yticks = (otu_ids.sort((a,b) => b-a)).slice(0,10) 
   yticks= otu_ids.slice(0,10).map( a => "OTU " + a)
   var labels_value = otu_labels.slice(0,10)
   //console.log(labels_value)
   var sample_data = (sample_values.sort((a,b) => b-a)).slice(0,10).reverse()
   //console.log(sample_data)
    //console.log(ytest)
    // 8. Create the trace for the bar chart. 
  //  var ytest = [
  //     "OTU 1167",
  //     "OTU 2859",
  //     "OTU 482",
  //     "OTU 2264",
  //     "OTU 41",
  //     "OTU 1189",
  //     "OTU 352",
  //     "OTU 189",
  //     "OTU 2318",
  //     "OTU 1977"
  // ]
  // console.log(ytest)
    var barData = [{
      x:sample_data,
      y:yticks,
      type:"bar",
      orientation:"h", 
      mode:"markers",
      text: labels_value
     }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<span style = 'color:blue'>Top 10 Bacteria Cultures Found </span>",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
   // bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x:otu_ids,
      y:sample_values,
      type:"bubble",
      text: otu_labels,
      mode:"markers",
      marker:{
        color: otu_ids,
        colorscale: 'Earth',
        size:sample_values
        
      }
      
   
      }    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<span style = 'color:blue'> Bacteria Cultures  Per Sample </span>", 
       xaxis:{
       title: "OTU_Id"
       },
      hovermode:'closest',
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100, 
        pad:4
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
    {
      domain: {x:[0,1], y:[0,1]},
      value: wash_freq,
      title: {
        text: "<span style = 'color: blue'>Belly Button Washing Frequency </span> <br> <span style = 'color: blue; font-size:16'> Scrubs Per Week </span>"
          
        
        }, 
      
      
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis:{range:[null,10]},
        bar: { color: "black" },
        steps:[
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color:"lime"},
          {range: [8,10], color:"green"}
        ]
      }
    }  
    ];
    var gaugeLayout = {
      width:600, height:500, margin:{t:0, b:0}
    }
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
