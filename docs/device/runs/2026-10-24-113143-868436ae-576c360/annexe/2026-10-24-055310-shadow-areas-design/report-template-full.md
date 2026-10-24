---
source: docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md
generated_at: 2026-10-24T05:53:10Z
# status: clean
---

# Shadow Areas Report

Source: `docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md`
Generated: 2026-10-24T05:53:10Z

Total gaps: 4 | Blocker: 1 | Major: 3 | Minor: 0

---

## Warnings

---

## Gaps by Category

### unstated assumption

**[major]** What happens when the upstream service returns 429 with no Retry-After header?

### missing failure mode

**[major]** What should the system return to the caller when the payment provider responds with a timeout?

### missing actor

**[major]** Who is responsible for approving the access request before it is acted on?

### missing acceptance criterion

**[blocker]** Does the 10 MB file-size limit apply to each individual file in a multi-file upload or to the combined total?