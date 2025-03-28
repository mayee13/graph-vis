import { Heap } from "./heap";

export const prim = async (links, startNode, updateVisual) => {
    const nodeMap = new Map(); 

    for (const link of links) {
        if (nodeMap.has(link.source)) {
            nodeMap.get(link.source).push(link); 
        } else { 
            nodeMap.set(link.source, [link]); 
        }
    }
    console.log(nodeMap);

    // set of visited end nodes
    const visited = new Set(); 
    const mst = new Set(); 
    
    const active = new Heap(compareEdge);
    const startEdge = {source: startNode, target: startNode, weight: 0}
    active.add(startEdge); 

    while (!active.isEmpty()) {
        
        const minEdge = active.remove();

        if (visited.has(minEdge.target)) {
            continue; 
        }

        mst.add(minEdge);
        console.log("exploring edge");
        console.log(minEdge);
        await new Promise((resolve) => {
            setTimeout(() => {
                updateVisual([...visited], minEdge.target, [...mst])
                resolve(); 
            }, 1000)
        });

        console.log("adding to visited...")
        visited.add(minEdge.target);
        
        if (!nodeMap.has(minEdge.target)) {
            continue; 
        }
        console.log("adding new links...")
        for (const link of nodeMap.get(minEdge.target)) {
            if (!visited.has(link.target)) {
                const newPath = {
                    source: link.source, 
                    target: link.target, 
                    weight: link.weight
                }
                active.add(newPath); 
            }
        }
        console.log("done adding new links")

    }
    console.log("outside function")
    return undefined; 
}

const compareEdge = (edgeA, edgeB) => {
    return edgeA.weight - edgeB.weight; 
}