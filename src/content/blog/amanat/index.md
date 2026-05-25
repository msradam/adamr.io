---
title: "Amanat: Privacy-First Data Governance for Humanitarian NGOs"
description: "An agent that connects to OneDrive, Slack, and Outlook via Auth0 Token Vault, scans for exposed beneficiary data, and remediates it. Granite 4 Micro runs locally so data never leaves the device. Auth0 Authorized to Act hackathon, 3rd place."
date: 2026-04-07
topic: "ai-infra"
tags:
  - ai
  - agents
  - privacy
  - humanitarian
  - auth0
---

_Originally published on [Devpost](https://devpost.com/software/amanat-data-governance-ai-agent) as my submission to the Auth0 [Authorized to Act hackathon](https://authorizedtoact.devpost.com/) (3rd place). Devpost is the original host; this is a mirror._

---

Amanat connects to your OneDrive, Slack, and Outlook through Auth0 Token Vault, scans for sensitive beneficiary data that's been overshared or exposed, and helps fix it. Token Vault handles multi-service credential management so the agent acts across all three without storing raw tokens. IBM Granite 4 Micro runs the analysis locally, so beneficiary data never leaves the device. For organizations handling refugee case files and GBV reports, you need both of those things or the tool is unusable.

_Amanat_ (Arabic: trust, stewardship), the concept that what is entrusted to you must be protected and returned faithfully.

## Demo

<div class="yt-embed">
  <iframe src="https://www.youtube.com/embed/99-y8O-aOuY" title="Amanat: Data Governance AI Agent" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

The 3-minute demo video shows Amanat running locally against my personal Microsoft 365 and Slack accounts, connected via Auth0 Token Vault. The OneDrive folders, Outlook inbox, and Slack workspace are real accounts populated with synthetic humanitarian data from the Waqwaq scenario. All scans, remediations, CIBA step-up auth, and alerts execute live against the Microsoft Graph and Slack APIs.

**Slack scan: PII detected across public channels, alerts posted automatically**

![Slack scan finds beneficiary names, case numbers, GPS coordinates, and medical data in three public channels. Alerts posted to each channel. File attachment scanned and flagged.](https://raw.githubusercontent.com/msradam/amanat/main/assets/screenshots/03_slack_scan_summary.png)

**Redaction: 47 PII instances removed, clean copy uploaded to OneDrive**

![Agent redacts all PII from the displaced persons registry and uploads a redacted copy to the same OneDrive folder. Original file untouched. Slack notification sent.](https://raw.githubusercontent.com/msradam/amanat/main/assets/screenshots/05_redaction_result.png)

**Policy RAG: ICRC Handbook cited on biometric data retention**

![Agent retrieves ICRC rules on special-category data retention, determines the biometric enrollment log violates the 6-month retention window, recommends deletion.](https://raw.githubusercontent.com/msradam/amanat/main/assets/screenshots/08_policy_rag_icrc.png)

**CIBA step-up auth: Guardian push notification for destructive actions**

![Agent sends Guardian push via CIBA before revoking sharing. Shows auth_req_id, binding message, and CIBA token on approval.](https://raw.githubusercontent.com/msradam/amanat/main/assets/screenshots/ciba1.png)

The published app at https://msradam-amanat.hf.space uses IBM watsonx.ai to host the same Granite 4 model that runs locally via llama-server in the video demo. watsonx is used here for deployment convenience (GPU inference without self-hosting), but the architecture is identical: Strands agent with tool calling, same system prompt, same 14 tools.

### Auth0 Features Used

| Feature                               | How Amanat Uses It                                                                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Universal Login**                   | Single sign-on with Guardian MFA push notifications                                                                                            |
| **Token Vault (Connected Accounts)**  | Federated token exchange for OneDrive, Slack, Outlook. Per-service scoping. MRRT across My Account API and all providers                       |
| **CIBA (Backchannel Authentication)** | Guardian push to user's phone before revoking sharing or deleting files. `POST /bc-authorize` with binding message. Agent polls until approved |
| **Guardian MFA**                      | Push notifications for both login MFA and CIBA step-up auth on destructive actions                                                             |

## Inspiration

In 2021, UNHCR collected biometric data (fingerprints and iris scans) from 830,000 Rohingya refugees in Bangladesh. The refugees were told registration was required to receive food. What they weren't told was that their data would be shared with the Myanmar government, the very regime they had fled. Some discovered their names on Myanmar's repatriation lists. Biometric data is immutable. Once shared, it can never be taken back (Human Rights Watch, 2021).

Nobody hacked UNHCR. The data was shared through internal processes, on shared drives, with default settings that nobody reviewed. A governance failure.

This keeps happening. In 2016, the UN's Office of Internal Oversight Services found that three of five UNHCR missions they investigated had shared refugees' personal data with host governments without assessing data protection. In January 2022, attackers exploited an unpatched vulnerability to access personal data of 515,000 people in the ICRC's Restoring Family Links programme. The attackers were inside for 70 days before anyone noticed. The programme had to be shut down entirely (ICRC, 2022).

Humanitarian organizations handle refugee case files, GBV incident reports, biometric enrollment logs, medical records of displaced persons. And field teams routinely store this data on cloud services with default sharing settings. A GBV report shared with "anyone with the link." Case numbers posted in public Slack channels. Beneficiary names and HIV status in a donor report email.

The ICRC published a 400-page Handbook on Data Protection in Humanitarian Action. The IASC published Operational Guidance on Data Responsibility. The Sphere Standards include Protection Principles. The policy documents exist. Nobody has built software that enforces them. A CyberPeace Institute study found that 41% of NGOs had been attacked in the past three years, only 4% had actionable cybersecurity policies, and 56% had no cybersecurity budget at all (CyberPeace, 2024).

I built Amanat to fill that gap.

## What It Does

You log in through Auth0, connect your OneDrive, Slack, and Outlook via Token Vault, and tell the agent what to look for. It scans your files, messages, and emails for PII, checks what's publicly shared, cites the relevant ICRC or GDPR section, and can revoke sharing links or redact files on the spot.

UNHCR deployed Microsoft 365 across its field operations, making OneDrive and Outlook the default file storage and email for the world's largest refugee agency. WFP, UNICEF, and dozens of implementing partners followed. Slack became the coordination layer. Sensitive data flows across all three every day, and nothing watches the gap between them. Amanat connects to all three via Token Vault because that's where the data actually is.

### Capabilities

| Capability                 | Description                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-service scanning** | Recursively crawls OneDrive folders, searches Slack messages and file attachments, scans Outlook emails                               |
| **Hybrid PII detection**   | Two-layer: deterministic regex for structural patterns + Granite 4 Micro for contextual/multilingual extraction                       |
| **Policy grounding**       | RAG pipeline with BM25 retrieval over 1,059 chunks extracted from actual ICRC Handbook, IASC Guidance, GDPR, and Sphere Handbook PDFs |
| **Remediation**            | Revoke sharing links, redact PII for safe sharing, download before delete, generate DPIAs, check consent documentation                |
| **CIBA step-up auth**      | Destructive actions trigger a Guardian push notification via CIBA; user approves on their phone before the agent proceeds             |
| **Document parsing**       | Upload scanned PDFs/DOCX/XLSX; Docling with granite-docling-258M VLM extracts text via OCR, then scans for PII                        |
| **Slack alerting**         | Posts data protection warnings to channels where PII leaks are detected                                                               |
| **Encrypted audit trail**  | Every scan and remediation action logged, encrypted at rest with Fernet/PBKDF2                                                        |

### Tools

14 functions the agent can call: `scan_files`, `search_messages`, `detect_pii`, `check_sharing`, `revoke_sharing`, `redact_file`, `download_file`, `delete_file`, `retention_scan`, `generate_dpia`, `check_consent`, `notify_channel`, `send_email`, and `parse_document`.

The demo uses a fictional humanitarian scenario, Post-Cataclysm Waqwaq, where the Waqwaq Relief Authority responds to a displacement crisis on a fictional archipelago. The setting is fictional but the data governance patterns are real. All synthetic demo data is committed to the [GitHub repo](https://github.com/msradam/amanat/tree/main/demo-data/drive).

## How I Built It

Full technical breakdown in [ARCHITECTURE.md](https://github.com/msradam/amanat/blob/main/ARCHITECTURE.md). Key sections below.

### Auth0 Integration

The user authenticates once via Auth0 Universal Login, then connects each service separately through Connected Accounts. Each connection is its own OAuth consent screen, so the user sees exactly which permissions they're granting. Amanat exchanges Auth0 refresh tokens for service-specific access tokens via federated token exchange:

```
POST /oauth/token
grant_type=urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token
subject_token={refresh_token}
subject_token_type=urn:ietf:params:oauth:token-type:refresh_token
requested_token_type=http://auth0.com/oauth/token-type/federated-connection-access-token
connection=microsoft-graph
```

The agent calls Microsoft Graph and Slack APIs on behalf of the user without ever storing raw service credentials. A single Multi-Resource Refresh Token (MRRT) works across both the My Account API and all connected services.

I chose Refresh Token Exchange over Privileged Worker Exchange deliberately: Amanat always acts with the user present in the chat session, never async. The user watches each tool call happen, sees the results, and approves destructive actions in real time.

Any call to `revoke_sharing` or `delete_file` triggers a step-up authentication via CIBA. The agent sends a Guardian push notification to the user's phone with a binding message describing the specific action (e.g. "Amanat: revoke sharing GBV_Incident_Reports"). The agent pauses and polls until the user approves or denies on their phone. Without this, a chatbot could delete a GBV file because someone typed "yes" in the conversation.

### Hybrid PII Detection

PII detection follows the two-layer hybrid architecture described in "An Evaluation Study of Hybrid Methods for Multilingual PII Detection" (2025), which found hybrid approaches outperform fine-tuned NER by 82% and zero-shot LLMs by 17% in weighted F1.

```
Layer 1: Regex (deterministic)  → structural PII: phone numbers, emails,
                                  case IDs, GPS coordinates, medical terms.
                                  Fast, zero false negatives on known patterns.

Layer 2: Granite 4 Micro (LLM)  → contextual PII: names in any script,
                                  implicit identifiers ("the 15-year-old in
                                  Vakwa Shelter"), age+location combos that
                                  identify specific individuals.
```

The LLM layer caught "15-year-old girl in Vakwa Shelter Section 2" as an implicit identifier: age + gender + specific shelter location identifies a person without naming them. Regex cannot express this.

### Policy RAG Pipeline

Policy grounding uses real documents, not paraphrases. Source PDFs (17.3 MB): the ICRC Handbook, IASC Operational Guidance, GDPR full text, and the Sphere Handbook. IBM Docling parses them into structured markdown, split into 1,059 chunks. BM25 ranking retrieves the top chunks, formatted in Granite 4's native `<documents>` RAG format. The query "Can we share biometric data with host governments?" retrieves ICRC Handbook Chapter 4.2, 8.2.1, and 8.2.4, the same sections a data protection officer would consult.

### Why IBM Granite 4 Micro

Granite 4.0 Micro is a 3B-parameter model under Apache 2.0, the first open-source LLM family to achieve ISO 42001 certification. Apache 2.0 means no licensing barriers for NGOs. The 3B footprint runs in ~4GB RAM via llama.cpp quantization, deployable on a laptop in a field office with no GPU, cloud, or internet. ICRC data protection rules (Articles 23-24) impose strict conditions on transferring personal data to third-party processors. Sending beneficiary data to a commercial LLM API creates a third-party processing relationship that is difficult to justify. A local model eliminates the question: the data never leaves the device.

## Challenges I Ran Into

**Slack OAuth v2 + Auth0 generic oauth2 strategy.** Slack's v2 OAuth uses `user_scope` as a separate parameter from `scope`, but Auth0's generic oauth2 connection only sends `scope`. I could not get write scopes through Token Vault. Solution: separate read and write credentials. Token Vault handles reads (user token); a separate Slack bot token handles writes (posting alerts as "Amanat"). The separation is actually the right architecture: alerts should come from the bot identity, not impersonate the user.

**Granite Micro and vague queries.** A 3B model requires explicit tool-routing instructions. I added routing rules to the system prompt and query expansion for common shorthand.

**PII detection for non-Latin scripts.** The initial regex caught English-style names but missed Arabic, Bengali, and Burmese names, exactly the populations humanitarian organizations serve. The hybrid regex + LLM architecture handles multilingual and contextual PII that regex cannot express.

## What I Learned

**Token Vault is the right abstraction for multi-service agents.** One authentication event, per-service scoped tokens, automatic refresh, user-controlled consent. The agent never stores raw credentials.

**Small models are sufficient when tools are deterministic.** Granite 4 Micro (3B) reliably handles tool routing, policy analysis, and report generation. If you ask the LLM to detect PII directly, it hallucinates. Deterministic regex for structural patterns, LLM only for contextual extraction where it adds value.

**Humanitarian data governance is a software problem, not a policy problem.** All the policy documents exist. Nobody has built software that enforces them across the cloud services field teams actually use.

**Agent authorization needs a consent model on top of the auth model.** The hard question wasn't "how do I get a token." It was "when should the agent be allowed to act?" Scanning is read-only, fine. Revoking a sharing link on a GBV file has real consequences. CIBA gives the agent proper step-up auth without building a custom approval flow.

## Why This Matters Beyond the Demo

Enterprise DLP tools (Varonis, Microsoft Purview, Symantec DLP) cost $5,000 to $50,000 per year and require dedicated security teams to configure. They're built for corporations, not field offices where 56% of NGOs have no cybersecurity budget. Amanat is free, open-source, runs on a laptop, and is grounded in the specific policy frameworks humanitarian organizations already follow (ICRC, IASC, Sphere, GDPR). The entire stack is Apache 2.0 or MIT licensed and containerizable for offline deployment in connectivity-constrained environments.

## Links

- [GitHub Repo](https://github.com/msradam/amanat)
- [Architecture Doc](https://github.com/msradam/amanat/blob/main/ARCHITECTURE.md)
- [Synthetic Demo Data](https://github.com/msradam/amanat/tree/main/demo-data/drive)
  </content>
