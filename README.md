# NepPay Architecture

An asynchronous orchestration layer over variant Nepali payment operators. The system core maintains state atomicity—treating third-party callback responses purely as operational signals, never as deterministic truths.

Built as a lightweight, low-latency engine designed to normalize transaction states across fragmented regional protocols.

## Technical Specifications

*   **Core Engine:** Rust / Axum pipeline
*   **State Persistence:** SQLite (Local-first write-ahead logging)
*   **Target Environments:** Native cross-platform binaries (Wails / Tauri)
*   **Client Interface:** React / Tailwind CSS (Minimal dark-mode aesthetic)

---

## State Machine Lifecycle

Transactions flow through a strict, decoupled state machine to protect ledger integrity against dirty reads or dropped network frames:
