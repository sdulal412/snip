<div align="center">
  <br />
    <a>
      <img width="1531" height="707" alt="Snip-photo" src="snip.png" />
    </a>


  <br />
  <h3 align="center"> Snip - URL Shortner, QR Generator </h3>
</div>

## <a name="table">Table of Contents</a>

1. [Introduction](#introduction)
2. [Key Features](#key-features)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)


## <a name="introduction">Introduction</a>

Classic Tetris clone featuring a Python (Flask) logic engine and an Angular 18 frontend.

## <a name="key-features">Key Features</a>

- Ultra-Responsive UI: Scales perfectly to any screen size using CSS transforms.
- Theme Engine: Quick toggle between Dark/Light modes and Ghost piece visibility.
- Logic Isolation: Game mechanics and collision detection are handled entirely in Python.
- Synthesized Sound: Unique audio profiles for Move, Rotate, Clear, and Drop using mathematical oscillators (Zero asset files).


## <a name="project-structure">Project Structure</a>

```bash
snip/
├── frontend/
│    ├── angular.json
│    ├── package.json
│    ├── package-lock.json
│    ├── tsconfig.json
│    ├── tsconfig.app.json
│    └── src/
│       ├── main.ts
│       ├── styles.css
│       ├── index.html
│       ├── app/
│       │     ├──app.component.ts
│       │     ├──app.component.css
│       │     └──app.component.html
│       ├── env/
│            ├──env.ts
│            └──env.dev.ts
├── README.md
├── snip.png
└── .gitignore

```

## <a name="quick-start">Quick Start</a>

### Prerequisites

- npm or yarn
- Node.js (v18 or higher)
- Angular CLI (optional but recommended)

```bash
# Install dependencies (only the first time)
npm install --legacy-peer-deps

# Generate a new Component
ng generate component `component-name`
# Or
ng generate directive|pipe|service|class|guard|interface|enum|module

# Run the local server at http://localhost:4200
ng serve
```