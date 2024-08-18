/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

import Graph from "graphology";
import Sigma from "sigma";
import random from 'graphology-layout/random';
import chroma, { distance } from "chroma-js";
import './test_desc'; //you must include this here
import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

function Get(yourUrl:string){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

window.onload = () => {
  // Get the mode select and data select elements
  const modeSelect = document.getElementById('mode-select') as HTMLSelectElement;
  const dataSelect = document.getElementById('data-select') as HTMLSelectElement;

  // Disable the mode select dropdown initially
  modeSelect.disabled = true;

  // Enable the mode select dropdown when an option is selected from the data select dropdown
  dataSelect.addEventListener('change', function() {
    if (this.value) {
      modeSelect.disabled = false;
    } else {
      modeSelect.disabled = true;
    }
  });
};

// Get the data select element, either CWE or CAPEC.
const dataSelect = document.getElementById('data-select') as HTMLSelectElement;

// Lines 42-49 - The following block of code is strictly for removing the inital Select data... option.
// Once a data set is selected, this option will never appear again.
// Add an event listener for the change event
dataSelect.addEventListener('change', () => {
  // Get the default option
  const defaultOption = dataSelect.querySelector('option[value=""]');

  // If a value is selected, remove the default option
  if (dataSelect.value && defaultOption) {
    defaultOption.remove();
  }
});

//retrieving single_node_container from html file
const single_node_container = document.getElementById("single-node-container") as HTMLElement;

// used to store the data from the file where we have the nodes stored
let parsed_data: any;

// used to store the descriptions from the file where the descriptions are stored
let node_descriptions_data: any;

// Declare the single_node_renderer variable with a type
let single_node_renderer: Sigma | null;

//Event listener to check to see the option selected. 
document.getElementById('data-select')?.addEventListener('change', (event) => {
  const selectedOption = (event.target as HTMLSelectElement).value; // saving the value of the selected option
  single_node_legend.style.display = "none"; //this will soon be removed

  // Reset the single-node-input input field
  (document.getElementById('single-node-input') as HTMLInputElement).value = '';

  // Lines 73-100 are all resets of the graphs and input fields.
  // This is just when the user switches data sets.
  // It does not make sense to keep the results when we switch data sets.
  single_node_graph_view.clear(); // Clear the graph
  if (single_node_renderer != null)
  {
    single_node_renderer.kill();
    single_node_renderer = null;
  }

  start_node_distance_graph.clear();
  if (start_node_distance_renderer != null)
  {
    start_node_distance_renderer.kill();
    start_node_distance_renderer = null;
  }

  // Reset the single-node-input input field
  (document.getElementById('start-node-input') as HTMLInputElement).value = '';
  (document.getElementById('distance-input') as HTMLInputElement).value = '';
  // Get the elements
  const pathDisplay = document.getElementById('path-display');
  const totalRiskDisplay = document.getElementById('total-risk-display');

  // Set their content to nothing
  if (pathDisplay) {
    pathDisplay.innerHTML = '';
  }
  if (totalRiskDisplay) {
    totalRiskDisplay.innerHTML = '';
  } 

  // This should never happen, just in case selectedOption is somehow empty, we stop.
  if (!selectedOption)
  {
    alert('Please choose a data set to work with!');
    return;
  }

  // This first fetch retrieves the data, from different.json.
  // Basically, we fetch the data, but to do that we need to send the SelectedOption value over.
  // Once the server has that, it send the data set we want back.
  // We then print the data to the console, to check.
  // Finally, we save the data into parsed_data.
  //http://127.0.0.1:5000/different.json -- for local hosting
  //http://jwilson9567.pythonanywhere.com -- this is for online hosting
  fetch('https://jwilson9567.pythonanywhere.com/different.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data_type=${selectedOption}`,
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // 'data' is now a JavaScript object that you can work with
    parsed_data = data;

    // Reading and adding the nodes into the single_node_graph_view
    for (const node of Object.keys(parsed_data)) {
      //console.log("node:", node)
      single_node_graph_view.addNode(node, { label: node } );
    }
  });

  // This fetch will retreive all description for the nodes, either for CAPEC or CWE.
  // Similar to the last fetch, we retrieve this from all_node_description_data.
  // To do this, once again the selectedOption value must first be sent over.
  // In return, we get the dataset with the descriptions of the all the nodes.
  // We then print it to the console, and save it into node_descriptions_data.
  //http://127.0.0.1:5000/all_node_description_data.json -- for local hosting
  //http://jwilson9567.pythonanywhere.com -- this is for online hosting
  fetch('https://jwilson9567.pythonanywhere.com/all_node_description_data.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data_type=${selectedOption}`,
  })
  .then(response => response.json())
  .then(data => {
    //These are prints to check we are retrieving the data properly. 
    console.log("Printing descriptions for all nodes: ")
    console.log(data);
    node_descriptions_data = data;
  })
});

//EVERYTHING UP TO THIS POINT IS PROPERLY DOCUMENTED

//const single_node_container = document.getElementById("single-node-container") as HTMLElement;
//const temp_c = document.getElementById("temp") as HTMLElement;

//const raw_data = Get("http://127.0.0.1:5000/data.json"); // this stores raw data, still needs to be converted
//const parsed_data = JSON.parse(raw_data); // this converts the data to JSON object format

//console.log(parsed_data);

const single_node_graph_view = new Graph();


//graph.addNode("John", { x: 0, y: 10, size: 5, label: "John", color: "blue" });
//graph.addNode("Mary", { x: 10, y: 0, size: 3, label: "Mary", color: "red" });

//graph.addEdge("John", "Mary");

/*for (const node of Object.keys(parsed_data)) {
    single_node_graph_view.addNode(node, { label: node } );
}*/

/*for (const node of Object.keys(parsed_data)) //for reading edges later on into the graph
{
    for (const edge of Object.keys(parsed_data[node]))
    {
        const weight = parsed_data[node][edge];
        graph.addEdge(node, edge, { weight });
    }
}*/

// Print node data DO NOT DELETE THESE TWO BLOCKS
/*single_node_graph_view.forEachNode((nodeId, attributes) => {
  console.log(`Node ${nodeId}:`, attributes);
});
  
// Print edge data
single_node_graph_view.forEachEdge((edgeId, attributes, source, target) => {
  console.log(`Edge ${edgeId} from ${source} to ${target}:`, attributes);
});*/


  //const positions = random(graph);
  //random.assign(graph_distance_view); //assigns random positions directly to the graph

// eslint-disable-next-line @typescript-eslint/no-unused-vars
//const renderer = new Sigma(graph_distance_view, distance_container);

const modeSelect = document.querySelector("#mode-select") as HTMLSelectElement; //this can either be null as well

const single_node_section = document.getElementById("single-node-section") as HTMLInputElement;

