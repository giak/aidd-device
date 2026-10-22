<system-reminder>
Use the `plan` skill to create a phased implementation plan. The skill's `actions` table shows the workflow:
1. `gather` - Collect and restate the source (user request)
2. `explore` - Read the codebase for projection, rules, feasibility
3. `wireframe` - Sketch a screen at low fidelity (frontend only)
4. `plan` - Break into phases, write the plan and phase files

The skill explicitly states: "Never writes code" - it creates documentation plans, not actual code. Use this skill to:
- Document the implementation process
- Create phase-specific documentation
- Plan UI/UX improvements
- Outline technical requirements

The skill's assets include templates for:
- `plan.md` (project plan)
- `phase-template.md` (per-phase documentation)

This skill is for planning, not direct code implementation. The actual code implementation would require a different skill or tool.
</system-reminder>