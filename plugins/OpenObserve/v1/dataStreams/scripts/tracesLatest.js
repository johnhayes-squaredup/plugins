// dataStreams/scripts/tracesLatest.js
//
// Unlike the _search endpoint, /traces/latest rows have no "_timestamp"
// field at all - each hit is a trace summary with "start_time"/"end_time"
// in NANOSECONDS (not the microseconds used by the start_time/end_time
// query args). Derive a millisecond "timestamp" column from start_time
// here, since a declarative valueExpression can't do unit conversion.
result = (data.hits || []).map((row) => ({
    ...row,
    timestamp: row.start_time / 1000000,
}));
