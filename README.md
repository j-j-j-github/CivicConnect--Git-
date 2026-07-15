# 🏛️ CivicConnect: AI-Powered Unified Civic Intelligence Platform

![Project Status](https://img.shields.io/badge/Status-In_Development-blue)
![Academic Level](https://img.shields.io/badge/Academic_Level-MCA_Capstone-success)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-orange)

**CivicConnect** is a centralized, AI-assisted e-governance platform designed to bridge the communication gap between citizens and multiple government administrative departments. By leveraging artificial intelligence, geospatial mapping (GIS), and an API-first microservices architecture, CivicConnect streamlines public grievance redressal, enforces Service Level Agreements (SLAs), and optimizes municipal resource allocation.

---

## 👥 Project Team

This project is developed as a Master of Computer Applications (MCA) Final Year Capstone Project by:

* **Jeeval Jolly Jacob** – Authentication & Citizen Portal
* **G Anandakrishnan** – Department Portal & Case Management
* **Arjun Ghosh** – Administrator Portal, Analytics & SLA Tracking
* **Albin Siby** – AI Assistance Microservices & GIS Mapping

---

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Secure, distinct portals for Citizens, Department Officers, and Municipal Administrators.
* **Smart Issue Routing (AI-Assisted):** Utilizes NLP to automatically categorize complaints, recommend departments, and flag duplicate submissions.
* **Geospatial Intelligence (GIS):** Interactive maps for citizens to geo-tag issues, and heatmaps for administrators to visualize anomaly density.
* **SLA Tracking & Automated Escalation:** Strict monitoring of expected resolution times, with automated escalation to higher authorities if deadlines are breached.
* **Offline Complaint Support:** Caches reports locally during network outages and auto-syncs when connectivity is restored.

---

## 🧱 Core Modules

### 1. Citizen Portal
The public-facing interface allowing residents to securely register, submit multi-media evidence, geo-tag complaints, track ticket lifecycles, and provide post-resolution feedback.

### 2. Department Portal
The operational dashboard for government officials to view assigned tickets, accept/reject cases, upload resolution evidence, and collaborate across different municipal departments.

### 3. Administrator & Analytics Portal
The executive oversight module featuring high-level system configuration, user management, SLA monitoring, and data-driven dashboards displaying department performance and complaint trends.

### 4. AI & GIS Engine
A background service providing human-verified decision support (priority prediction, report summarization) and spatial data rendering via Leaflet and OpenStreetMap.

---

## 🛠️ Technology Stack

**Frontend Ecosystem**
* Next.js (App Router)
* React & TypeScript
* Tailwind CSS

**Backend Microservices**
* NestJS (TypeScript) - Core REST API
* FastAPI (Python) - AI/NLP Services
* Prisma ORM

**Database & Storage**
* PostgreSQL (Relational Data)
* Redis (Caching & State Management)
* MinIO / AWS S3 (Media Storage)

**Infrastructure & DevOps**
* Docker (Containerization)
* GitHub Actions (CI/CD pipelines)
* Prometheus & Grafana (Monitoring)
* JWT & OAuth (Authentication)

