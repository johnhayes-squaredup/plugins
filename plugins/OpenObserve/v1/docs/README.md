Monitor your self-hosted [OpenObserve](https://openobserve.ai) instance in SquaredUp — streams, log/metric/trace search, functions, pipelines, incidents, and cluster health — via the [OpenObserve API](https://openobserve.ai/docs/reference/api/).

> ⚠️ This plugin covers self-hosted OpenObserve only, and only the **Streams**, **Search**, **Functions**, **Cluster**, **Metrics**, **Traces**, **Pipelines**, and **Incidents** API areas — it does not cover OpenObserve Cloud, ingestion, dashboards, reports, or user management.

## Setup

You will need your OpenObserve instance's **URL**, **port**, **organization identifier**, and an **API Key** — the full HTTP Basic Auth value for that organization.

1. Sign in to your OpenObserve instance.
2. Find your **organization identifier** — `default` unless you created additional organizations.
3. Create a Service Account (or use an existing user's credentials): go to **IAM → Service Accounts**, click **Add Service Account**, and give it a name. Copy the **token** shown immediately after creation — it is shown only once.
4. Build the **API Key**: base64-encode `<login identity>:<token>` (or `<email>:<password>` for a regular user), e.g.:
   ```
   echo -n "myaccount@example.com:mytoken" | base64
   ```
5. Paste your instance URL, port, organization identifier, and the resulting API Key into the fields below. The key is sent through exactly as entered — it is not re-encoded.

## Configuration fields

| Field | What it is | Where to find it | Required |
| ----- | ---------- | ----------------- | -------- |
| **URL** | The base URL of your OpenObserve instance, including the scheme (e.g. `http://51.8.18.48`) — no trailing slash or port. | The address you use to sign in to OpenObserve. | Yes |
| **Port** | The port your OpenObserve instance listens on. | Defaults to `5080`, OpenObserve's standard port. | Yes |
| **Organization** | The organization identifier used in every API call. | Defaults to `default`; check **IAM → Organizations** if you use a different one. | Yes |
| **API Key** | The full base64-encoded `username:password`/`username:token` pair, sent unmodified as `Authorization: Basic <key>`. | Built from a Service Account's login identity + token, or a user's email + password (see Setup step 4). | Yes |
| **Ignore certificate errors** | Skips TLS certificate validation. | Enable only if your instance uses a self-signed certificate. | No |

On save, the plugin validates these by fetching your organization's stream list; an invalid URL, port, organization, or API Key fails setup with an authentication error.

## What this plugin monitors

- **Streams** — logs, metrics, and trace streams registered in your organization, with document counts, storage size, schema, and settings.
- **Search** — ad hoc SQL queries against a stream's raw log, metric, or trace records, and the most common values for chosen fields.
- **Metrics** — PromQL range queries against metrics ingested into OpenObserve.
- **Traces** — recent trace spans within a time range, for an individual trace stream.
- **Functions** — VRL data-transformation functions defined in the organization.
- **Pipelines** — data-transformation pipelines and their execution history.
- **Incidents** — alert incidents (groups of correlated alerts) and summary statistics.
- **Cluster health** — pending compaction jobs per region/node, for clustered OpenObserve deployments.

The out-of-the-box dashboards include an org-wide **Overview** plus a **Stream** perspective for drilling into an individual stream.

## Data streams

- **Streams** — streams of a chosen type (logs/metrics/traces), with name, document count, and size; account-wide. Backs import and is hidden from the tile editor.
- **Stream Details** — streams of a chosen type (logs/metrics/traces), with document counts, storage size, schema, and settings; account-wide.
- **Functions** — VRL functions defined in the organization; account-wide.
- **Search** — records matching a user-supplied SQL query against one stream; scoped to a stream.
- **Logs Search** — records matching a user-supplied SQL query against any log stream, without picking a stream first; account-wide.
- **Stream Field Values** — the most common values for chosen fields in one stream; scoped to a stream.
- **Traces Latest** — recent trace spans within a time range; scoped to a trace stream.
- **Metrics Query** — time series data matching a PromQL query; account-wide.
- **Pipelines** — data-transformation pipelines defined in the organization, with node/edge counts and last error; account-wide.
- **Pipeline History** — pipeline execution history within a time range; account-wide.
- **Incidents** — alert incidents, with status, severity, and timestamps; account-wide.
- **Incident Stats** — summary statistics for alert incidents; account-wide. May not be available on all self-hosted deployments (see Known limitations).
- **Cluster Info** — pending compaction jobs per region/node; account-wide. Only returns data on a clustered OpenObserve deployment (see Known limitations).

## What gets indexed

| Object type | API source | Represents |
| ----------- | ---------- | ---------- |
| **Stream** | `GET /api/{org}/streams` (called once per type: logs, metrics, traces) | A log, metric, or trace stream registered in the organization. |

## Known limitations

- **Cluster Info requires a clustered deployment** — on a standalone single-node OpenObserve instance (the common self-hosted setup) this endpoint returns a 404; the plugin surfaces this as a clear message rather than raw error, and no default dashboard tile uses it. Clustered deployments can add their own tile.
- **Incident Stats may not be available on your deployment** — this endpoint returned "Not Supported" on the instance this plugin was tested against, likely an edition/license gate; the plugin surfaces this as a clear message, and no default dashboard tile uses it.
- **Search and Logs Search require the stream name typed manually** — the SQL's `FROM` clause isn't auto-filled; default tiles ship with placeholder/example SQL that may need editing to match your streams.
- **Very broad search timeframes may exceed the platform's response size limit** — narrow the timeframe or reduce **Max rows** if a Search, Logs Search, or Traces Latest tile fails to load.
- **Pipeline History's time-range unit is unverified** — this plugin sends microseconds, matching every other timed endpoint in this plugin, but it couldn't be confirmed against real pipeline-run data; if the tile returns no rows despite a pipeline having run recently, this is worth rechecking.
- **Traces Latest only applies to trace-type streams** — it isn't included on the Stream perspective dashboard (which covers all three stream types); add it manually on a dashboard scoped to a trace stream.
- **Read-only** — the plugin never creates, modifies, or deletes anything in OpenObserve.
