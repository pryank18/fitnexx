# FitNexx — Product Spec

## Problem

Most strength training plans are fixed templates: the same prescribed weight and reps regardless of whether the last session actually hit target. Lifters who fall behind or ahead of the template have no built-in way for the plan to react, so progress tracking becomes a manual spreadsheet exercise, if it happens at all.

## Target user

People doing structured strength, hybrid, or conditioning/mobility training who want their program to adjust based on logged performance rather than follow a generic plan.

## Goals

- Let the training plan react to logged sets, not just prescribe them
- Make estimated 1-rep max (1RM) progress visible over time without manual calculation
- Keep the logging step light enough that people actually do it every session

## Non-goals (v1)

- Nutrition/diet tracking
- Wearable device integration
- Coach/trainer multi-client management

## Core features (v1 scope)

| Feature | Description |
| --- | --- |
| Set logging | Log working sets (weight, reps) per session |
| Load calculator | Derive estimated 1RM and training load from logged sets |
| Adaptive programs | Strength, hybrid, and conditioning/mobility plans that adjust week to week based on logged performance |
| Dashboard | Current stats, streaks, and program status in one view |
| Progress charts | Estimated 1RM and other trends over time |

## User stories

- As a lifter, I want to log a set quickly so tracking doesn't get skipped.
- As a lifter, I want my estimated 1RM to update automatically from logged sets.
- As a lifter, I want next week's plan to reflect what I actually lifted, not a fixed template.
- As a lifter, I want a dashboard that shows my current streak and program status at a glance.

## Status

Live — v1 is built and deployed at pryank18.github.io/fitnexx/, including the calculator, dashboard, logging, programs, and progress views.
