---
title: Getting Started
description: A sample post showing the content format used by this Astro blog starter.
publishDate: 2026-01-01
tags:
  - guide
repositories:
  - technical
language: en
---

This sample post demonstrates the Markdown format used by the site. Replace it with your own writing or remove it when you are ready to publish.

## Frontmatter

Each post starts with YAML frontmatter containing a title, description, and publish date. Optional fields such as tags, categories, cover images, and draft status are defined in `src/content.config.ts`.

## Add a post

Create a Markdown or MDX file under `src/content/<year>/<category>/`. Keep post-specific images beside the post and reference them with relative paths.

For site identity, navigation, and social links, edit `src/site.config.ts`. See the project README for installation, local development, and deployment steps.
