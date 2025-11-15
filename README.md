# Onda

<img width="1920" height="1200" alt="743shots_so" src="https://github.com/user-attachments/assets/6ec0d886-1055-48e2-9c2a-94194ad98133" />
<img width="1920" height="1000" alt="541shots_so" src="https://github.com/user-attachments/assets/80c037a8-e67b-4b43-ac22-3bae4c7c58a7" />

---

## Getting Started

Instructions for how to run the project locally.

### Requirements

- Node.js (version 20+)
- npm
- Rust (for Tauri)
- System dependencies:
  - **Linux**: `libwebkit2gtk-4.1-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`, `patchelf`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual C++ 2019 Redistributable and WebView2

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

3. Install frontend dependencies:

```bash
cd render
npm install --legacy-peer-deps
cd ..
```

4. Run the development server:

```bash
npm run dev
```

Or simply:

```bash
npm start
```

---

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create platform-specific installers in the `src-tauri/target/release/bundle/` directory:

- **Linux**: `.deb`, `.rpm`, and `.AppImage` files
- **macOS**: `.dmg` file
- **Windows**: `.exe` installer

---

## Technology Stack

- **Frontend**: React, Redux Toolkit, TypeScript, Tailwind CSS
- **Desktop Framework**: Tauri (Rust + WebView)
- **Data Storage**: IndexedDB

---
