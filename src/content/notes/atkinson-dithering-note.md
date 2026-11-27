---
title: "Why Atkinson dithering works so well for portraits"
publishedAt: 2026-11-27
tags:
  - graphics
  - design
---

Unlike Floyd–Steinberg, which diffuses 100% of quantization error to neighboring pixels, Bill Atkinson's algorithm intentionally discards 25% of the error (diffusing only `6/8`). That slight loss boosts local contrast in midtones and keeps highlights airy — ideal for human portraits on minimalist monochrome pages.
