// dataStreams/scripts/metricsQuery.js
// Spread each series' labels as individual top-level columns (named exactly
// as the label) instead of one combined JSON blob, with the reserved
// "__name__" label pulled out separately as "name".
result = ((data.data && data.data.result) || []).flatMap((series) => {
    const { __name__, ...labels } = series.metric || {};
    return (series.values || []).map(([ts, val]) => ({
        name: __name__ || "",
        ...labels,
        timestamp: ts * 1000,
        value: parseFloat(val),
    }));
});
