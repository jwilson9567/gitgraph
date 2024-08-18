import React, {useState} from "../_snowpack/pkg/react.js";
import {BsInfoCircle} from "../_snowpack/pkg/react-icons/bs.js";
import Panel from "./Panel.js";
const Risk_Visual_Panel_v2 = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return /* @__PURE__ */ React.createElement(Panel, {
    isDeployed: isPanelOpen,
    setIsDeployed: setIsPanelOpen,
    title: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BsInfoCircle, {
      className: "text-muted"
    }), " Description")
  }, /* @__PURE__ */ React.createElement("p", null, 'This traversal similar to the start node and distance section, shows nodes that are within a given distance or "risk" the user is willing to take.'), /* @__PURE__ */ React.createElement("p", null, 'This traversal takes a start node and a distance. Once these are provided, a graph will be displayed, with nodes colored "red" being within the given distance. Nodes colored "green" are unable to be reached with the distance provided.'), /* @__PURE__ */ React.createElement("p", null, "The distances between the nodes and edges are determined by the original weights provided in the datasets. This is meant to show, given a specific risk the user is allowed to take, what nodes can be reached based on that distance."), /* @__PURE__ */ React.createElement("p", null, "The key difference between this section and the start node and distance is that this section shows all the nodes within a distance, while the other distance section shows just the nodes on the shortest path."));
};
export default Risk_Visual_Panel_v2;
