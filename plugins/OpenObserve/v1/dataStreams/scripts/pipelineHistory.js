// dataStreams/scripts/pipelineHistory.js
// "timestamp"'s valueExpression previously self-referenced $['timestamp']
// (the same column it was overriding), which rendered empty - the same
// class of bug fixed in tracesLatest's trace_id link. Compute it as a real
// field here instead, matching the proven pattern used elsewhere in this
// plugin.
result = (data.hits || []).map((entry) => ({
    ...entry,
    timestamp: entry.timestamp / 1000,
}));
