# Vue 3 Remote Data Composable with Effect‑TS

A small example showing how to build a reusable Vue 3 composable for loading remote data with [Effect‑TS](https://effect.website/) and [Effect Schema](https://effect.website/docs/schema/introduction/). It handles all the common states—`NotAsked`, `Loading`, `Success`, and `Failure`—and integrates network errors, JSON parsing errors, and schema validation errors into a single, type‑safe API.

## Features

- ✅ **Zero-boilerplate** remote-data state management
- 🚀 Built on top of **Effect‑TS** for powerful effectful workflows
- 🛡️ Automatic **schema validation** with `effect/Schema`
- 🔄 Built‑in `_tag`‑based union for easy UI branching
- 🔄 `load`, `reset` actions exposed from the composable