const start_node_distance_section = document.getElementById("start-node-distance-section") as HTMLInputElement;

const better_traversal = document.getElementById("better-traversal-section") as HTMLInputElement;

const updated_traversal = document.getElementById("updated-traversal-section") as HTMLInputElement;

const bottom_top_section = document.getElementById("top-bottom-section") as HTMLInputElement;

if (modeSelect) {
  modeSelect.addEventListener("change", () => {
    const mode = modeSelect.value;

    single_node_section.style.display = "none";
    start_node_distance_section.style.display = "none";
    better_traversal.style.display = "none";
    updated_traversal.style.display = "none";
    bottom_top_section.style.display = "none";

    if (mode === "single-node")
    {
      single_node_section.style.display = "block";
    }
    else if (mode === "start-node-distance")
    {
      start_node_distance_section.style.display = "block";
    }
    else if (mode === "better-traversal-visual")
    {
      better_traversal.style.display = "block";
    }
    else if (mode === "updated-traversal-visual")
    {
      updated_traversal.style.display = "block";
    }
    else if (mode === "top-bottom-traversal-visual")
    {
      bottom_top_section.style.display = "block";
    }
});
}
    

// Declare the single_node_renderer variable with a type
//let single_node_renderer: Sigma | null;
  
console.log("ok");

const single_node_input = document.querySelector("#single-node-input") as HTMLInputElement;

const single_node_legend = document.querySelector("#legend") as HTMLDivElement;


if (single_node_section) {
    // Listen for keydown events on the input element
    single_node_section.addEventListener("keydown", (event) => {
      // Check if the Enter key was pressed
      if (event.key === "Enter") {
        //single_node_legend.style.display = "block";
        // Get the value entered by the user
        const nodeLabel = single_node_input.value; //change this still
  
      // Find a node with a matching label
      const selectedNode = single_node_graph_view
        .nodes()
        .find(
          (node) =>
            single_node_graph_view.getNodeAttribute(node, "label") === nodeLabel
        );
      if (selectedNode) {
        console.log("we found the node");

        // Call the resetGraph function to reset the graph
        resetGraph(single_node_graph_view);

        const containerWidth = single_node_container.offsetWidth;
        const containerHeight = single_node_container.offsetHeight;

        single_node_graph_view.setNodeAttribute(selectedNode, "x", -containerWidth / 2);
        single_node_graph_view.setNodeAttribute(selectedNode, "y", -containerHeight / 2);

        // Set its size and color
        single_node_graph_view.setNodeAttribute(selectedNode, "size", 10);
        single_node_graph_view.setNodeAttribute(selectedNode, "color", "black");
         // Call the updateColor function to start the rainbow fading effect
        //updateColor(graph_distance_view, selectedNode);
        

  // Get the relationship data for the selected node
  const relationships = parsed_data[selectedNode];

  // Calculate the minimum and maximum relationship values
  const minRelationship = Math.min(...(Object.values(relationships) as number[]));
  const maxRelationship = Math.max(...(Object.values(relationships) as number[]));

  const colorScale = chroma.scale("YlOrRd").domain([minRelationship, maxRelationship]);

  // Normalize the relationship values and use them to position the nodes
  let angle = -Math.PI / 2;
  const angleStep = Math.PI / (2 * Object.keys(relationships).length);
  for (const [node, relationship] of Object.entries(relationships)) {
    if (node !== selectedNode) {
      // Normalize the relationship value
      const normalizedRelationship =
        ((relationship as number) - minRelationship) /
        (maxRelationship - minRelationship);

      // Calculate the distance of the node from the selected node
      //const distance = (1 - normalizedRelationship) * (containerWidth / 4);
      const distance = Math.pow(1 - normalizedRelationship, 3) * (containerWidth / 4);

      // Set the position of the node
      single_node_graph_view.setNodeAttribute(
        node,
        "x",
        -containerWidth / 2 + distance * Math.cos(angle)
      );
      single_node_graph_view.setNodeAttribute(
        node,
        "y",
        -containerHeight / 2 + distance * Math.sin(angle)
      );

          // Set the color of the node based on its weight
    single_node_graph_view.setNodeAttribute(
      node,
      "color",
      colorScale(normalizedRelationship).hex()
    );

      // Increment the angle for the next node
      angle += angleStep;
    }
  }

   // Calculate the distance of the node from the selected node
//const distance = Math.pow(1 - normalizedRelationship, 2) * (containerWidth / 4);

console.log("Data set used: ", dataSelect.value);
        
        // Check if the third container element was found
        if (!single_node_container) {
            console.error(
              "Error: Could not find second container element on the page"
            );
          } else {
            console.log("good");
            // Check if a second Sigma instance already exists
            if (single_node_renderer) {
                console.log("perfect!!!!");
              // Remove the existing Sigma instance
              single_node_renderer.kill();
              single_node_renderer = null;
            }

            // Create a new Sigma instance and render the graph in the third container
            single_node_renderer = new Sigma(single_node_graph_view, single_node_container);

            // Assuming single_node_renderer is initialized somewhere...
            if (single_node_renderer) {
              (single_node_renderer).on('clickNode', function(e: any) {
                // Get the clicked node's id
                var nodeId = e.node;
                console.log("Clicked on node with ID:", nodeId);
                eventEmitter.emit('nodeClicked', nodeId);
              });
            }

        }

      } else {
        console.log("we did not find the node!");
      }
    }
    });
    }

    function resetGraph(graph: Graph) {
      graph.forEachNode((node) => {
        graph.setNodeAttribute(node, "x", 0);
        graph.setNodeAttribute(node, "y", 0);
        graph.setNodeAttribute(node, "size", 3);
        graph.setNodeAttribute(node, "color", "#666");
      });
    }
    
    function clearGraph(graph: Graph) {
      graph.clear();
    }
    

    

    // Define an array of colors for the rainbow effect
/*const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let colorIndex = 0;

// Define a function to update the color of the selected node
function updateColor(graph: Graph, selectedNode: string) {
  // Set the color attribute of the selected node to the next color in the array
  graph.setNodeAttribute(selectedNode, "color", colors[colorIndex]);

  // Increment the color index
  colorIndex = (colorIndex + 1) % colors.length;

  // Set a delay before calling the updateColor function again
  setTimeout(() => updateColor(graph, selectedNode), 1000); // 1000ms = 1s delay
}*/

const start_node_input = document.getElementById("start-node-input") as HTMLInputElement;
const distance_input = document.getElementById("distance-input") as HTMLInputElement;

