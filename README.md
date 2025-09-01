# FilecoinVault — Onchain Verifiable Data Vault

A backend-powered service that lets users/dApps upload **encrypted documents** to **Filecoin**, then registers the resulting **CID** on-chain for public, tamper-evident verification. Third parties can verify authenticity without accessing private contents.

> **Wave 1 focus:** product design + architecture docs (no fully working demo required yet).

---

## Table of Contents
- [Problem](#problem)
- [Solution & Value Proposition](#solution--value-proposition)
- [Why Filecoin Onchain Cloud](#why-filecoin-onchain-cloud)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Module Breakdown](#module-breakdown)
- [API (Wave 1 draft)](#api-wave-1-draft)
- [Smart Contract Interface (MVP)](#smart-contract-interface-mvp)
- [Security & Privacy](#security--privacy)
- [GTM & Cohort Alignment](#gtm--cohort-alignment)
- [Wave Plan & Roadmap](#wave-plan--roadmap)
- [Local Setup (placeholder)](#local-setup-placeholder)
- [Repo Structure (suggested)](#repo-structure-suggested)
- [Contribution](#contribution)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Problem
Sensitive records (IDs, academic certificates, compliance documents, medical/financial proofs) are usually stored on centralized servers—creating risks of tampering, data loss, vendor lock-in, and unverifiable claims. Blockchains store hashes, but there’s no simple, privacy-preserving, **verifiable** storage + verification workflow that non-crypto users can trust.

## Solution & Value Proposition
**FilecoinVault** provides:
- **Permanent, decentralized storage** of encrypted documents on Filecoin, returning a verifiable **CID**.
- **On-chain registry** that records `{CID, uploaderAddress, timestamp}` to prove existence and integrity.
- **Simple verification** endpoints so third parties can confirm authenticity **without** reading the document.

**Who benefits**
- **Universities & employers:** verify certificates and credentials.
- **Enterprises & fintechs:** verify KYC/AML artifacts and audit documents.
- **Healthcare & insurance:** verify claims and medical attestations.
- **Developers:** embed verifiable storage in apps via a clean API.

## Why Filecoin Onchain Cloud
- **Decentralized, permanent storage** for critical records.
- **Retrieval** pathways for authorized access to encrypted assets.
- **Payments/deal handling** (future waves) for sustainable storage economics.
- **Synapse/workflow orchestration** (future waves) to automate upload → register → notify flows.

> Wave 1 documents the design and integration points. Deeper module usage (e.g., Synapse, payments flows) lands in later waves.

---

## Architecture
  
> Recommended directory: `docs/diagrams/`

### 1) System Flow (High Level)
![System Flow](./docs/diagrams/filecoinvault-system-flow.jpeg)

**Narrative:** User (or dApp) uploads a file → Backend encrypts & pushes to Filecoin → Filecoin returns **CID** → Backend registers CID in the **Registry Smart Contract** with uploader and timestamp → Verifiers query the contract/API to check authenticity.

### 2) Component Architecture
![Component Architecture](./docs/diagrams/filecoinvault-components.jpeg)

**Key responsibilities**
- **Backend API**
  - `uploadFile(file)`
  - `pushToFilecoin(file)`
  - `returnCID()`
- **Smart Contract**
  - `storeCID(cid)`
  - `storeUploaderAddress(address)`
  - `storeTimestamp(timestamp)`
  - `queryCidExists(cid)`
- **Integration Layer**
  - `connectBackendToSmartContract()`
  - `onUploadStoreCID()`
  - `registerCidInContract()`

### 3) Sequence Diagram
![Sequence Diagram](./docs/diagrams/filecoinvault-sequence.jpeg)

**Flow:** Upload received → Push to Filecoin → CID returned → Register `{CID,uploader,timestamp}` on-chain → Expose `queryCID` for verifiers.

> **Filenames to use (or rename accordingly):**
> - `docs/diagrams/filecoinvault-system-flow.jpeg`
> - `docs/diagrams/filecoinvault-components.jpeg`
> - `docs/diagrams/filecoinvault-sequence.jpeg`

---

## Tech Stack
- **Backend:** Node.js/Express (or Fastify)  
- **Contracts:** Solidity (EVM) or FEVM-compatible  
- **Storage:** Filecoin (IPFS-compatible client / SDK)  
- **Optional:** Postgres/Prisma (audit logs, API keys), Redis (queues)  
- **DevOps:** Vercel (frontend), any Node host (backend), Hardhat/Foundry for contracts

---

## Module Breakdown
**Upload Service**
- Accepts files, validates size/type, encrypts client- or server-side (configurable).
- Stores encrypted blob → receives **CID**.

**Registry Contract**
- Minimal on-chain record of `{CID, uploader, timestamp}`.
- Public read methods for verification.

**Verification Service**
- REST endpoints (and future SDK) for `verify(cid)` and `resolve(cid)` (metadata, timestamps, uploader).

---

## API (Wave 1 draft)
> Draft endpoints for docs; implement in later waves.

