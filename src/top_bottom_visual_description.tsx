import React, { useState } from "react";
import type { FC } from "react";
import { BsInfoCircle } from "react-icons/bs";

import Panel from "./Panel";

const Top_Bottom_Visual_Panel: FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Panel is initially closed
  return (
    <Panel
      isDeployed={isPanelOpen}
      setIsDeployed={setIsPanelOpen}
      title={
        <>
          <BsInfoCircle className="text-muted" /> Description
        </>
      }
    >
      <p>
        This traversal similar to the start node and distance section, shows nodes that are within a given
        distance or "risk" the user is willing to take.
      </p>
      <p>
        This traversal takes a start node and a distance. Once these are provided, a graph will be displayed, 
        with nodes colored "red" being within the given distance. Nodes colored "green" are unable to be
        reached with the distance provided.  
      </p>
      <p>
        The distances between the nodes and edges are determined by the original weights provided in the datasets.
        This is meant to show, given a specific risk the user is allowed to take, what nodes can be reached based
        on that distance. 
      </p>
      <p>
        The key difference between this section and the start node and distance is that this section shows all
        the nodes within a distance, while the other distance section shows just the nodes on the shortest path.
      </p>
    </Panel>
  );
};

export default Top_Bottom_Visual_Panel;