/*if (start_node_input && distance_input) { //This is the function that is still not formatted and needs to be worked on.
  distance_input.addEventListener("keydown", (event) => {
    // Check if the Enter key was pressed
    if (event.key === "Enter") {
        console.log("we are in");

      //REMEMBER TO DO CHECKS FOR BOTH DISTANCE AND NODE ENTERED IF THEY ARE INVALID.

      const start_node = start_node_input.value;
      const start_distance = Number(distance_input.value);

      // Send the data to the Flask server
      fetch('http://127.0.0.1:5000/calc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ start_node, start_distance })
      })
        .then((response) => response.json())
        .then((data) => {
           // Update the page content with the data received from the server
           console.log(data);

           path = data.path;
           edge_weights = data.edge_weights;
           total_risk = data.distance;
        });

      console.log(start_node, start_distance);
    }
  });
}*/

//this function will wait using async, until the server recieves a response. Once it does, we read the data into path 
//edge_weights, and total_risk. This function can be altered so that distances and other items can be taken into it.
let path: string[];
let edge_weights: string[];
let total_risk: string[];

/*async function fetchData() {
  const start_node = start_node_input.value;
  const start_distance = Number(distance_input.value);

  //http://127.0.0.1:5000/calc -- for local hosting
  //https://jwilson9567.pythonanywhere.com/calc -- this is for online hosting
  const response = await fetch('https://jwilson9567.pythonanywhere.com/calc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ start_node, start_distance })
  });

  const data = await response.json();

  path = data.path;
  edge_weights = data.edge_weights;
  total_risk = data.distance;

  console.log("path:", path);
  console.log("edge_weights:", edge_weights);
  console.log("total_risk:", total_risk)
}*/

export async function fetch_neighbor_traversal() {
  const start_node = start_node_input.value;
  const start_distance = Number(distance_input.value);
  const dataSet = document.getElementById('data-select') as HTMLSelectElement;
  const data_type = dataSet.value;

  try {
    const response = await fetch('https://jwilson9567.pythonanywhere.com/calc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ start_node, start_distance, data_type })
    });
    const data = await response.json();
    return {
      path: data.path,
      edge_weights: data.edge_weights,
      total_risk: data.distance
    };
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

const start_node_distance_graph = new Graph();
let start_node_distance_renderer: Sigma | null;
const start_node_distance_container = document.getElementById("start-node-distance-container") as HTMLElement;

if (start_node_input && distance_input) {
  distance_input.addEventListener("keydown", async (event) => { //make the event listener async
    if (event.key === "Enter") {
      const data = await fetch_neighbor_traversal();
      if (data !== null) {
        console.log("we read the data: ", data.path);
        let graphWidth = 10; // Adjust this value to suit your needs

        // Clear the distance graph before adding nodes
        start_node_distance_graph.clear();

        for (let i = 0; i < data.path.length; i++)
        {
          let x = (graphWidth / (data.path.length - 1)) * i;
          let y = Math.random() * 4 + 5; // Add randomness to the height

          // If its the first first node, make it bigger and a different color
          if (i === 0)
          {
            start_node_distance_graph.addNode(data.path[i], { 
            x: x, 
            y: y, 
            size: 6, 
            label: data.path[i], 
            color: "red" 
          });
          } else 
          {
            start_node_distance_graph.addNode(data.path[i], { 
              x: x, 
              y: y, 
              size: 6, 
              label: data.path[i], 
              color: "blue" 
            });
          }
        }

        console.log("we made it past the node read!");

        // Add edges to the graph
        for (let i = 0; i < data.path.length - 1; i++) {
          let weight = parseFloat(data.edge_weights[i]);
          start_node_distance_graph.addEdge(data.path[i], data.path[i + 1], {
            id: 'e' + i,
            source: data.path[i],
            target: data.path[i + 1],
            label: 'Edge' + i,
            size: weight * 2,
            color: '#000'
          });
        }

        console.log("Edges added to the graph!");

        // Assuming path and total_risk are defined
        /*let path_display = document.getElementById('path-display');
        let total_risk_display = document.getElementById('total-risk-display');

        if (path_display)
        {
          path_display.textContent = 'Path: ' + data.path.join(' -> ');
          console.log(path_display.textContent); // Add this line  
        }

        if (total_risk_display)
        {
          total_risk_display.textContent = 'Total Risk: ' + data.total_risk;
          console.log(total_risk_display.textContent); // And this line
        }*/

        // Check if the third container element was found
        if (!start_node_distance_container) {
          console.error(
          "Error: Could not find second container element on the page"
        );
        } else {
          console.log("good");
          // Check if a second Sigma instance already exists
          if (start_node_distance_renderer) {
            console.log("perfect!!!!");
            // Remove the existing Sigma instance
            start_node_distance_renderer.kill();
            start_node_distance_renderer = null;
        }

        // Create a new Sigma instance and render the graph in the third container
        start_node_distance_renderer = new Sigma(start_node_distance_graph, start_node_distance_container);

        // Assuming single_node_renderer is initialized somewhere...
        if (start_node_distance_renderer) {
          (start_node_distance_renderer).on('clickNode', function(e: any) {
            // Get the clicked node's id
            var nodeId = e.node;
            console.log("Clicked on node with ID:", nodeId);
            eventEmitter.emit('nodeClicked', nodeId);
          });
        }
      }
      }
    }
  });
}


const better_traversal_input = document.getElementById("better-traversal-input") as HTMLInputElement;
const better_distance_input = document.getElementById("better-distance-input") as HTMLInputElement;

const better_distance_graph = new Graph();
let better_distance_renderer: Sigma | null;
const better_distance_container = document.getElementById("better-traversal-container") as HTMLElement;

//Event listener to check to see the option selected. 
document.getElementById('data-select')?.addEventListener('change', (event) => {
  const selectedOption = (event.target as HTMLSelectElement).value; // saving the value of the selected option

  // Reset the input fields
  better_traversal_input.value = '';
  better_distance_input.value = '';

  // Clear the graph
  better_distance_graph.clear();

  // Kill the renderer if it exists
  if (better_distance_renderer != null)
  {
    better_distance_renderer.kill();
    better_distance_renderer = null;
  }

  //http://127.0.0.1:5000/different.json -- for local hosting
  //http://jwilson9567.pythonanywhere.com -- this is for online hosting
  //this needs to be fixed to work with both CAPEC and CWE datasets still
  //TODO the previous graph is not being killed properly
  fetch('https://jwilson9567.pythonanywhere.com/different.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data_type=${selectedOption}`,
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // 'data' is now a JavaScript object that you can work with
    parsed_data = data;

    // Reading and adding the nodes into the single_node_graph_view
    for (const node of Object.keys(parsed_data)) {
      //console.log("node:", node)
      better_distance_graph.addNode(node, { label: node } );
    }
  });
});

// This is the best traversal that shows meaningful nodes for now.
let relationships: { [key: string]: any };
let selectedNode: string | undefined = undefined;
let better_distance: string | null = null;

