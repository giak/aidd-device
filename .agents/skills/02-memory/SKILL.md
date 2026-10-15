---
name: Memory discipline
description: Mnemolite is canonical memory: search before asserting, write back with the command that establishes the fact, dedup, read back. Use when stating a fact this session has not established, or recording one. Not for repository rules, or what a command here already proves better.
---
## MEMORY

* Mnemolite is the canonical memory of facts, by MCP (`search_memory`;`read_memory`;`write_memory`;`update_memory`); the native tool before any curl fallback.
* `MEMORY != EVIDENCE`: a memory never replaces the protocol establishing the claim it carries.
* Memory first: search before asserting. A hit answers the claim being searched; it never replaces the command establishing the fact here.
* Write-back is systematic and never optional: an established fact, a defect, a decision or a measurement becomes a memory carrying the command establishing it, its date and its status, no stronger than the evidence allows.
* Keep `dedup_check` on; on `duplicate_warning`, update the existing id: never two memories for one fact.
* A memory the state contradicts is corrected at the source with `update_memory`, not argued in prose.
* A write-back is not done until read back; the read-back proves it, not the write answer.
* Mnemolite unavailable → `MNEMO_UNAVAILABLE`, said out loud; never claim persistence, never conclude from the web instead.
