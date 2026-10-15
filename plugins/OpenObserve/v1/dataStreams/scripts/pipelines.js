// dataStreams/scripts/pipelines.js
// Array-valued fields (nodes/edges) arrive at valueExpression already stringified
// ("[object Array]" or a JSON-text blob), so .length there counts characters, not
// elements. Compute real counts here, and stringify the nested json-shaped fields
// so they render as JSON rather than "[object Object]".
result = (data.list || []).map((p) => {
    const nodes = p.nodes || [];
    const edges = p.edges || [];
    return {
        pipeline_id: p.pipeline_id,
        name: p.name,
        description: p.description || "",
        enabled: p.enabled,
        version: p.version,
        paused_at: p.paused_at != null ? p.paused_at : null,
        last_error: p.last_error != null ? JSON.stringify(p.last_error) : null,
        source: p.source != null ? JSON.stringify(p.source) : null,
        nodeCount: nodes.length,
        edgeCount: edges.length,
    };
});