if (better_traversal_input && better_distance_input) {
  better_distance_input.addEventListener("keydown", async (event) => { //make the event listener async
    if (event.key === "Enter") {

      const nodeLabel = better_traversal_input.value; //change this still
      better_distance = better_distance_input.value;
  
      // Find a node with a matching label
      selectedNode = better_distance_graph
        .nodes()
        .find(
          (node) =>
            better_distance_graph.getNodeAttribute(node, "label") === nodeLabel
        );
      if (selectedNode) {
        console.log("we found the node");

        // Call the resetGraph function to reset the graph
        resetGraph(better_distance_graph);

        const containerWidth = better_distance_container.offsetWidth;
        const containerHeight = better_distance_container.offsetHeight;

        better_distance_graph.setNodeAttribute(selectedNode, "x", -containerWidth / 2);
        better_distance_graph.setNodeAttribute(selectedNode, "y", -containerHeight / 2);

        // Set its size and color
        better_distance_graph.setNodeAttribute(selectedNode, "size", 10);
        better_distance_graph.setNodeAttribute(selectedNode, "color", "black");
         // Call the updateColor function to start the rainbow fading effect
        //updateColor(graph_distance_view, selectedNode);

        // Get the relationship data for the selected node
        relationships = parsed_data[selectedNode];

        // Calculate the minimum and maximum relationship values
        const minRelationship = Math.min(...(Object.values(relationships) as number[]));
        const maxRelationship = Math.max(...(Object.values(relationships) as number[]));

        const colorScale = chroma.scale("YlOrRd").domain([minRelationship, maxRelationship]);

        // Normalize the relationship values and use them to position the nodes
        let angle = -Math.PI / 2;
        const angleStep = Math.PI / (2 * Object.keys(relationships).length);
        for (const [node, relationship] of Object.entries(relationships)) {
          if (node !== selectedNode) {
          // Normalize the relationship value
          const normalizedRelationship =
            ((relationship as number) - minRelationship) /
            (maxRelationship - minRelationship);

          // Calculate the distance of the node from the selected node
          //const distance = (1 - normalizedRelationship) * (containerWidth / 4);
          const distance = Math.pow(1 - normalizedRelationship, 3) * (containerWidth / 4);

          // Set the position of the node
          better_distance_graph.setNodeAttribute(
            node,
            "x",
            -containerWidth / 2 + distance * Math.cos(angle)
          );
          better_distance_graph.setNodeAttribute(
            node,
            "y",
            -containerHeight / 2 + distance * Math.sin(angle)
          );

          const relationshipDistance = relationships[node];

          // Set the color of the node based on its weight
          better_distance_graph.setNodeAttribute(
          node,
          "color",
          colorScale(normalizedRelationship).hex()
          );

          // Increment the angle for the next node
          angle += angleStep;
        }
      }

   // Calculate the distance of the node from the selected node
  //const distance = Math.pow(1 - normalizedRelationship, 2) * (containerWidth / 4);
  updateColors();
  console.log("Data set used: ", dataSelect.value);

      // Check if the third container element was found
      if (!better_distance_container) {
        console.error(
        "Error: Could not find second container element on the page"
      );
      } else {
        console.log("good");
        // Check if a second Sigma instance already exists
        if (better_distance_renderer) {
          console.log("perfect!!!!");
          // Remove the existing Sigma instance
          better_distance_renderer.kill();
          better_distance_renderer = null;
      }

      // Create a new Sigma instance and render the graph in the third container
      better_distance_renderer = new Sigma(better_distance_graph, better_distance_container);
    }
    }
  }
  });
}

function updateColors() {
  let redNodes = [];
  let greenNodes = [];
  if (relationships && selectedNode && better_distance !== null) {
    for (const [node, relationship] of Object.entries(relationships)) {
      if (node !== selectedNode) {
        const relationshipDistance = relationships[node];
        /*if (relationshipDistance <= better_distance) {
          better_distance_graph.setNodeAttribute(node, "color", "green");
          greenNodes.push({ node: node, distance: relationshipDistance });
        }*/
          if (relationshipDistance >= better_distance) {
          better_distance_graph.setNodeAttribute(node, "color", "green");
          if (better_distance_graph.getNodeAttribute(node, "color") === "green") {
            redNodes.push({ node: node, distance: relationshipDistance });
          }
        }
      }
    }
    // Sort the redNodes and greenNodes array in ascending order of distance
    /*redNodes.sort((a, b) => b.distance - a.distance);
    greenNodes.sort((a, b) => b.distance - a.distance);
    
    // Add edges between the red nodes and green nodes in order of their distance
    for (let i = 0; i < redNodes.length - 1; i++) {
      if (!better_distance_graph.hasEdge(redNodes[i].node, redNodes[i + 1].node)) {
        let edgeId = better_distance_graph.addEdge(redNodes[i].node, redNodes[i + 1].node);
        //better_distance_graph.setEdgeAttribute(edgeId, 'color', 'red');
      }
    }
    for (let i = 0; i < greenNodes.length - 1; i++) {
      if (!better_distance_graph.hasEdge(greenNodes[i].node, greenNodes[i + 1].node)) {
        let edgeId = better_distance_graph.addEdge(greenNodes[i].node, greenNodes[i + 1].node);
        //better_distance_graph.setEdgeAttribute(edgeId, 'color', 'green');
      }
    }
    
    // Connect selectedNode to the first node in redNodes
    if (redNodes.length > 0 && !better_distance_graph.hasEdge(selectedNode, redNodes[0].node)) {
      better_distance_graph.addEdge(selectedNode, redNodes[0].node);
    }
    // Connect last red node to the first green node
    if (redNodes.length > 0 && greenNodes.length > 0 && !better_distance_graph.hasEdge(redNodes[redNodes.length - 1].node, greenNodes[0].node)) {
      better_distance_graph.addEdge(redNodes[redNodes.length - 1].node, greenNodes[0].node);
    }*/
  }
  
  console.log("done with this iteration!!!!!");
}



