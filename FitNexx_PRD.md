# FitNexx — Product Requirements Document

## Summary

FitNexx is a strength training platform where the program adjusts based on what a lifter actually logs, rather than following a fixed template regardless of performance.

## Target users

- **Primary:** individual lifters running structured strength, hybrid, or conditioning/mobility programs who want progress tracked automatically
- **Secondary:** lifters currently using a spreadsheet template who want their plan to react to logged performance

## Problem statement

Generic training templates don't account for what a lifter actually hits in a session. Estimating 1RM progress and adjusting the next session's load is left to the lifter to calculate manually, which most people don't keep up consistently.

## Functional requirements

1. **Set logging** — log weight and reps per working set, per session
2. **Load calculator** — derive estimated 1RM and training load from logged sets
3. **Adaptive programming** — strength, hybrid, and conditioning/mobility plans that adjust week to week based on logged performance
4. **Dashboard** — current stats, streak, and program status in one view
5. **Progress charts** — estimated 1RM and other trends visualized over time
6. **Program/method/pricing/FAQ pages** — public-facing pages describing the offering

## Out of scope (v1)

- Nutrition or diet tracking
- Wearable device integration
- Coach/trainer multi-client management

## Success metrics

- Session-logging consistency (sessions logged vs. sessions planned)
- Measurable estimated-1RM progress over an 8-week block
- Retention across program blocks (member continues into the next block)

## Status

Live at pryank18.github.io/fitnexx/, with the calculator, dashboard, logging, programs, and progress views implemented.
