# Onda 🌊

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=OleksandrHridzhak_Onda&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=OleksandrHridzhak_Onda)

### Tech stack

[![Stack](https://skillicons.dev/icons?i=react,electron,ts,js,nodejs,html,css,figma)](https://skillicons.dev)

### Available platforms

![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=black)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img style="width: 49%;" alt="743shots_so" src="https://github.com/user-attachments/assets/6ec0d886-1055-48e2-9c2a-94194ad98133" />
  <img style="width: 49%;" alt="541shots_so" src="https://github.com/user-attachments/assets/80c037a8-e67b-4b43-ac22-3bae4c7c58a7" />
</div>
<img src="https://capsule-render.vercel.app/api?type=waving&color=0077b6&height=60&section=footer" width="100%"/>

| Resource &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Version | Link &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Onda - Windows**                                                                                                                                                                                                                                                                                  |   2.1   | [Download on Gumroad](https://davibes.gumroad.com/l/onda)                                                                                                                                                                                             |

---

```text
📦 Onda
 ├─ 📁 apps
 │   ├─ 📁 desktop    # Electron desktop shell
 │   └─ 📁 render     # React frontend UI
 ├─ 📁 packages
 │   └─ 📁 shared     # Shared types, assets & logic
 └─ 📁 docs         # Documentation & diagrams
```

```mermaid
graph LR
    classDef host stroke-width:2px,stroke-dasharray: 5 5;
    classDef storage stroke-width:2px;

    subgraph ElectronHost [Desktop Environment]
        Electron[Electron Shell]
    end

    subgraph ClientSide [React Application]
        ReactUI[React UI]
        IDB[(IndexedDB)]
        SQLite[(SQLite / Prisma)]
    end

    Electron --> ReactUI
    ReactUI <--> IDB
    Electron <--> SQLite

    class Electron host;
    class IDB,SQLite storage;
```

## Getting Started

Instructions for how to run the project locally.

### Requirements

- Node.js (v20+)
- npm or yarn
- Git Bash (for Windows)
- VS Code (optional)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/OleksandrHridzhak/Onda
cd Onda
```

2. Install dependencies in the root folder:

```bash
npm install
```

3. Run the application:

```bash
npm run start
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](.github/LICENSE) file for details.
