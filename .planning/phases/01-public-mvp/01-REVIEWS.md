---
phase: 01
reviewers: [gemini, codex]
reviewed_at: 2026-06-13T10:30:00-05:00
plans_reviewed: [01-PLAN.md]
skipped: claude (runtime independence — executing inside Claude Code)
---

# Cross-AI Plan Review — Phase 01 (Sitio Publico MVP)

## Gemini Review

I have analyzed the **Phase 1: Sitio Público MVP** implementation plan for the Doctora Maria Bernarlda project. The plan is exceptionally well-structured, prioritizing data minimization, professional ethics, and technical rigor within the Colombian medical context. The "Placeholder Gate" mechanism is a standout feature for ensuring that no unverified medical claims or fictional data reach production, which is critical for a high-stakes professional profile.

### 1. Summary
The plan is highly robust and perfectly aligned with the "Privacy-First" and "Free-First" constraints. By separating content from components and implementing a strict validation script for production builds, the strategy effectively mitigates the risk of publishing unapproved medical information. The dependency ordering is logical, and the focus on accessibility (WCAG 2.2 AA) and performance ensures a professional user experience. The inclusion of a specific "Task 8" as a hard production gate is an industry-best practice for medical sites where legal compliance and credential verification are mandatory.

### 2. Strengths
- **Production Gate Logic:** The distinction between `build:preview` (tolerant) and `build:production` (intolerant) for placeholders is an excellent safety mechanism.
- **Data Minimization:** Explicit exclusion of forms, cookies, and analytics scripts directly addresses PRV requirements and reduces the legal surface area in Colombia (Habeas Data).
- **Technical SEO & Accessibility:** Early integration of `axe-core`, Lighthouse CI, and structured data (conditional on credentials) ensures the foundation is built correctly from Task 1.
- **Security Headers:** Proactive configuration of CSP and Referrer-Policy for a static site demonstrates a "secure by default" mindset.
- **Content Approval Workflow:** Task 2 and Task 8 explicitly tie implementation to "Approved" status and "Evidence," ensuring medical claims are backed by the doctor's authority.

### 3. Concerns
- **[MEDIUM] Hosting-Specific Headers:** While `public/_headers` is planned for Cloudflare Pages, the plan doesn't explicitly mention `_routes.json` or handling of 404 redirects in a static context to prevent crawl errors during the transition from placeholders to real pages.
- **[MEDIUM] Legal Disclaimer Visibility:** In the Colombian context (Ley 23 de 1981), medical advertising is strictly regulated. The plan should ensure that the "not a diagnostic tool" warning is not just a hidden meta tag but a persistent or highly visible footer/header element on all service pages.
- **[LOW] Asset Optimization:** Task 3 mentions temporary graphic composition. Heavy temporary assets could impact performance goals (WEB-05) if not processed through an Astro image optimization pipeline early on.
- **[LOW] Node Versioning:** Task 1 mentions compatible versions but doesn't explicitly state the requirement for an `.nvmrc` or `engines` field in `package.json` to ensure CI/CD parity with local development.

### 4. Suggestions
- **Add "Health Check" Route:** Include a hidden `src/pages/version.astro` or similar that outputs the build timestamp and status of `CONTENT-INVENTORY.md` for easy verification of the production artifact version.
- **Schema.org Refinement:** Specifically use `MedicalBusiness` or `Physician` schema but ensure the `medicalSpecialty` property is only populated after Task 8 credential verification.
- **Pre-submission Audit:** Add a step in Task 8 to run `npm audit` specifically on the production lockfile to ensure no last-minute supply chain vulnerabilities were introduced.
- **Language Attribute:** Ensure the `lang="es"` attribute is set in `BaseLayout.astro` to meet WCAG and SEO requirements for a Colombian audience.

### 5. Risk Assessment
**Overall Risk: LOW**
The plan is conservative, safe, and technically sound. The primary risk is not technical failure, but rather the "blocking" nature of Task 8; if the doctor is slow to provide credentials or approved text, the deployment will remain halted. However, this is an intentional and positive risk for a medical project. The use of Astro and Cloudflare Pages (static) effectively eliminates the largest categories of web security risks.

