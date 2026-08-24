# Design: Du bist was du isst

Date: 2026-08-24

## Intent

Ship a free, public, modern web app that evaluates foods on an auditable biochemical matrix. No marketing equivalence. No sycophancy.

## Approach chosen

Single Vite + React + TypeScript static app with pure scoring functions and versioned TypeScript datasets. Chosen over a CMS or a live USDA proxy so formulas stay reproducible offline and tests can lock coefficients.

Rejected: (a) a notes-app retrofit with hardcoded HTML scores — not auditable; (b) a server that “asks an LLM for a nutrition score” — forbidden black box.

## Constraints honoured

- Incomplete plant protein vs complete animal protein
- Bioavailability inequality (iron, zinc, vitamin A)
- Plant-only advantages (fibre/phytochemicals) and animal-only compounds (B12, creatine, taurine, carnosine, EPA/DHA)
- Vitamin stability and residue risk as first-class axes
- Active vs passive carbohydrates
- Strict class separation (including fresh vs fermented crucifers; muscle subtypes; organs ≠ muscle)

## Surfaces

Primary matrix, food deep dive, compare, recommendation engine, methodology, non-claims, CSV/JSON export, dark/light, mobile-first.

## Success

Requirement-by-requirement evidence in tests + running UI, documented in the PR.
