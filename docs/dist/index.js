import Graph from "../_snowpack/pkg/graphology.js";
import Sigma from "../_snowpack/pkg/sigma.js";
import chroma from "../_snowpack/pkg/chroma-js.js";
import "./test_desc.js";
import {EventEmitter} from "../_snowpack/pkg/events.js";
export const eventEmitter = new EventEmitter();
function Get(yourUrl) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}
window.onload = () => {
  const modeSelect2 = document.getElementById("mode-select");
  const dataSelect2 = document.getElementById("data-select");
  modeSelect2.disabled = true;
  dataSelect2.addEventListener("change", function() {
    if (this.value) {
      modeSelect2.disabled = false;
    } else {
      modeSelect2.disabled = true;
    }
  });
};
const dataSelect = document.getElementById("data-select");
dataSelect.addEventListener("change", () => {
  const defaultOption = dataSelect.querySelector('option[value=""]');
  if (dataSelect.value && defaultOption) {
    defaultOption.remove();
  }
});
const single_node_container = document.getElementById("single-node-container");
let parsed_data;
let node_descriptions_data;
let single_node_renderer;
document.getElementById("data-select")?.addEventListener("change", (event) => {
  const selectedOption2 = event.target.value;
  single_node_legend.style.display = "none";
  document.getElementById("single-node-input").value = "";
  single_node_graph_view.clear();
  if (single_node_renderer != null) {
    single_node_renderer.kill();
    single_node_renderer = null;
  }
  start_node_distance_graph.clear();
  if (start_node_distance_renderer != null) {
    start_node_distance_renderer.kill();
    start_node_distance_renderer = null;
  }
  document.getElementById("start-node-input").value = "";
  document.getElementById("distance-input").value = "";
  const pathDisplay = document.getElementById("path-display");
  const totalRiskDisplay = document.getElementById("total-risk-display");
  if (pathDisplay) {
    pathDisplay.innerHTML = "";
  }
  if (totalRiskDisplay) {
    totalRiskDisplay.innerHTML = "";
  }
  if (!selectedOption2) {
    alert("Please choose a data set to work with!");
    return;
  }
  fetch("https://jwilson9567.pythonanywhere.com/different.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `data_type=${selectedOption2}`
  }).then((response) => response.json()).then((data) => {
    console.log(data);
    parsed_data = data;
    for (const node of Object.keys(parsed_data)) {
      single_node_graph_view.addNode(node, {label: node});
    }
  });
  fetch("https://jwilson9567.pythonanywhere.com/all_node_description_data.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `data_type=${selectedOption2}`
  }).then((response) => response.json()).then((data) => {
    console.log("Printing descriptions for all nodes: ");
    console.log(data);
    node_descriptions_data = data;
  });
});
const single_node_graph_view = new Graph();
const modeSelect = document.querySelector("#mode-select");
const single_node_section = document.getElementById("single-node-section");
const start_node_distance_section = document.getElementById("start-node-distance-section");
const better_traversal = document.getElementById("better-traversal-section");
const updated_traversal = document.getElementById("updated-traversal-section");
const bottom_top_section = document.getElementById("top-bottom-section");
if (modeSelect) {
  modeSelect.addEventListener("change", () => {
    const mode = modeSelect.value;
    single_node_section.style.display = "none";
    start_node_distance_section.style.display = "none";
    better_traversal.style.display = "none";
    updated_traversal.style.display = "none";
    bottom_top_section.style.display = "none";
    if (mode === "single-node") {
      single_node_section.style.display = "block";
    } else if (mode === "start-node-distance") {
      start_node_distance_section.style.display = "block";
    } else if (mode === "better-traversal-visual") {
      better_traversal.style.display = "block";
    } else if (mode === "updated-traversal-visual") {
      updated_traversal.style.display = "block";
    } else if (mode === "top-bottom-traversal-visual") {
      bottom_top_section.style.display = "block";
    }
  });
}
console.log("ok");
const single_node_input = document.querySelector("#single-node-input");
const single_node_legend = document.querySelector("#legend");
if (single_node_section) {
  single_node_section.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const nodeLabel = single_node_input.value;
      const selectedNode2 = single_node_graph_view.nodes().find((node) => single_node_graph_view.getNodeAttribute(node, "label") === nodeLabel);
      if (selectedNode2) {
        console.log("we found the node");
        resetGraph(single_node_graph_view);
        const containerWidth = single_node_container.offsetWidth;
        const containerHeight = single_node_container.offsetHeight;
        single_node_graph_view.setNodeAttribute(selectedNode2, "x", -containerWidth / 2);
        single_node_graph_view.setNodeAttribute(selectedNode2, "y", -containerHeight / 2);
        single_node_graph_view.setNodeAttribute(selectedNode2, "size", 10);
        single_node_graph_view.setNodeAttribute(selectedNode2, "color", "black");
        const relationships2 = parsed_data[selectedNode2];
        const minRelationship = Math.min(...Object.values(relationships2));
        const maxRelationship = Math.max(...Object.values(relationships2));
        const colorScale = chroma.scale("YlOrRd").domain([minRelationship, maxRelationship]);
        let angle = -Math.PI / 2;
        const angleStep = Math.PI / (2 * Object.keys(relationships2).length);
        for (const [node, relationship] of Object.entries(relationships2)) {
          if (node !== selectedNode2) {
            const normalizedRelationship = (relationship - minRelationship) / (maxRelationship - minRelationship);
            const distance2 = Math.pow(1 - normalizedRelationship, 3) * (containerWidth / 4);
            single_node_graph_view.setNodeAttribute(node, "x", -containerWidth / 2 + distance2 * Math.cos(angle));
            single_node_graph_view.setNodeAttribute(node, "y", -containerHeight / 2 + distance2 * Math.sin(angle));
            single_node_graph_view.setNodeAttribute(node, "color", colorScale(normalizedRelationship).hex());
            angle += angleStep;
          }
        }
        console.log("Data set used: ", dataSelect.value);
        if (!single_node_container) {
          console.error("Error: Could not find second container element on the page");
        } else {
          console.log("good");
          if (single_node_renderer) {
            console.log("perfect!!!!");
            single_node_renderer.kill();
            single_node_renderer = null;
          }
          single_node_renderer = new Sigma(single_node_graph_view, single_node_container);
          if (single_node_renderer) {
            single_node_renderer.on("clickNode", function(e) {
              var nodeId = e.node;
              console.log("Clicked on node with ID:", nodeId);
              eventEmitter.emit("nodeClicked", nodeId);
            });
          }
        }
      } else {
        console.log("we did not find the node!");
      }
    }
  });
}
function resetGraph(graph) {
  graph.forEachNode((node) => {
    graph.setNodeAttribute(node, "x", 0);
    graph.setNodeAttribute(node, "y", 0);
    graph.setNodeAttribute(node, "size", 3);
    graph.setNodeAttribute(node, "color", "#666");
  });
}
function clearGraph(graph) {
  graph.clear();
}
const start_node_input = document.getElementById("start-node-input");
const distance_input = document.getElementById("distance-input");
let path;
let edge_weights;
let total_risk;
export async function fetch_neighbor_traversal() {
  const start_node = start_node_input.value;
  const start_distance = Number(distance_input.value);
  const dataSet = document.getElementById("data-select");
  const data_type = dataSet.value;
  try {
    const response = await fetch("https://jwilson9567.pythonanywhere.com/calc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({start_node, start_distance, data_type})
    });
    const data = await response.json();
    return {
      path: data.path,
      edge_weights: data.edge_weights,
      total_risk: data.distance
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
const start_node_distance_graph = new Graph();
let start_node_distance_renderer;
const start_node_distance_container = document.getElementById("start-node-distance-container");
if (start_node_input && distance_input) {
  distance_input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const data = await fetch_neighbor_traversal();
      if (data !== null) {
        console.log("we read the data: ", data.path);
        let graphWidth = 10;
        start_node_distance_graph.clear();
        for (let i = 0; i < data.path.length; i++) {
          let x = graphWidth / (data.path.length - 1) * i;
          let y = Math.random() * 4 + 5;
          if (i === 0) {
            start_node_distance_graph.addNode(data.path[i], {
              x,
              y,
              size: 6,
              label: data.path[i],
              color: "red"
            });
          } else {
            start_node_distance_graph.addNode(data.path[i], {
              x,
              y,
              size: 6,
              label: data.path[i],
              color: "blue"
            });
          }
        }
        console.log("we made it past the node read!");
        for (let i = 0; i < data.path.length - 1; i++) {
          let weight = parseFloat(data.edge_weights[i]);
          start_node_distance_graph.addEdge(data.path[i], data.path[i + 1], {
            id: "e" + i,
            source: data.path[i],
            target: data.path[i + 1],
            label: "Edge" + i,
            size: weight * 2,
            color: "#000"
          });
        }
        console.log("Edges added to the graph!");
        if (!start_node_distance_container) {
          console.error("Error: Could not find second container element on the page");
        } else {
          console.log("good");
          if (start_node_distance_renderer) {
            console.log("perfect!!!!");
            start_node_distance_renderer.kill();
            start_node_distance_renderer = null;
          }
          start_node_distance_renderer = new Sigma(start_node_distance_graph, start_node_distance_container);
          if (start_node_distance_renderer) {
            start_node_distance_renderer.on("clickNode", function(e) {
              var nodeId = e.node;
              console.log("Clicked on node with ID:", nodeId);
              eventEmitter.emit("nodeClicked", nodeId);
            });
          }
        }
      }
    }
  });
}
const better_traversal_input = document.getElementById("better-traversal-input");
const better_distance_input = document.getElementById("better-distance-input");
const better_distance_graph = new Graph();
let better_distance_renderer;
const better_distance_container = document.getElementById("better-traversal-container");
document.getElementById("data-select")?.addEventListener("change", (event) => {
  const selectedOption2 = event.target.value;
  better_traversal_input.value = "";
  better_distance_input.value = "";
  better_distance_graph.clear();
  if (better_distance_renderer != null) {
    better_distance_renderer.kill();
    better_distance_renderer = null;
  }
  fetch("https://jwilson9567.pythonanywhere.com/different.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `data_type=${selectedOption2}`
  }).then((response) => response.json()).then((data) => {
    console.log(data);
    parsed_data = data;
    for (const node of Object.keys(parsed_data)) {
      better_distance_graph.addNode(node, {label: node});
    }
  });
});
let relationships;
let selectedNode = void 0;
let better_distance = null;
if (better_traversal_input && better_distance_input) {
  better_distance_input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const nodeLabel = better_traversal_input.value;
      better_distance = better_distance_input.value;
      selectedNode = better_distance_graph.nodes().find((node) => better_distance_graph.getNodeAttribute(node, "label") === nodeLabel);
      if (selectedNode) {
        console.log("we found the node");
        resetGraph(better_distance_graph);
        const containerWidth = better_distance_container.offsetWidth;
        const containerHeight = better_distance_container.offsetHeight;
        better_distance_graph.setNodeAttribute(selectedNode, "x", -containerWidth / 2);
        better_distance_graph.setNodeAttribute(selectedNode, "y", -containerHeight / 2);
        better_distance_graph.setNodeAttribute(selectedNode, "size", 10);
        better_distance_graph.setNodeAttribute(selectedNode, "color", "black");
        relationships = parsed_data[selectedNode];
        const minRelationship = Math.min(...Object.values(relationships));
        const maxRelationship = Math.max(...Object.values(relationships));
        const colorScale = chroma.scale("YlOrRd").domain([minRelationship, maxRelationship]);
        let angle = -Math.PI / 2;
        const angleStep = Math.PI / (2 * Object.keys(relationships).length);
        for (const [node, relationship] of Object.entries(relationships)) {
          if (node !== selectedNode) {
            const normalizedRelationship = (relationship - minRelationship) / (maxRelationship - minRelationship);
            const distance2 = Math.pow(1 - normalizedRelationship, 3) * (containerWidth / 4);
            better_distance_graph.setNodeAttribute(node, "x", -containerWidth / 2 + distance2 * Math.cos(angle));
            better_distance_graph.setNodeAttribute(node, "y", -containerHeight / 2 + distance2 * Math.sin(angle));
            const relationshipDistance = relationships[node];
            better_distance_graph.setNodeAttribute(node, "color", colorScale(normalizedRelationship).hex());
            angle += angleStep;
          }
        }
        updateColors();
        console.log("Data set used: ", dataSelect.value);
        if (!better_distance_container) {
          console.error("Error: Could not find second container element on the page");
        } else {
          console.log("good");
          if (better_distance_renderer) {
            console.log("perfect!!!!");
            better_distance_renderer.kill();
            better_distance_renderer = null;
          }
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
        if (relationshipDistance >= better_distance) {
          better_distance_graph.setNodeAttribute(node, "color", "green");
          if (better_distance_graph.getNodeAttribute(node, "color") === "green") {
            redNodes.push({node, distance: relationshipDistance});
          }
        }
      }
    }
  }
  console.log("done with this iteration!!!!!");
}
import {drawHover, drawLabel} from "./canvas-utils.js";
import drawEdgeLabel from "../_snowpack/pkg/sigma/rendering/canvas/edge-label.js";
const updated_traversal_input = document.getElementById("updated-traversal-input");
const updated_distance_input = document.getElementById("updated-distance-input");
const updated_distance_graph = new Graph();
let updated_distance_renderer;
const updated_distance_container = document.getElementById("updated-traversal-container");
let selectedOption = void 0;
document.getElementById("data-select")?.addEventListener("change", (event) => {
  selectedOption = event.target.value;
  updated_traversal_input.value = "";
  updated_distance_input.value = "";
  updated_distance_graph.clear();
  if (updated_distance_renderer != null) {
    updated_distance_renderer.kill();
    updated_distance_renderer = null;
  }
});
let u_relationships;
let u_selectedNode = void 0;
let updated_distance = null;
if (updated_traversal_input && updated_distance_input) {
  updated_distance_input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      updated_distance_graph.clear();
      if (updated_distance_renderer != null) {
        updated_distance_renderer.kill();
      }
      let distanceValue = parseFloat(updated_distance_input.value);
      if (isNaN(distanceValue)) {
        console.error("Invalid distance value");
        return;
      }
      let startNode = updated_traversal_input.value;
      console.log(selectedOption);
      let response = await fetch("https://jwilson9567.pythonanywhere.com/filtered.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data_type=${selectedOption}&distance=${distanceValue}&start_node=${startNode}`
      });
      if (!response.ok) {
        console.error("Fetch request failed:", response.status, response.statusText);
        return;
      }
      let data = await response.json();
      console.log(data);
      parsed_data = data;
      const clusterColors = {
        "7PK": "#1f77b4",
        CERT: "#ff7f0e",
        CISQ: "#2ca02c",
        "Comprehensive Categorization": "#d62728",
        ICS: "#9467bd",
        OWASP: "#8c564b",
        "SEI CERT": "#e377c2",
        SFP: "#bcbd22",
        "The CERT": "#17becf",
        Uncategorized: "#7f7f7f"
      };
      for (const node of Object.keys(parsed_data)) {
        console.log(`Node: ${node}`);
        if (parsed_data[node].clusters) {
          console.log(`Clusters: ${parsed_data[node].clusters}`);
        } else {
          console.log("Clusters: undefined");
        }
        const firstCluster = parsed_data[node].clusters[0];
        const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : "#000000";
        updated_distance_graph.addNode(node, {
          label: node,
          score: parsed_data[node].score,
          categories: parsed_data[node].categories,
          clusters: parsed_data[node].clusters.join(", "),
          tag: parsed_data[node].categories.join(", "),
          x: Math.random(),
          y: Math.random()
        });
        console.log("we did it.");
      }
      const testSettings = {
        labelSize: 14,
        labelFont: "Arial",
        labelWeight: "bold",
        hideEdgesOnMove: false,
        hideLabelsOnMove: false,
        renderLabels: true,
        renderEdgeLabels: true,
        defaultNodeColor: "#000000",
        defaultNodeType: "circle",
        defaultEdgeColor: "#000000",
        defaultEdgeType: "line",
        edgeLabelFont: "Arial",
        edgeLabelSize: 12,
        edgeLabelWeight: "Arial",
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
          attribute: "myAttribute",
          color: "#000000"
        },
        edgeLabelColor: {
          attribute: "myAttribute",
          color: "#000000"
        },
        zoomToSizeRatioFunction: (ratio) => ratio,
        itemSizesReference: "screen",
        minCameraRatio: null,
        maxCameraRatio: null,
        allowInvalidContainer: false,
        nodeHoverProgramClasses: {}
      };
      const nodeLabel = updated_traversal_input.value;
      updated_distance = updated_distance_input.value;
      let updated_distance_num = parseFloat(updated_distance);
      console.log("continuing");
      u_selectedNode = updated_distance_graph.nodes().find((node) => updated_distance_graph.getNodeAttribute(node, "label") === nodeLabel);
      if (u_selectedNode) {
        console.log("we found the node");
        console.log("selected node: ", u_selectedNode);
        resetGraph(updated_distance_graph);
        updated_distance_graph.clearEdges();
        const containerWidth = updated_distance_container.offsetWidth;
        const containerHeight = updated_distance_container.offsetHeight;
        updated_distance_graph.setNodeAttribute(u_selectedNode, "x", -containerWidth / 2);
        updated_distance_graph.setNodeAttribute(u_selectedNode, "y", -containerHeight / 2);
        updated_distance_graph.setNodeAttribute(u_selectedNode, "size", 30);
        updated_distance_graph.setNodeAttribute(u_selectedNode, "color", "black");
        u_relationships = {};
        for (const node of Object.keys(parsed_data)) {
          u_relationships[node] = parsed_data[node].score;
        }
        const maxRelationship = Math.max(...Object.values(u_relationships));
        const minRelationship = -0.09953586757183075;
        console.log("minimum: ", minRelationship);
        console.log("maximum: ", maxRelationship);
        console.log("ok");
        const angleStep = 2 * Math.PI / Object.keys(u_relationships).length;
        console.log("parsed data: ", parsed_data);
        console.log("u_relationships:", u_relationships);
        for (const [node, relationship] of Object.entries(u_relationships)) {
          if (node !== u_selectedNode) {
            console.log("we are now normalizing.");
            const normalizedRelationship = 1 - (relationship - minRelationship) / (maxRelationship - minRelationship) - 0.15;
            const distance2 = normalizedRelationship * (containerWidth / 32);
            console.log("distance: ", normalizedRelationship, "user_distance: ", updated_distance_num);
            if (normalizedRelationship <= updated_distance_num) {
              updated_distance_graph.addEdge(u_selectedNode, node);
              const angle = angleStep * Object.keys(u_relationships).indexOf(node) + Math.random() * 0.7;
              updated_distance_graph.setNodeAttribute(node, "x", -containerWidth / 2 + distance2 * Math.cos(angle));
              updated_distance_graph.setNodeAttribute(node, "y", -containerHeight / 2 + distance2 * Math.sin(angle));
              const relationshipDistance = u_relationships[node];
              console.log(parsed_data[node].clusters);
              const firstCluster = parsed_data[node].clusters[0];
              console.log(`First cluster: ${firstCluster}`);
              console.log(`Is key in clusterColors: ${firstCluster in clusterColors}`);
              const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : "#000000";
              updated_distance_graph.setNodeAttribute(node, "color", nodeColor);
              const nodeSize = (1 - normalizedRelationship) * 25;
              updated_distance_graph.setNodeAttribute(node, "size", nodeSize);
            }
          }
        }
        console.log("Data set used: ", dataSelect.value);
        if (!updated_distance_container) {
          console.log("Error: Could not find second container element on the page");
        } else {
          console.log("good");
          if (updated_distance_renderer) {
            console.log("perfect!!!!");
            updated_distance_renderer.kill();
            updated_distance_renderer = null;
          }
          updated_distance_renderer = new Sigma(updated_distance_graph, updated_distance_container, testSettings);
          if (updated_distance_renderer) {
            updated_distance_renderer.on("clickNode", function(e) {
              var nodeId = e.node;
              console.log("Clicked on node with ID:", nodeId);
              eventEmitter.emit("nodeClicked", nodeId);
            });
          }
        }
      }
    }
  });
}
const top_bottom_input = document.getElementById("top-bottom-input");
const bottom_top_amount_input = document.getElementById("bottom-top-number-input");
const top_bottom_select = document.getElementById("top-bottom-select");
const bottom_top_graph = new Graph();
let bottom_top_renderer;
const bottom_top_container = document.getElementById("bottom-top-container");
document.getElementById("data-select")?.addEventListener("change", (event) => {
  selectedOption = event.target.value;
  top_bottom_input.value = "";
  bottom_top_amount_input.value = "";
  bottom_top_graph.clear();
  if (bottom_top_renderer != null) {
    bottom_top_renderer.kill();
    bottom_top_renderer = null;
  }
});
let bt_relationships;
let bt_selectedNode = void 0;
let node_amount = null;
if (top_bottom_input && bottom_top_amount_input && top_bottom_select) {
  bottom_top_amount_input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      bottom_top_graph.clear();
      if (bottom_top_renderer != null) {
        bottom_top_renderer.kill();
      }
      let amountValue = parseFloat(bottom_top_amount_input.value);
      if (isNaN(amountValue)) {
        console.error("Invalid node amount");
        return;
      }
      let startNode = top_bottom_input.value;
      let topOrBottom = top_bottom_select.value;
      console.log(selectedOption);
      console.log(startNode);
      console.log(topOrBottom);
      console.log(amountValue);
      let response = await fetch("https://jwilson9567.pythonanywhere.com/topbottom.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data_type=${selectedOption}&start_node=${startNode}&node_amount=${amountValue}&top_or_bottom=${topOrBottom}`
      });
      if (!response.ok) {
        console.error("Fetch request failed:", response.status, response.statusText);
        return;
      }
      let data = await response.json();
      console.log(data);
      parsed_data = data;
      const clusterColors = {
        "7PK": "#1f77b4",
        CERT: "#ff7f0e",
        CISQ: "#2ca02c",
        "Comprehensive Categorization": "#d62728",
        ICS: "#9467bd",
        OWASP: "#8c564b",
        "SEI CERT": "#e377c2",
        SFP: "#bcbd22",
        "The CERT": "#17becf",
        Uncategorized: "#7f7f7f"
      };
      for (const node of Object.keys(parsed_data)) {
        console.log(`Node: ${node}`);
        if (parsed_data[node].clusters) {
          console.log(`Clusters: ${parsed_data[node].clusters}`);
        } else {
          console.log("Clusters: undefined");
        }
        const firstCluster = parsed_data[node].clusters[0];
        const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : "#000000";
        bottom_top_graph.addNode(node, {
          label: node,
          score: parsed_data[node].score,
          categories: parsed_data[node].categories,
          clusters: parsed_data[node].clusters.join(", "),
          tag: parsed_data[node].categories.join(", "),
          x: Math.random(),
          y: Math.random()
        });
        console.log("we did it.");
      }
      const testSettings = {
        labelSize: 14,
        labelFont: "Arial",
        labelWeight: "bold",
        hideEdgesOnMove: false,
        hideLabelsOnMove: false,
        renderLabels: true,
        renderEdgeLabels: true,
        defaultNodeColor: "#000000",
        defaultNodeType: "circle",
        defaultEdgeColor: "#000000",
        defaultEdgeType: "line",
        edgeLabelFont: "Arial",
        edgeLabelSize: 12,
        edgeLabelWeight: "Arial",
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
          attribute: "myAttribute",
          color: "#000000"
        },
        edgeLabelColor: {
          attribute: "myAttribute",
          color: "#000000"
        },
        zoomToSizeRatioFunction: (ratio) => ratio,
        itemSizesReference: "screen",
        minCameraRatio: null,
        maxCameraRatio: null,
        allowInvalidContainer: false,
        nodeHoverProgramClasses: {}
      };
      const nodeLabel = top_bottom_input.value;
      node_amount = bottom_top_amount_input.value;
      let node_amount_num = parseFloat(node_amount);
      console.log("continuing");
      bt_selectedNode = bottom_top_graph.nodes().find((node) => bottom_top_graph.getNodeAttribute(node, "label") === nodeLabel);
      if (bt_selectedNode) {
        console.log("we found the node");
        console.log("selected node: ", bt_selectedNode);
        resetGraph(bottom_top_graph);
        bottom_top_graph.clearEdges();
        const containerWidth = bottom_top_container.offsetWidth;
        const containerHeight = bottom_top_container.offsetHeight;
        bottom_top_graph.setNodeAttribute(bt_selectedNode, "x", -containerWidth / 2);
        bottom_top_graph.setNodeAttribute(bt_selectedNode, "y", -containerHeight / 2);
        bottom_top_graph.setNodeAttribute(bt_selectedNode, "size", 30);
        bottom_top_graph.setNodeAttribute(bt_selectedNode, "color", "black");
        bt_relationships = {};
        for (const node of Object.keys(parsed_data)) {
          bt_relationships[node] = parsed_data[node].score;
        }
        console.log("bt_relationships:", bt_relationships);
        let maxRelationship = Math.max(...Object.values(bt_relationships));
        const minRelationship = -0.09953586757183075;
        if (isNaN(maxRelationship)) {
          maxRelationship = 1;
        }
        console.log("minimum: ", minRelationship);
        console.log("maximum: ", maxRelationship);
        console.log("ok");
        const angleStep = 2 * Math.PI / Object.keys(bt_relationships).length;
        console.log("parsed data: ", parsed_data);
        console.log("bt_relationships:", bt_relationships);
        for (const [node, relationship] of Object.entries(bt_relationships)) {
          if (node !== bt_selectedNode) {
            console.log("we are now normalizing.");
            const normalizedRelationship = 1 - (relationship - minRelationship) / (maxRelationship - minRelationship) - 0.15;
            const distance2 = normalizedRelationship * (containerWidth / 64);
            console.log("distance: ", normalizedRelationship, "user_distance: ", node_amount_num);
            if (normalizedRelationship <= node_amount_num) {
              bottom_top_graph.addEdge(bt_selectedNode, node);
              const angle = angleStep * Object.keys(bt_relationships).indexOf(node) + Math.random() * 0.7;
              bottom_top_graph.setNodeAttribute(node, "x", -containerWidth / 2 + distance2 * Math.cos(angle));
              bottom_top_graph.setNodeAttribute(node, "y", -containerHeight / 2 + distance2 * Math.sin(angle));
              console.log(parsed_data[node].clusters);
              const firstCluster = parsed_data[node].clusters[0];
              console.log(`First cluster: ${firstCluster}`);
              console.log(`Is key in clusterColors: ${firstCluster in clusterColors}`);
              const nodeColor = firstCluster in clusterColors ? clusterColors[firstCluster] : "#000000";
              let rgbColor = hexToRgb(nodeColor);
              let opacity = 1 - 0.25 * normalizedRelationship;
              if (rgbColor) {
                let rgbaColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
                bottom_top_graph.setNodeAttribute(node, "color", rgbaColor);
              } else {
                console.error(`Invalid color: ${nodeColor}`);
              }
              const nodeSize = (1 - normalizedRelationship) * 25;
              bottom_top_graph.setNodeAttribute(node, "size", nodeSize);
            }
          }
        }
        console.log("Data set used: ", dataSelect.value);
        if (!bottom_top_container) {
          console.log("Error: Could not find second container element on the page");
        } else {
          console.log("good");
          if (bottom_top_renderer) {
            console.log("perfect!!!!");
            bottom_top_renderer.kill();
            bottom_top_renderer = null;
          }
          bottom_top_renderer = new Sigma(bottom_top_graph, bottom_top_container, testSettings);
          if (bottom_top_renderer) {
            bottom_top_renderer.on("clickNode", function(e) {
              var nodeId = e.node;
              console.log("Clicked on node with ID:", nodeId);
              eventEmitter.emit("nodeClicked", nodeId);
            });
          }
        }
      }
    }
  });
}
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
