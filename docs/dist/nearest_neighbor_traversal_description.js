import React, {useState} from "../_snowpack/pkg/react.js";
import {BsInfoCircle} from "../_snowpack/pkg/react-icons/bs.js";
import Panel from "./Panel.js";
const NearestNeighborTravDescriptionPanel = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return /* @__PURE__ */ React.createElement(Panel, {
    isDeployed: isPanelOpen,
    setIsDeployed: setIsPanelOpen,
    title: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BsInfoCircle, {
      className: "text-muted"
    }), " Description")
  }, /* @__PURE__ */ React.createElement("p", null, "This traversal illustrates the optimal path determined by the nodes with the highest weights."), /* @__PURE__ */ React.createElement("p", null, "Within the given datasets, nodes with weights closer to 1 exhibit a stronger correlation to each other. The algorithm employed is the", /* @__PURE__ */ React.createElement("a", {
    target: "_blank",
    rel: "noreferrer",
    href: "https://en.wikipedia.org/wiki/Nearest_neighbour_algorithm"
  }, " nearest neighbor algorithm"), ", which selects the node with the highest weight at each step until the user-defined distance is reached."), /* @__PURE__ */ React.createElement("p", null, "This effectively delineates a path of maximally related nodes that can be traversed within the specified distance input by the user."));
};
export default NearestNeighborTravDescriptionPanel;
