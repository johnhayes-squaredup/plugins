// dataStreams/scripts/metricsQuery.js
result = ((data.data && data.data.result) || []).flatMap((series) =>
    (series.values || []).map(([ts, val]) => ({
        labels: JSON.stringify(series.metric || {}),
        timestamp: ts * 1000,
        value: parseFloat(val),
    })),
);
