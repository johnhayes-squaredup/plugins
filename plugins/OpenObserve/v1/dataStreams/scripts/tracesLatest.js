// dataStreams/scripts/tracesLatest.js
//
// "spans" is a 2-element array ([spanCount, ...]), not a list of individual
// spans - array fields can't be read via valueExpression even just to count
// them (see project memory), so pull the count out here. The trace-detail
// link also has to be built here: "dataSource.*" is only resolvable inside
// config strings/scripts, not inside a metadata valueExpression (confirmed
// empirically - it throws "dataSource is not defined" there).
const ds = (context.dataSources && context.dataSources[0]) || {};
const webBase = [ds.url, ds.port].filter(Boolean).join(":");
const streamName = (context.objects && context.objects[0] && context.objects[0].name) || "";

result = (data.hits || []).map((row) => {
    const { spans, ...rest } = row;
    const fromUs = Math.floor(row.start_time / 1000);
    const toUs = Math.floor(row.end_time / 1000);
    return {
        ...rest,
        spanCount: (spans && spans[0]) || 0,
        traceUrl: `${webBase}/web/traces/trace-details?org_identifier=${ds.organization}&stream=${streamName}&trace_id=${row.trace_id}&from=${fromUs}&to=${toUs}`,
    };
});
