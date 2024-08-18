import React, {useState, useEffect} from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import SingleNodeDescriptionPanel from "./single_node_description_panel.js";
import DescriptionPanel from "./description_panel.js";
import NearestNeighborTravDescriptionPanel from "./nearest_neighbor_traversal_description.js";
import NodeDisplay from "./node_display.js";
import RiskTraversalDescriptionPanel from "./risk_visual_description.js";
import NearestNeighborExtraPanel from "./nearest_neighbor_extra_panel.js";
import "./styles.css.proxy.js";
import Risk_Visual_Panel_v2 from "./risk_visual_desciption_v2.js";
import Top_Bottom_Visual_Panel from "./top_bottom_visual_description.js";
function App() {
  const [mode, setMode] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [nodeDescriptionsData, setNodeDescriptionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nearestNeighborData, setNearestNeighborData] = useState({path: [], edge_weights: [], total_risk: 0});
  useEffect(() => {
    const modeSelect = document.getElementById("mode-select");
    const dataSelect = document.getElementById("data-select");
    if (modeSelect) {
      modeSelect.addEventListener("change", function(event) {
        setMode(event.target.value);
      });
    }
    if (dataSelect) {
      dataSelect.addEventListener("change", function(event) {
        setSelectedOption(event.target.value);
      });
    }
  }, []);
  useEffect(() => {
    if (!selectedOption || mode !== "single-node" && mode !== "better-traversal-visual" && mode !== "start-node-distance" && mode !== "updated-traversal-visual" && mode !== "top-bottom-traversal-visual") {
      return;
    }
    setIsLoading(true);
    fetch("https://jwilson9567.pythonanywhere.com/all_node_description_data.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `data_type=${selectedOption}`
    }).then((response) => response.json()).then((data) => {
      console.log("Printing descriptions for all nodes for node_display element: ");
      console.log(data);
      setNodeDescriptionsData(data);
      setIsLoading(false);
    });
  }, [selectedOption, mode]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "panel-container"
  }, isLoading ? /* @__PURE__ */ React.createElement("div", null, "Loading...") : /* @__PURE__ */ React.createElement(React.Fragment, null, mode === "" && /* @__PURE__ */ React.createElement(DescriptionPanel, null), mode === "single-node" && /* @__PURE__ */ React.createElement(SingleNodeDescriptionPanel, null), mode === "single-node" && /* @__PURE__ */ React.createElement(NodeDisplay, {
    nodeData: nodeDescriptionsData,
    selectedOption
  }), mode === "start-node-distance" && /* @__PURE__ */ React.createElement(NearestNeighborTravDescriptionPanel, null), mode === "start-node-distance" && /* @__PURE__ */ React.createElement(NearestNeighborExtraPanel, {
    data: nearestNeighborData
  }), mode === "start-node-distance" && /* @__PURE__ */ React.createElement(NodeDisplay, {
    nodeData: nodeDescriptionsData,
    selectedOption
  }), mode === "better-traversal-visual" && /* @__PURE__ */ React.createElement(RiskTraversalDescriptionPanel, null), mode === "better-traversal-visual" && /* @__PURE__ */ React.createElement(NodeDisplay, {
    nodeData: nodeDescriptionsData,
    selectedOption
  }), mode === "updated-traversal-visual" && /* @__PURE__ */ React.createElement(Risk_Visual_Panel_v2, null), mode === "updated-traversal-visual" && /* @__PURE__ */ React.createElement(NodeDisplay, {
    nodeData: nodeDescriptionsData,
    selectedOption
  }), mode === "top-bottom-traversal-visual" && /* @__PURE__ */ React.createElement(Top_Bottom_Visual_Panel, null), mode === "top-bottom-traversal-visual" && /* @__PURE__ */ React.createElement(NodeDisplay, {
    nodeData: nodeDescriptionsData,
    selectedOption
  })));
}
;
ReactDOM.render(/* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(App, null)), document.getElementById("root"));