---

## Codex Review (gpt-5.5)

### 1. Summary
The plan has a strong privacy-first architecture and is suitable for building a local reviewable preview. However, it is **not yet safe for production execution**. The largest gaps are that the production gate can be bypassed by hardcoded content or manually altered approval fields, and there is no complete Cloudflare Pages deployment, rollback, or deployed-artifact verification workflow. Several stated requirements — including locations, hours, alternative contact, approval evidence, and production rollback — are not fully implemented by the eight tasks.

### 2. Strengths
- Static Astro architecture substantially reduces attack surface and visitor-data exposure.
- Clear exclusion of forms, storage, analytics, diagnosis, automation, and patient portals.
- Preview and production modes allow development without inventing missing information.
- Blocking unresolved dependencies with high-severity vulnerabilities is appropriate.
- Disabled CTAs and omission of unverified credentials reduce misleading publication risk.
- Accessibility, performance, SEO, security headers, and testing are included early.
- Explicit human approval, legal review, and security gates are recognized.
- System fonts and no personal photography provide a lightweight, privacy-conscious starting point.

### 3. Concerns
- **[HIGH] Production gate is bypassable.** The validator trusts editable fields such as `status`, `source`, and `blocksProduction`. A developer could mark unapproved content as approved or set `blocksProduction: false` without valid human evidence.
- **[HIGH] Hardcoded content can bypass validation.** The validator covers structured content files, but the plan does not prevent medical claims, contact information, metadata, or schema from being hardcoded directly into Astro components.
- **[HIGH] Cloudflare Pages production controls are missing.** No task defines production branch restrictions, mandatory `build:production` command enforcement, deployment permissions, preview behavior, or prevention of automatic deployment from an unsafe build command.
- **[HIGH] No deployed-site verification or rollback procedure.** Security headers, redirects, CSP, sitemap behavior, and the production artifact must be tested against the actual Cloudflare deployment. Rollback is mapped to Task 8 but has no implementation steps.
- **[HIGH] Content approval workflow is incomplete.** `status` and `source` are insufficient for medical content. The plan lacks `approvedBy`, approval date, evidence reference, content version/hash, revocation handling, and a rule invalidating approval after content changes.
- **[MEDIUM] Locations and hours are underplanned.** Required by WEB-01, but no dedicated structured content files, page sections, validation rules, or tests are listed.
- **[MEDIUM] Alternative contact failure behavior is unclear.** The plan tests disabled CTAs but does not define when a channel is considered unavailable or guarantee that a validated alternative channel is visible.
- **[MEDIUM] Placeholder validation lacks edge cases.** Missing rules include invalid JSON, unknown IDs, duplicate IDs, whitespace-only values, invalid URLs, dangerous URI schemes, missing evidence, invalid status transitions, and unregistered placeholders.
- **[MEDIUM] CI security is incomplete.** No least-privilege workflow permissions, pinned GitHub Action versions or SHAs, secret scanning, dependency update policy, branch protection, or deployment credential handling.
- **[MEDIUM] Lighthouse CI cannot directly prove field INP.** Lab testing provides indicators, but the plan should define an acceptable lab proxy or defer real INP validation until privacy-approved field measurement exists.
- **[MEDIUM] Accessibility validation is too general.** Axe and keyboard testing alone will not demonstrate screen-reader usability. A manual screen-reader/browser matrix and evidence are needed.
- **[MEDIUM] Privacy scope ends at the website boundary.** Clicking email, telephone, maps, or messaging channels transfers the visitor to third parties where they may disclose health information. Contact warning and operational response procedure need explicit approval and testing.
- **[MEDIUM] Task 6 occurs too late.** CI should be introduced immediately after the project foundation and expanded throughout implementation, not added after most functionality exists.
- **[LOW] Missing explicit custom 404 page and broken-link validation.**
- **[LOW] No explicit HTML, structured-data, or sitemap standards validation.**
- **[LOW] Tasks 3, 4, and 7 are broad enough to make completion and evidence tracking ambiguous.**

