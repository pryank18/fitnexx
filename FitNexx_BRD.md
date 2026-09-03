# FitNexx — Business Requirements Document

## Business objective

Give lifters a training platform where the program reacts to logged performance, differentiating from generic fixed-template training apps and spreadsheets.

## Background

Most lifters either follow a fixed program template or track progress manually in a spreadsheet. Both approaches leave the lifter to notice on their own when they're ahead of or behind the plan, and neither adjusts the next session automatically. FitNexx is built to close that gap.

## Scope

**In scope:** set logging, load/1RM calculation, adaptive programming (strength, hybrid, conditioning/mobility), dashboard, progress charts, and public-facing product pages (programs, method, pricing, FAQ).

**Out of scope:** nutrition/diet tracking, wearable integrations, coach/trainer multi-client management.

## Stakeholders

- **Primary user:** individual lifter following a structured program
- **Product owner:** Pryank Wadhera

## Go-to-market model

Positioned as a direct-to-consumer subscription product (pricing page implemented in the live demo), targeting lifters who currently use generic templates or spreadsheets.

## Success criteria

- Consistent session-logging behavior among active users
- Demonstrable estimated-1RM progress over an 8-week training block
- Retention of members from one program block into the next

## Assumptions

- Users are willing to log sets during or immediately after a workout
- Adaptive programming logic produces sessions users perceive as reasonable adjustments, not erratic ones

## Risks

- Logging friction: if logging a set takes too long, consistency drops and the adaptive-programming value proposition breaks down
- Programming logic risk: poorly tuned adjustments could push users too hard or too little, undermining trust in the "adaptive" premise

## Status

Live v1, built as a self-directed product project; pricing and public marketing pages are implemented but not yet validated with paying subscribers.
