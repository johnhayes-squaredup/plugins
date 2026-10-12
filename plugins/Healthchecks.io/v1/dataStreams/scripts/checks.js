// Read-write keys return `uuid`; read-only keys omit it and return `unique_key`
// instead. Both are accepted by the per-check endpoints, so either is a stable id.
const idOf = (c) => c.uuid || c.unique_key;

// Optional `checks` object picker (or a bound dashboard variable). Empty or
// absent means every check in the project.
const unwrap = (v) => (Array.isArray(v) ? v[0] : v);
const selected = (context.config && context.config.checks) || [];
const selectedIds = new Set(
    selected.map((o) => unwrap(o.rawId)).filter(Boolean),
);

// A schedule is either a cron expression (five space-separated fields) or a
// systemd OnCalendar expression; checks without one use a simple period.
const kindOf = (schedule) => {
    if (!schedule) {
        return "Simple";
    }
    return schedule.trim().split(/\s+/).length === 5 ? "Cron" : "OnCalendar";
};

result = ((data && data.checks) || [])
    .filter((c) => !selectedIds.size || selectedIds.has(idOf(c)))
    .map((c) => ({
        ...c,
        id: idOf(c),
        name: c.name || c.slug || idOf(c),
        kind: kindOf(c.schedule),
        // The API returns tags as one space-separated string.
        tags: (c.tags || "").split(/\s+/).filter(Boolean),
    }));
