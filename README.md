# FitNexx

FitNexx is a strength training product concept built around one idea: your training plan should react to the numbers you actually hit, not follow a generic template. The demo covers set logging, estimated 1RM and progress tracking; the adaptive engine that adjusts plans is specified in the PRD and not yet built.

## Live demo

https://pryank18.github.io/fitnexx/

## What it does

- **Set logging & load tracking** — log working sets and watch your estimated 1RM move over time
- **Programs** — strength, hybrid, and conditioning/mobility plans; adjusting them week to week from logged performance is designed in the PRD, not yet built
- **Calculator** — training-load and estimated-max calculations from logged lifts
- **Dashboard** — current stats, streaks, and program status in one view
- **Progress tracking** — charts showing strength gains over time
- **Programs, method, pricing, and FAQ pages** — public-facing marketing/product pages alongside the app

## Tech stack

Vanilla HTML, CSS, and JavaScript (`app.js`, `styles.css`), structured as a multi-page static site with separate app views (`app-dashboard.html`, `app-calculator.html`, `app-log.html`, `app-programs.html`, `app-progress.html`) plus marketing pages (`index.html`, `programs.html`, `method.html`, `pricing.html`, `faq.html`).

## Documentation

- [Product spec](docs/product-spec.md)
- [PRD](FitNexx_PRD.md)
- [BRD](FitNexx_BRD.md)
- [MRD](FitNexx_MRD.md)

## How it was built

Built by Pryank Wadhera. Product scope, requirements, and QA are mine.

## Status

Live demo — v1 built and deployed as a self-directed product project. Figures on the marketing pages are illustrative.
