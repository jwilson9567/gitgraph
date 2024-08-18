import React, {useState, useEffect} from "../_snowpack/pkg/react.js";
import {AiFillAlert} from "../_snowpack/pkg/react-icons/ai.js";
import {fetch_neighbor_traversal} from "./index.js";
import Panel from "./Panel.js";
const NearestNeighborExtraPanel = ({data: initialData}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [data, setData] = useState(initialData);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        fetch_neighbor_traversal().then((data2) => {
          if (data2 !== null) {
            console.log("Fetched data: ", data2);
            const roundedData = {
              ...data2,
              edge_weights: data2.edge_weights.map((weight) => parseFloat(weight.toFixed(2))),
              total_risk: parseFloat(data2.total_risk.toFixed(2))
            };
            setData(roundedData);
            setIsPanelOpen(true);
          }
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return /* @__PURE__ */ React.createElement(Panel, {
    isDeployed: isPanelOpen,
    setIsDeployed: setIsPanelOpen,
    title: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AiFillAlert, {
      className: "text-muted"
    }), " Total Risk: ", data.total_risk)
  }, /* @__PURE__ */ React.createElement("p", null, "Path: ", data.path.join(" -> ")), /* @__PURE__ */ React.createElement("p", null, "Number of Nodes: ", data.path.length), /* @__PURE__ */ React.createElement("p", null, "Edge Weights: ", data.edge_weights.join(", ")), /* @__PURE__ */ React.createElement("p", null, "Total Risk: ", data.total_risk));
};
export default NearestNeighborExtraPanel;