// This does not work properly, supposed to be a tree, probably gonna have to throw it away.
/*let relationships: { [key: string]: any };
let selectedNode: string | undefined = undefined;
let better_distance: string | null = null;

if (better_traversal_input && better_distance_input) {
  better_distance_input.addEventListener("keydown", async (event) => { //make the event listener async
    if (event.key === "Enter") {

      const nodeLabel = better_traversal_input.value; //change this still
      better_distance = better_distance_input.value;
  
      // Find a node with a matching label
      selectedNode = better_distance_graph
        .nodes()
        .find(
          (node) =>
            better_distance_graph.getNodeAttribute(node, "label") === nodeLabel
        );
      if (selectedNode) {
        console.log("we found the node");

        // Call the resetGraph function to reset the graph
        resetGraph(better_distance_graph);

        const containerWidth = better_distance_container.offsetWidth;
        const containerHeight = better_distance_container.offsetHeight;

        // Set the position of the selected node to the middle left of the graph
        better_distance_graph.setNodeAttribute(selectedNode, "x", -containerWidth / 2);
        better_distance_graph.setNodeAttribute(selectedNode, "y", 0);

        // Set its size and color
        better_distance_graph.setNodeAttribute(selectedNode, "size", 10);
        better_distance_graph.setNodeAttribute(selectedNode, "color", "black");
         // Call the updateColor function to start the rainbow fading effect
        //updateColor(graph_distance_view, selectedNode);

        // Get the relationship data for the selected node
        relationships = parsed_data[selectedNode];

        // Calculate the minimum and maximum relationship values
        const minRelationship = Math.min(...(Object.values(relationships) as number[]));
        const maxRelationship = Math.max(...(Object.values(relationships) as number[]));

        //const colorScale = chroma.scale("YlOrRd").domain([minRelationship, maxRelationship]);
        let level = 0;
        let position = 0;
        let maxLevelSize = 1;
        
        // Sort the nodes (excluding the root) to ensure consistent ordering
        const sortedNodes = better_distance_graph.nodes().filter(node => node !== selectedNode).sort();
        
        for (const node of sortedNodes) {
          // Set the position of the node
          const x = level * containerWidth / (sortedNodes.length - 1);
          const y = -containerHeight / 2 + ((containerHeight + 500) / maxLevelSize) * (position * 2); // Adjusted for more space between nodes
          better_distance_graph.setNodeAttribute(node, "x", x);
          better_distance_graph.setNodeAttribute(node, "y", y);
        
          // Increment position and check if we need to go to the next level
          position++;
          if (position >= maxLevelSize) {
            position = 0;
            level++;
            maxLevelSize *= 2; // Each level of a binary tree is twice as large as the previous one
          }
        }
        
        


   // Calculate the distance of the node from the selected node
  //const distance = Math.pow(1 - normalizedRelationship, 2) * (containerWidth / 4);
  console.log("Data set used: ", dataSelect.value);

      // Check if the third container element was found
      if (!better_distance_container) {
        console.error(
        "Error: Could not find second container element on the page"
      );
      } else {
        console.log("good");
        // Check if a second Sigma instance already exists
        if (better_distance_renderer) {
          console.log("perfect!!!!");
          // Remove the existing Sigma instance
          better_distance_renderer.kill();
          better_distance_renderer = null;
      }

      // Create a new Sigma instance and render the graph in the third container
      better_distance_renderer = new Sigma(better_distance_graph, better_distance_container);
    }
    }
  }
  });
}


// this is not necessary right now.
async function better_fetchData() {
  const start_node = better_traversal_input.value;
  const start_distance = Number(better_distance_input.value);

  const response = await fetch('http://127.0.0.1:5000/newcalc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ start_node, start_distance })
  });

  const data = await response.json();

  //path = data.path;
  //edge_weights = data.edge_weights;
  //total_risk = data.distance;

  //console.log("path:", path);
  //console.log("edge_weights:", edge_weights);
  //console.log("total_risk:", total_risk)

  console.log("data")
}*/

// THE START OF THE UPDATED VISUALIZATION
// THIS IS THE ONLY SECTION NEEDING TO BE TOUCHED RIGHT NOW!!!!

import { drawHover, drawLabel } from "./canvas-utils";
import type { Settings } from './settings';
import drawEdgeLabel from "sigma/rendering/canvas/edge-label";

const updated_traversal_input = document.getElementById("updated-traversal-input") as HTMLInputElement;
const updated_distance_input = document.getElementById("updated-distance-input") as HTMLInputElement;

const updated_distance_graph = new Graph();
let updated_distance_renderer: Sigma | null;
const updated_distance_container = document.getElementById("updated-traversal-container") as HTMLElement;

let selectedOption: string | undefined = undefined;

//Event listener to check to see the option selected. 
document.getElementById('data-select')?.addEventListener('change', (event) => {
  selectedOption = (event.target as HTMLSelectElement).value; // saving the value of the selected option

  // Reset the input fields
  updated_traversal_input.value = '';
  updated_distance_input.value = '';

  // Clear the graph
  updated_distance_graph.clear();

  // Kill the renderer if it exists
  if (updated_distance_renderer != null)
  {
    updated_distance_renderer.kill();
    updated_distance_renderer = null;
  }

});

// This is the best traversal that shows meaningful nodes for now.
let u_relationships: { [key: string]: any }; //
let u_selectedNode: string | undefined = undefined; //
let updated_distance: string | null = null;

