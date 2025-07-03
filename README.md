# Project Name

A short description of what this project is and what it's for.

---

## Getting Started

Instructions for how to run the project locally.

### Requirements

- Node.js (version XX+)
- npm or yarn
- Git Bash (for Windows)
- VS Code (optional)

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Install dependencies in the root folder:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd sys3-electron/electron-backend
npm install
cd ../../
```

4. Run the start script:
```bash
./start.sh
```

---

## What `start.sh` Does

- Kills any processes running on ports 5173 and 3000  
- Launches the frontend in a new Git Bash window  
- Launches the backend (`nodemon` for live reload) in another Git Bash window  
- Opens VS Code in the project root

---

## Project Structure

- `/sys3-electron/electron-backend` — backend  
- `/frontend` or `/src` — frontend (React)  
- `start.sh` — main startup script

---

## ❌ Terms of Use

This project is private intellectual property.  
Any copying, distribution, or use of the code without my explicit permission is strictly prohibited.  
All rights reserved © Oleksandr Hridzhak, 2025.