### 4. Suggestions
- Make structured content the exclusive source for all public claims, metadata, contact details, and schema. Add a CI check that detects forbidden hardcoded claims.
- Replace mutable approval flags with an approval manifest containing `contentId`, `contentHash`, `approvedBy`, `approvedAt`, `evidenceRef`, and optional expiry or revocation status.
- Make production validation reject unknown fields, unregistered placeholders, missing evidence, malformed URLs, unsafe schemes, and changed content whose approval hash no longer matches.
- Add structured files and tests for locations, hours, alternative contact, privacy responsibility, and operational warnings.
- Move baseline CI setup directly after Task 1, then extend it incrementally.
- Add a dedicated **Cloudflare Deployment and Rollback** task covering: mandatory `npm run build:production`, production-branch protection, least-privilege deployment credentials, preview vs. production configuration, post-deployment smoke/header/SEO/privacy tests, and rollback rehearsal.
- Verify CSP and all security headers against the deployed response, not only `public/_headers`.
- Add GitHub Actions hardening, secret scanning, dependency update policy, and branch protection verification.
- Define a manual accessibility matrix using at least one screen reader, keyboard-only navigation, mobile viewport, reduced motion, and high zoom.
- Add a traceability matrix linking every requirement to implementation task, test, evidence artifact, and final result.
- Split Task 8 into separate **content approval**, **legal/privacy authorization**, and **production release** gates.
- Record the legal reviewer's decision on external contact channels, privacy notices, professional claims, and handling of messages containing health or children's data per SIC (Colombia data-protection authority) guidance.

### 5. Risk Assessment
**Overall Risk: HIGH.** The static, no-storage architecture is inherently low risk, but the current production and approval controls are not robust enough to prevent accidental publication of unapproved medical claims or an unsafe Cloudflare deployment. After closing the production-gate bypasses, deployment controls, approval evidence, and rollback gaps, the residual implementation risk should fall to MEDIUM or LOW.

---

## Consensus Summary

Phase 01 reviewed by 2 AI systems (Gemini, Codex/gpt-5.5). Note: reviewers diverged significantly on overall risk assessment.

### Agreed Strengths
- Static Astro architecture is the right choice — eliminates server-side attack surface
- Preview/production split with placeholder gate is well-conceived
- Data minimization and exclusion of forms/analytics/storage is strong
- Security headers (CSP, Referrer-Policy) proactive for a static site
- Accessibility (WCAG AA) and performance targets included from the start

### Agreed Concerns
- **[MEDIUM — both] Disclaimer visibility:** Warning about not sending clinical information must be a persistent visible element, not just metadata (Gemini: Ley 23/1981; Codex: operational procedure gap)
- **[MEDIUM — Codex, implied Gemini] CI/CD completeness:** Cloudflare Pages deployment controls, branch protection, and post-deployment verification are underspecified

### Divergent Views
- **Overall risk:** Gemini assessed LOW risk; Codex assessed HIGH risk. The divergence stems from Codex examining the *robustness of the approval mechanism* (bypassable flags, no content hashing, no `approvedBy`) while Gemini focused on *architectural soundness*. Both perspectives are valid — the architecture is sound but the approval enforcement is weak.
- **Approval workflow:** Gemini considered Task 2 + Task 8 sufficient; Codex found them fundamentally insufficient without a tamper-evident approval manifest.
- **Deployment task:** Gemini did not flag missing deployment task; Codex flagged it as HIGH (no branch protection, no rollback procedure, no post-deploy verification).

### HIGH Concerns Requiring Resolution Before Implementation

All 5 raised by Codex — none raised by Gemini:

1. **Production gate bypassable** — `blocksProduction` is a mutable field; needs external enforcement or approval manifest with content hash
2. **Hardcoded content bypass** — plan needs CI check preventing medical claims hardcoded in `.astro` files
3. **Cloudflare Pages deployment controls absent** — needs dedicated task: branch protection, build command enforcement, preview vs. production separation
4. **No rollback procedure** — Task 8 references rollback but provides no steps; needs rehearsal and evidence
5. **Approval workflow insufficient for medical content** — needs `approvedBy`, `approvedAt`, `evidenceRef`, `contentHash`; revocation handling