if (updated_traversal_input && updated_distance_input) {
  updated_distance_input.addEventListener("keydown", async (event) => { //make the event listener async
    if (event.key === "Enter") {

      // Clear the graph
      updated_distance_graph.clear();

      // Kill the renderer if it exists
      if (updated_distance_renderer != null)
      {
        updated_distance_renderer.kill();
      }

      let distanceValue = parseFloat(updated_distance_input.value);

      if (isNaN(distanceValue)) {
          console.error("Invalid distance value");
          return;
      }

      let startNode = updated_traversal_input.value; // Get the start node value from the input field

      console.log(selectedOption);

      //http://127.0.0.1:5000/different.json -- for local hosting
      //http://jwilson9567.pythonanywhere.com -- this is for online hosting
      //this needs to be fixed to work with both CAPEC and CWE datasets still
      //TODO the previous graph is not being killed properly
      let response = await fetch('https://jwilson9567.pythonanywhere.com/filtered.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data_type=${selectedOption}&distance=${distanceValue}&start_node=${startNode}`,
      });

      if (!response.ok) 
      {
        console.error("Fetch request failed:", response.status, response.statusText);
        return;
      }

      let data = await response.json();
      console.log(data);
      // 'data' is now a JavaScript object that you can work with
      parsed_data = data;

      const clusterColors = {
        '7PK': '#1f77b4',  // Muted Blue
        'CERT': '#ff7f0e',  // Safety Orange
        'CISQ': '#2ca02c',  // Cooked Asparagus Green
        'Comprehensive Categorization': '#d62728',  // Brick Red
        'ICS': '#9467bd',  // Muted Purple
        'OWASP': '#8c564b',  // Chestnut Brown
        'SEI CERT': '#e377c2',  // Raspberry Yogurt Pink
        'SFP': '#bcbd22',  // Curry Yellow-Green
        'The CERT': '#17becf',  // Blue-Teal
        'Uncategorized': '#7f7f7f'  // Middle Gray
      };      

      // Reading and adding the nodes into the single_node_graph_view
      for (const node of Object.keys(parsed_data)) {
        console.log(`Node: ${node}`);
  
        if (parsed_data[node].clusters) {
          console.log(`Clusters: ${parsed_data[node].clusters}`);
        } else {
          console.log('Clusters: undefined');
        }

        // Get the color of the first cluster
        const firstCluster = parsed_data[node].clusters[0] as keyof typeof clusterColors;
        const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : '#000000';      
        
        
        updated_distance_graph.addNode(node, { 
          label: node,
          score: parsed_data[node].score,
          categories: parsed_data[node].categories, 
          clusters: parsed_data[node].clusters.join(', '),
          tag: parsed_data[node].categories.join(', '),
          x: Math.random(),  // Add an 'x' attribute
          y: Math.random()   // Add a 'y' attribute 
        });
        console.log("we did it.");
      }

      const testSettings: Settings = {
        labelSize: 14,
        labelFont: 'Arial',
        labelWeight: 'bold',
        hideEdgesOnMove: false, 
        hideLabelsOnMove: false,
        renderLabels: true,
        renderEdgeLabels: true,
        defaultNodeColor: '#000000',  
        defaultNodeType: 'circle',
        defaultEdgeColor: '#000000',
        defaultEdgeType: 'line',
        edgeLabelFont: 'Arial',
        edgeLabelSize: 12,
        edgeLabelWeight: 'Arial',
        stagePadding: 10,
        labelDensity: 1,  
        labelGridCellSize: 10, 
        labelRenderedSizeThreshold: 8,
        nodeReducer: null,
        edgeReducer: null,
        zIndex: true,
        labelRenderer: drawLabel,
        hoverRenderer: drawHover,
        edgeLabelRenderer: drawEdgeLabel,
        nodeProgramClasses: {},
        edgeProgramClasses: {},
        enableEdgeClickEvents: true,
        enableEdgeWheelEvents: true,
        enableEdgeHoverEvents: true,
        labelColor: {
          attribute: 'myAttribute',
          color: '#000000', // optional
        },
        edgeLabelColor: {
          attribute: 'myAttribute',
          color: '#000000', // optional
        },
        zoomToSizeRatioFunction: (ratio: number) => ratio, // example function that returns the input ratio
        itemSizesReference: 'screen', // use 'screen' or 'positions' as needed
        minCameraRatio: null, // set to a number if needed 
        maxCameraRatio: null, // set to a number if needed
        allowInvalidContainer: false, // set to true if needed
        nodeHoverProgramClasses: {}, // empty object for nodeHoverProgramClasses
        // Set other properties as needed
        // You can set them to their default values or any value suitable for your test
      };

      //updated_distance_renderer = new Sigma(updated_distance_graph, updated_distance_container, testSettings);

      // Replace the default node renderer with the custom drawHover function
      /*if (updated_distance_renderer) {
        const renderer = updated_distance_renderer;
        (renderer as any).on('overNode', function(e: any) {
          drawHover(e.data.renderer.contexts.hover.canvas.getContext('2d'), e.data.node, testSettings);
        });
      }*/   

      const nodeLabel = updated_traversal_input.value; 
      updated_distance = updated_distance_input.value;
      let updated_distance_num: number = parseFloat(updated_distance);
      console.log("continuing");
  
      // Find a node with a matching label
      u_selectedNode = updated_distance_graph
        .nodes()
        .find(
          (node) =>
            updated_distance_graph.getNodeAttribute(node, "label") === nodeLabel
        );
      if (u_selectedNode) {
        console.log("we found the node");
        console.log("selected node: ", u_selectedNode);

        // Call the resetGraph function to reset the graph
        resetGraph(updated_distance_graph);
        updated_distance_graph.clearEdges();

        const containerWidth = updated_distance_container.offsetWidth;
        const containerHeight = updated_distance_container.offsetHeight;

        updated_distance_graph.setNodeAttribute(u_selectedNode, "x", -containerWidth / 2);
        updated_distance_graph.setNodeAttribute(u_selectedNode, "y", -containerHeight / 2);

        // Set its size and color
        updated_distance_graph.setNodeAttribute(u_selectedNode, "size", 30);
        updated_distance_graph.setNodeAttribute(u_selectedNode, "color", "black");

        //console.log("Printing: ", parsed_data[u_selectedNode])
        
         // Call the updateColor function to start the rainbow fading effect
        //updateColor(graph_distance_view, selectedNode);

        // Get the relationship data for the selected node
        // u_relationships = parsed_data;

        u_relationships = {};
        for (const node of Object.keys(parsed_data)) {
        u_relationships[node] = parsed_data[node].score;
        }

        //console.log("min: ", minRelationship, ", max: ", maxRelationship);

        // Calculate the minimum and maximum relationship values
        //const minRelationship = Math.min(...(Object.values(u_relationships) as number[])); //-0.09953586757183075
        //const maxRelationship = Math.max(...(Object.values(u_relationships) as number[]));
        const maxRelationship = Math.max(...Object.values(u_relationships));
        const minRelationship = -0.09953586757183075;

        console.log("minimum: ", minRelationship);
        console.log("maximum: ", maxRelationship);

        //const colorScale = chroma.scale([ 'red', 'orange', 'yellow']).domain([minRelationship, maxRelationship]);
        console.log("ok");
        // Normalize the relationship values and use them to position the nodes
        // Calculate the angle step for a full circle, used to evenly distribute weaknesses
        const angleStep = 2 * Math.PI / Object.keys(u_relationships).length;

        console.log("parsed data: ", parsed_data);

        console.log("u_relationships:", u_relationships);

        for (const [node, relationship] of Object.entries(u_relationships)) {
          if (node !== u_selectedNode) {
            console.log("we are now normalizing.");
          // Normalize the relationship value
          const normalizedRelationship =
            1 - (((relationship as number) - minRelationship) /
            (maxRelationship - minRelationship)) - .15;

          // Calculate the distance of the node from the selected node
          const distance = normalizedRelationship * (containerWidth / 32);
          console.log("distance: ", normalizedRelationship, "user_distance: ", updated_distance_num);

          if (normalizedRelationship <= updated_distance_num)
          {
            updated_distance_graph.addEdge(u_selectedNode, node); // add edges

            // Calculate the angle for this node
            const angle = angleStep * Object.keys(u_relationships).indexOf(node) + Math.random() * 0.7; //still not a good way to go about this.

            // Set the position of the nodes
            updated_distance_graph.setNodeAttribute(
              node,
              "x",
              -containerWidth / 2 + distance * Math.cos(angle)
            );
            updated_distance_graph.setNodeAttribute(
              node,
              "y",
              -containerHeight / 2 + distance * Math.sin(angle)
            );

            const relationshipDistance = u_relationships[node];

            // Old color settings  
            // Set the color of the node based on its weight
            //const color = colorScale(normalizedRelationship);
            //const rgbaColor = `rgba(${color.rgb()[0]}, ${color.rgb()[1]}, ${color.rgb()[2]}, ${1 - .25 * normalizedRelationship})`;
            //updated_distance_graph.setNodeAttribute(node, "color", rgbaColor);

            console.log(parsed_data[node].clusters);
            const firstCluster = parsed_data[node].clusters[0] as keyof typeof clusterColors;
            console.log(`First cluster: ${firstCluster}`);
            console.log(`Is key in clusterColors: ${firstCluster in clusterColors}`);

            const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : '#000000';  // Default to black if the cluster is not in the mapping
            updated_distance_graph.setNodeAttribute(node, "color", nodeColor);
                       

            // Set the size of the node based on its normalized weight
            const nodeSize = (1 - normalizedRelationship) * 25; // Adjust the multiplier as needed to get the desired range of sizes
            updated_distance_graph.setNodeAttribute(node, "size", nodeSize);

            //updated_distance_graph.setNodeAttribute(node, "borderColor", "black");
            //updated_distance_graph.setNodeAttribute(node, "borderSize", 2);

            // Set the color of the node based on its weight
            /*updated_distance_graph.setNodeAttribute(
            node,
            "color",
            colorScale(normalizedRelationship).hex()
            );*/
          }

          // Increment the angle for the next node
          //angle += angleStep;
        }
      }

      // Calculate the distance of the node from the selected node
      //const distance = Math.pow(1 - normalizedRelationship, 2) * (containerWidth / 4);
      //updateColors();
      console.log("Data set used: ", dataSelect.value);

      // Check if the third container element was found
      if (!updated_distance_container) {
        console.log("Error: Could not find second container element on the page");
      } else {
        console.log("good");
        // Check if a second Sigma instance already exists
        if (updated_distance_renderer) {
          console.log("perfect!!!!");
          // Remove the existing Sigma instance
          updated_distance_renderer.kill();
          updated_distance_renderer = null;
      }

      // Create a new Sigma instance and render the graph in the third container
      updated_distance_renderer = new Sigma(updated_distance_graph, updated_distance_container, testSettings);

      if (updated_distance_renderer) {
        (updated_distance_renderer).on('clickNode', function(e: any) {
          // Get the clicked node's id
          var nodeId = e.node;
          console.log("Clicked on node with ID:", nodeId);
          eventEmitter.emit('nodeClicked', nodeId);
        });
      }
    }
    }
  }
  });
}

