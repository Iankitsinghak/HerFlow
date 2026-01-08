# Contributing to HerFlow

First off, thank you for considering contributing to HerFlow! 🌸

HerFlow is a gentle companion for women's health, and we want to maintain that same warmth and care in our community. Every contribution, whether it's a bug report, feature request, or code change, helps make wellness more accessible.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (screenshots, code snippets)
- **Describe the behavior you observed and what you expected**
- **Include details about your environment** (browser, OS, device)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **Consider the impact on privacy and user safety** (core values of HerFlow)

### 🔧 Code Contributions

#### Good First Issues

Look for issues labeled `good first issue` or `help wanted`. These are great starting points for new contributors.

#### Areas We'd Love Help With

- **Accessibility improvements** (screen readers, keyboard navigation)
- **Multi-language support** (Hindi, Bengali, Tamil, Marathi)
- **Privacy enhancements**
- **UI/UX refinements** (keeping our soft, gentle aesthetic)
- **Testing and documentation**
- **Performance optimizations**

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Firebase account (for testing)
- Git

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork:
   git clone https://github.com/YOUR_USERNAME/HerFlow.git
   cd HerFlow
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Visit http://localhost:9002 (or your configured PORT)

5. **Run Firebase emulators (recommended for testing)**
   ```bash
   firebase emulators:start --only firestore,auth
   ```

### Testing Your Changes

Before submitting a pull request:

1. **Run linting**
   ```bash
   npm run lint
   ```

2. **Type check**
   ```bash
   npm run typecheck
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Test Firestore rules** (if you modified them)
   - Use Firebase emulators to test security rules
   - Ensure all existing rules still work

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

2. **Make your changes**
   - Write clear, self-documenting code
   - Add comments for complex logic
   - Follow our style guidelines (see below)

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original HerFlow repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with details
   - Link any related issues

6. **Address review feedback**
   - Be open to suggestions
   - Make requested changes
   - Push updates to the same branch

## Style Guidelines

### General Principles

- **Privacy First**: Never add tracking, analytics, or data collection without explicit user consent
- **Gentle UX**: Use soft language, avoid clinical/cold terminology
- **Empathy**: Consider the emotional impact of features and wording
- **Accessibility**: Ensure all features work for users with disabilities

### Code Style

- **TypeScript**: Use strong typing, avoid `any` when possible
- **Components**: Prefer functional components with hooks
- **Naming**: Use clear, descriptive names
  - Components: PascalCase (`UserProfile.tsx`)
  - Functions: camelCase (`calculateNextPeriod`)
  - Constants: UPPER_SNAKE_CASE (`MAX_CYCLE_LENGTH`)
- **File Organization**: Keep related code together

### Design Style

- **Colors**: Stick to our soft pink palette (check Tailwind config)
- **Typography**: Use existing font scales
- **Spacing**: Follow the 4px/8px grid system
- **Animations**: Keep them subtle and calming
- **Icons**: Use lucide-react for consistency

### Writing Style

- **Documentation**: Clear, concise, helpful
- **UI Text**: Warm, non-judgmental, empathetic
- **Comments**: Explain "why" not "what"
- **Commit Messages**: Clear, descriptive, conventional

## Privacy & Security

When contributing to HerFlow, keep these principles in mind:

- **Never log or expose sensitive user data**
- **Always validate user input** (use Zod schemas)
- **Test Firestore security rules** thoroughly
- **Keep API keys and secrets out of the codebase**
- **Consider data minimization** - collect only what's needed
- **Respect anonymity** in community features

## Community

### Getting Help

- **GitHub Discussions**: Ask questions, share ideas
- **Issues**: Report bugs, request features
- **Pull Requests**: Propose changes, get code reviews

### Recognition

All contributors are valued! Contributors will be:
- Listed in our README (if they wish)
- Mentioned in release notes for significant contributions
- Welcomed into our community with gratitude 🌸

## Questions?

Don't hesitate to ask! Open an issue labeled `question` or reach out to the maintainers.

---

Thank you for helping make HerFlow better! Together, we're building something gentle, safe, and empowering. 💕
