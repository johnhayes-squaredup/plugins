Monitor your [OpenObserve](https://openobserve.ai) Cloud organization in SquaredUp — streams, log search, functions, and cluster health — via the [OpenObserve API](https://openobserve.ai/docs/reference/api/).

> ⚠️ This plugin covers **OpenObserve Cloud** only, and only the **Streams**, **Search**, **Functions**, and **Cluster** API areas — it does not cover self-hosted/on-prem OpenObserve, ingestion, dashboards, reports, or user management.

## Setup

You will need your OpenObserve **organization identifier** and an **Authorization key** — the full HTTP Basic Auth value for your organization.

1. Sign in to [OpenObserve Cloud](https://cloud.openobserve.ai) in the region your organization was created in.
2. Find your **organization identifier**: open **Data Sources** in the sidebar and copy it from the sample cURL command shown there — it's the path segment right after `/api/`.
3. Create a Service Account: go to **IAM → Service Accounts**, click **Add Service Account**, and give it a name. Copy the **token** shown immediately after creation — it is shown only once.
4. Build the **Authorization key**: base64-encode `<login identity>:<token>` — for a Service Account, the login identity is auto-generated as `<name>.<organization id, lowercase>@sa.internal` (not the plain name you typed), e.g.:
   ```
   echo -n "myaccount.myorgid@sa.internal:mytoken" | base64
   ```
5. Paste your region, organization identifier, and the resulting Authorization key into the fields below. The key is sent through exactly as entered — it is not re-encoded.

## Configuration fields

| Field | What it is | Where to find it | Required |
| ----- | ---------- | ----------------- | -------- |
| **Region** | Which OpenObserve Cloud region your organization lives in. | The URL you sign in at (`cloud.openobserve.ai`, `us2.openobserve.ai`, or `eu1.openobserve.ai`). | Yes |
| **Organization** | The organization identifier used in every API call. | OpenObserve Cloud → **Data Sources** → the sample cURL command's `/api/<organization>/...` segment. | Yes |
| **Authorization key** | The full base64-encoded `username:password`/`username:token` pair, sent unmodified as `Authorization: Basic <key>`. | Built from a Service Account's login identity + token (see Setup step 4). | Yes |

On save, the plugin validates these by fetching your organization's stream list; an invalid region, organization, or Authorization key fails setup with an authentication error.

## What this plugin monitors

<!-- finalized in Phase 9 -->

## Data streams

<!-- finalized in Phase 9 -->

## What gets indexed

<!-- finalized in Phase 9 -->

## Known limitations

<!-- finalized in Phase 9 -->