// TOP BOTTOM SECTION NODE VISUALIZATION
const top_bottom_input = document.getElementById("top-bottom-input") as HTMLInputElement;
const bottom_top_amount_input = document.getElementById("bottom-top-number-input") as HTMLInputElement;
const top_bottom_select = document.getElementById("top-bottom-select") as HTMLSelectElement;

const bottom_top_graph = new Graph();
let bottom_top_renderer: Sigma | null;
const bottom_top_container = document.getElementById("bottom-top-container") as HTMLElement;

//Event listener to check to see the option selected. 
document.getElementById('data-select')?.addEventListener('change', (event) => {
  selectedOption = (event.target as HTMLSelectElement).value; // saving the value of the selected option

  // Reset the input fields
  top_bottom_input.value = '';
  bottom_top_amount_input.value = '';

  // Clear the graph
  bottom_top_graph.clear();

  // Kill the renderer if it exists
  if (bottom_top_renderer != null)
  {
    bottom_top_renderer.kill();
    bottom_top_renderer = null;
  }

});

// This is the best traversal that shows meaningful nodes for now.
let bt_relationships: { [key: string]: any }; //
let bt_selectedNode: string | undefined = undefined; //
let node_amount: string | null = null;

if (top_bottom_input && bottom_top_amount_input && top_bottom_select) {
  bottom_top_amount_input.addEventListener("keydown", async (event) => { //make the event listener async
    if (event.key === "Enter") {

      // Clear the graph
      bottom_top_graph.clear();

      // Kill the renderer if it exists
      if (bottom_top_renderer != null)
      {
        bottom_top_renderer.kill();
      }

      let amountValue = parseFloat(bottom_top_amount_input.value);

      if (isNaN(amountValue)) {
          console.error("Invalid node amount");
          return;
      }

      let startNode = top_bottom_input.value; // Get the start node value from the input field
      let topOrBottom = top_bottom_select.value; // Get the selected option (Top or Bottom)

      console.log(selectedOption);
      console.log(startNode);
      console.log(topOrBottom);
      console.log(amountValue);

      //http://127.0.0.1:5000/different.json -- for local hosting
      //http://jwilson9567.pythonanywhere.com -- this is for online hosting
      //this needs to be fixed to work with both CAPEC and CWE datasets still
      //TODO the previous graph is not being killed properly
      let response = await fetch('https://jwilson9567.pythonanywhere.com/topbottom.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data_type=${selectedOption}&start_node=${startNode}&node_amount=${amountValue}&top_or_bottom=${topOrBottom}`,
      });

      if (!response.ok) 
      {
        console.error("Fetch request failed:", response.status, response.statusText);
        return;
      }

      let data = await response.json();
      console.log(data);
      // 'data' is now a JavaScript object that you can work with
      parsed_data = data;

      const clusterColors = {
        '7PK': '#1f77b4',  // Muted Blue
        'CERT': '#ff7f0e',  // Safety Orange
        'CISQ': '#2ca02c',  // Cooked Asparagus Green
        'Comprehensive Categorization': '#d62728',  // Brick Red
        'ICS': '#9467bd',  // Muted Purple
        'OWASP': '#8c564b',  // Chestnut Brown
        'SEI CERT': '#e377c2',  // Raspberry Yogurt Pink
        'SFP': '#bcbd22',  // Curry Yellow-Green
        'The CERT': '#17becf',  // Blue-Teal
        'Uncategorized': '#7f7f7f'  // Middle Gray
      };      

      // Reading and adding the nodes into the single_node_graph_view
      for (const node of Object.keys(parsed_data)) {
        console.log(`Node: ${node}`);
  
        if (parsed_data[node].clusters) {
          console.log(`Clusters: ${parsed_data[node].clusters}`);
        } else {
          console.log('Clusters: undefined');
        }

        // Get the color of the first cluster
        const firstCluster = parsed_data[node].clusters[0] as keyof typeof clusterColors;
        const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : '#000000';      
        
        bottom_top_graph.addNode(node, { 
          label: node,
          score: parsed_data[node].score,
          categories: parsed_data[node].categories, 
          clusters: parsed_data[node].clusters.join(', '),
          tag: parsed_data[node].categories.join(', '),
          x: Math.random(),  // Add an 'x' attribute
          y: Math.random()   // Add a 'y' attribute 
        });
        console.log("we did it.");
      }

      const testSettings: Settings = {
        labelSize: 14,
        labelFont: 'Arial',
        labelWeight: 'bold',
        hideEdgesOnMove: false, 
        hideLabelsOnMove: false,
        renderLabels: true,
        renderEdgeLabels: true,
        defaultNodeColor: '#000000',  
        defaultNodeType: 'circle',
        defaultEdgeColor: '#000000',
        defaultEdgeType: 'line',
        edgeLabelFont: 'Arial',
        edgeLabelSize: 12,
        edgeLabelWeight: 'Arial',
        stagePadding: 10,
        labelDensity: 1,  
        labelGridCellSize: 10, 
        labelRenderedSizeThreshold: 8,
        nodeReducer: null,
        edgeReducer: null,
        zIndex: true,
        labelRenderer: drawLabel,
        hoverRenderer: drawHover,
        edgeLabelRenderer: drawEdgeLabel,
        nodeProgramClasses: {},
        edgeProgramClasses: {},
        enableEdgeClickEvents: true,
        enableEdgeWheelEvents: true,
        enableEdgeHoverEvents: true,
        labelColor: {
          attribute: 'myAttribute',
          color: '#000000', // optional
        },
        edgeLabelColor: {
          attribute: 'myAttribute',
          color: '#000000', // optional
        },
        zoomToSizeRatioFunction: (ratio: number) => ratio, // example function that returns the input ratio
        itemSizesReference: 'screen', // use 'screen' or 'positions' as needed
        minCameraRatio: null, // set to a number if needed 
        maxCameraRatio: null, // set to a number if needed
        allowInvalidContainer: false, // set to true if needed
        nodeHoverProgramClasses: {}, // empty object for nodeHoverProgramClasses
        // Set other properties as needed
        // You can set them to their default values or any value suitable for your test
      };

      const nodeLabel = top_bottom_input.value; 
      node_amount = bottom_top_amount_input.value;
      let node_amount_num: number = parseFloat(node_amount);
      console.log("continuing");
  
      //TODO: THIS NEEDS TO BE FIXED!!!!!!! WE ARE NOT RETURNING THE START NODE EVER WHEN IT IS NEGATIVE
      // Find a node with a matching label
      bt_selectedNode = bottom_top_graph
        .nodes()
        .find(
          (node) =>
          bottom_top_graph.getNodeAttribute(node, "label") === nodeLabel
        );
      if (bt_selectedNode) {
        console.log("we found the node");
        console.log("selected node: ", bt_selectedNode);

        // Call the resetGraph function to reset the graph
        resetGraph(bottom_top_graph);
        bottom_top_graph.clearEdges();

        const containerWidth = bottom_top_container.offsetWidth;
        const containerHeight = bottom_top_container.offsetHeight;

        bottom_top_graph.setNodeAttribute(bt_selectedNode, "x", -containerWidth / 2);
        bottom_top_graph.setNodeAttribute(bt_selectedNode, "y", -containerHeight / 2);

        // Set its size and color
        bottom_top_graph.setNodeAttribute(bt_selectedNode, "size", 30);
        bottom_top_graph.setNodeAttribute(bt_selectedNode, "color", "black");

        bt_relationships = {};
        for (const node of Object.keys(parsed_data)) {
        bt_relationships[node] = parsed_data[node].score;
        }

        console.log("bt_relationships:", bt_relationships);

        let maxRelationship = Math.max(...Object.values(bt_relationships));
        const minRelationship = -0.09953586757183075;

        // Check if maxRelationship is NaN
        if (isNaN(maxRelationship)) {
        // If so, set it to 1
        maxRelationship = 1;
        }

        console.log("minimum: ", minRelationship);
        console.log("maximum: ", maxRelationship);

        //const colorScale = chroma.scale([ 'red', 'orange', 'yellow']).domain([minRelationship, maxRelationship]);
        console.log("ok");
        // Normalize the relationship values and use them to position the nodes
        // Calculate the angle step for a full circle, used to evenly distribute weaknesses
        const angleStep = 2 * Math.PI / Object.keys(bt_relationships).length;

        console.log("parsed data: ", parsed_data);

        console.log("bt_relationships:", bt_relationships);

        for (const [node, relationship] of Object.entries(bt_relationships)) {
          if (node !== bt_selectedNode) {
            console.log("we are now normalizing.");
          // Normalize the relationship value
          const normalizedRelationship =
            1 - (((relationship as number) - minRelationship) /
            (maxRelationship - minRelationship)) - .15;

          // Calculate the distance of the node from the selected node
          const distance = normalizedRelationship * (containerWidth / 64);
          console.log("distance: ", normalizedRelationship, "user_distance: ", node_amount_num);

          if (normalizedRelationship <= node_amount_num)
          {
            bottom_top_graph.addEdge(bt_selectedNode, node); // add edges

            // Calculate the angle for this node
            const angle = angleStep * Object.keys(bt_relationships).indexOf(node) + Math.random() * 0.7; //still not a good way to go about this.

            // Set the position of the nodes
            bottom_top_graph.setNodeAttribute(
              node,
              "x",
              -containerWidth / 2 + distance * Math.cos(angle)
            );
            bottom_top_graph.setNodeAttribute(
              node,
              "y",
              -containerHeight / 2 + distance * Math.sin(angle)
            );

            console.log(parsed_data[node].clusters);
            const firstCluster = parsed_data[node].clusters[0] as keyof typeof clusterColors;
            console.log(`First cluster: ${firstCluster}`);
            console.log(`Is key in clusterColors: ${firstCluster in clusterColors}`);

            const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : '#000000';  // Default to black if the cluster is not in the mapping

            // Convert the hex color to RGB
            let rgbColor = hexToRgb(nodeColor);

            // Define the opacity based on the normalizedRelationship
            let opacity = 1 - 0.25 * normalizedRelationship;

            // Convert the RGB color to RGBA
            if (rgbColor) {
              let rgbaColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
              bottom_top_graph.setNodeAttribute(node, "color", rgbaColor);
            } else {
              console.error(`Invalid color: ${nodeColor}`);
            }        
                  
            // Set the size of the node based on its normalized weight
            const nodeSize = (1 - normalizedRelationship) * 25; // Adjust the multiplier as needed to get the desired range of sizes
            bottom_top_graph.setNodeAttribute(node, "size", nodeSize);
          }
        }
      }

      console.log("Data set used: ", dataSelect.value);

      // Check if the third container element was found
      if (!bottom_top_container) {
        console.log("Error: Could not find second container element on the page");
      } else {
        console.log("good");
        // Check if a second Sigma instance already exists
        if (bottom_top_renderer) {
          console.log("perfect!!!!");
          // Remove the existing Sigma instance
          bottom_top_renderer.kill();
          bottom_top_renderer = null;
      }

      // Create a new Sigma instance and render the graph in the third container
      bottom_top_renderer = new Sigma(bottom_top_graph, bottom_top_container, testSettings);

      if (bottom_top_renderer) {
        (bottom_top_renderer).on('clickNode', function(e: any) {
          // Get the clicked node's id
          var nodeId = e.node;
          console.log("Clicked on node with ID:", nodeId);
          eventEmitter.emit('nodeClicked', nodeId);
        });
      }
    }
    }
  }
  });
}

function hexToRgb(hex: string) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}








