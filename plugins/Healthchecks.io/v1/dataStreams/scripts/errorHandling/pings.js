// Healthchecks.io returns API errors as {"error": "..."}, but a URL that matches
// no route returns an HTML 404 page instead.
const apiMsg = data && typeof data === "object" && data.error;
const readOnlyMsg =
    "The ping log needs a Healthchecks.io read-write API key (read-only keys cannot read pings)";

// Read-only keys identify checks by a 40-character `unique_key`. The ping log
// route only accepts UUIDs, so those requests 404 rather than returning 401.
const object = context && context.objects && context.objects[0];
const rawId = object && (Array.isArray(object.rawId) ? object.rawId[0] : object.rawId);
const isReadOnlyId = typeof rawId === "string" && /^[0-9a-f]{40}$/i.test(rawId);

if (isReadOnlyId || response.status === 401 || response.status === 403) {
    result = readOnlyMsg + (apiMsg ? ": " + apiMsg : "");
} else if (response.status === 404) {
    result = "Check not found in Healthchecks.io (it may have been deleted)";
} else {
    result = apiMsg || "Request failed with HTTP " + response.status;
}
