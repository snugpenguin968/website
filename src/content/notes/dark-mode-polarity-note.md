---
title: "True-positive luminance in dark mode"
publishedAt: 2026-11-20
tags:
  - css
  - accessibility
---

Applying `filter: invert(1)` to a monochrome dithered photo in dark mode turns shadows bright and highlights dark, creating a photographic negative. Rendering a separate dark-mode ink mask where bright pixels emit light ink over `#050505` keeps faces immediately recognizable in both themes.
