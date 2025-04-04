const getNodeId = node => typeof node === 'object' ? node.id : node;

const getConnectedNodes = (links, selectedNodes) => {
    const connectedNodeIds = new Set(selectedNodes);

    links.forEach(link => {
        const sourceId = getNodeId(link.source);
        const targetId = getNodeId(link.target);

        if (selectedNodes.includes(sourceId)) connectedNodeIds.add(targetId);
        if (selectedNodes.includes(targetId)) connectedNodeIds.add(sourceId);
    });

    return connectedNodeIds;
};

const isNodeSelected = (nodeId, selectedNodes) => selectedNodes.includes(nodeId);
const isLinkSelected = (link, selectedNodes) => {
    const sourceId = getNodeId(link.source);
    const targetId = getNodeId(link.target);
    return isNodeSelected(sourceId, selectedNodes) || isNodeSelected(targetId, selectedNodes);
};

// Helper to check if a node is connected to any selected node
const isConnectedToSelected = (allNodes, selectedNodes, nodeId) => {
    if (selectedNodes.length === 0) return true;
    if (isNodeSelected(nodeId, selectedNodes)) return true;

    // Check if this node has any connection to selected nodes
    return allNodes.links.some(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return (sourceId === nodeId && isNodeSelected(targetId, selectedNodes)) ||
            (targetId === nodeId && isNodeSelected(sourceId, selectedNodes));
    });
};

export { getConnectedNodes, isNodeSelected, isLinkSelected, isConnectedToSelected };