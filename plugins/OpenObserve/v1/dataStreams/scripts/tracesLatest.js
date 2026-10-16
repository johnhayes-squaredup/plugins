// dataStreams/scripts/tracesLatest.js
//
// "spans" is a 2-element array ([spanCount, ...]), not a list of individual
// spans. "service_name" is an array of per-service summaries, and "models"
// an array of model names - left as-is, these would each explode into
// numbered per-index columns (service_name.0.*, service_name.1.*, ...) via
// the metadata catch-all, which reads like per-span detail even though it
// isn't. Summarize all three here instead of exploding them (array fields
// also can't be read via valueExpression, even just to count/join them -
// see project memory - so this has to happen in script). The trace-detail
// link also has to be built here: "dataSource.*" is only resolvable inside
// config strings/scripts, not inside a metadata valueExpression (confirmed
// empirically - it throws "dataSource is not defined" there).
const ds = (context.dataSources && context.dataSources[0]) || {};
const webBase = [ds.url, ds.port].filter(Boolean).join(":");
const streamName = (context.objects && context.objects[0] && context.objects[0].name) || "";

result = (data.hits || []).map((row) => {
    const { spans, service_name, models, ...rest } = row;
    const fromUs = Math.floor(row.start_time / 1000);
    const toUs = Math.floor(row.end_time / 1000);
    return {
        ...rest,
        spanCount: (spans && spans[0]) || 0,
        serviceCount: (service_name || []).length,
        services: (service_name || []).map((s) => s.service_name).join(", "),
        models: (models || []).join(", "),
        traceUrl: `${webBase}/web/traces/trace-details?org_identifier=${ds.organization}&stream=${streamName}&trace_id=${row.trace_id}&from=${fromUs}&to=${toUs}`,
    };
});
