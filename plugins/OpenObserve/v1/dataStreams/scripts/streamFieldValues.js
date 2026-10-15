result = (data.hits || []).flatMap((h) =>
    (h.values || []).map((v) => ({
        field: h.field,
        value: v.zo_sql_key,
        count: v.zo_sql_num,
    })),
);
