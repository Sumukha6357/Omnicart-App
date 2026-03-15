---
description: Automated Test Generation and Strategy Selection
---

# Test Generation & Strategy Workflow (Phased Interactive Approach)

This workflow defines the testing strategy for a project, recommends specific test types based on project scale, and generates initial test suites.

## Phase 1: Landscape & Recommendation
1.  **Analyze Project Size**: Evaluate the codebase (LOC, number of modules, dependencies).
2.  **Scale-Up Check**: 
    - If the project has grown significantly (e.g., from Small to Large) since the last test generation, STOP. 
    - Ask the user: *"Scale-Up Detected: This project has grown substantially. Would you like to extend the testing stack to include E2E, UI, or Security testing?"*
    - If the user says "No", strictly stick to the existing categories.
3.  **Present Options**: Show the user the complete list of possible testing types (Unit, Integration, E2E, UI, Performance, Security).
4.  **Provide Recommendation**: Suggest a stack based on current size.
5.  **STOP**: Ask the user: *"Phase 1 Complete: Which testing categories would you like to initialize or generate for this project?"* **Wait for user input.**

## Phase 2: Generation (Respecting Bounds)
6.  **Active Category Selection**: Only generate tests for the specific categories the user explicitly approved. 
7.  **Configuration**: Store the "Active Test Categories" in the project's `features-and-services.md` or `mode.rules` to ensure the autonomous loop only runs these specific types.
8.  **Synthesize Tests**: 
    - Create test files based on the stack.
    - Ensure tests follow standard patterns.

## Phase 3: Initial Execution & High-Detail Report
9.  **Run Active Tests**: Execute ONLY the approved test categories. (e.g., if only Unit/Integration were approved, do NOT run E2E).
9.  **Generate Audit Report**: Provide a breakdown in the following format:
    - **Category Summary**: (e.g., Unit: 10/10 Passed, Integration: 3/5 Passed).
    - **Failure Map**: List specific failures and the module/file they occurred in.
    - **Bug Logging**: Automatically populate `bug-log.csv` for every failure.
10. **Final Feedback**: Report completion and transition to autonomous monitoring mode.
