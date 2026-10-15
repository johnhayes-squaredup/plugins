// dataStreams/scripts/search.js
//
// A row's "_timestamp" field (leading underscore) is invisible to
// metadata valueExpression lookups ($['_timestamp'] / $._timestamp both
// resolve to undefined even though the key is present in the raw row and
// declared in metadata) - so the microseconds -> milliseconds conversion
// for the date-shaped timestamp column has to happen here instead.
result = (data.hits || []).map((row) => ({
    ...row,
    timestamp: row._timestamp / 1000,
}));
