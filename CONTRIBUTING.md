# Contributing to EdTech Platform

Thank you for your interest in contributing to EdTech Platform! We welcome contributions from developers of all skill levels.

---

## 🛠️ Getting Started

1. **Fork the Repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/ed-tech-platform.git
   cd ed-tech-platform
   ```
3. **Install Dependencies**:
   ```bash
   npm run install:all
   ```
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 💻 Development Workflow

1. Configure `.env` files in both `frontend` and `backend` using the provided `.env.example` templates.
2. Start the local development environment:
   ```bash
   npm run dev
   ```
3. Run tests before submitting changes:
   ```bash
   npm run test:backend
   ```

---

## 📝 Commit Conventions

We follow Conventional Commits format:
- `feat:` A new feature for users
- `fix:` A bug fix
- `docs:` Documentation improvements
- `style:` Formatting, missing semi-colons, css polish
- `refactor:` Code restructuring without behavioral changes
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build scripts, package updates, configuration

---

## 🚀 Pull Request Guidelines

1. Ensure the code builds cleanly without linting errors.
2. Provide a clear description of the issue or feature addressed.
3. Keep pull requests focused on a single logical change.
