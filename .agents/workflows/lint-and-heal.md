---
description: Self-Healing Code and Linting Loop
---

# Self-Healing Code/Linting Loop

1. Identify the project's linter or formatter command based on the tech stack (e.g., `npm run lint`, `eslint .`, `flake8`, `cargo clippy`, etc.).
2. Execute the linting/formatting command.
3. Parse the output for all warnings and errors, identifying the specific files and line numbers.
4. Auto-apply fixes to the codebase using the appropriate file editing tools to resolve the identified issues.
5. Re-run the linter/formatter to verify the fixes were successful.
6. Repeat the process iteratively until 0 warnings/errors remain, or until a maximum of 3 iterations is reached to prevent infinite loops.
7. Once clean, append a summary of all auto-remediated linting issues to `c:/Proj/ai-governance/projects/[CATEGORY]/[PROJECT_NAME]/change-log.md`.
