# Contributing to HerFlow

Thank you for your interest in contributing to HerFlow! 🌸 We welcome contributions from everyone and are grateful for your help in making this project better.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots** if applicable
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

2. **Install dependencies**:
   ```bash
   npm ci
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your Firebase and API credentials
   ```

4. **Make your changes**:
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

5. **Test your changes**:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

6. **Commit your changes**:
   - Use clear and meaningful commit messages
   - Follow conventional commits format if possible (e.g., `feat:`, `fix:`, `docs:`, etc.)

7. **Push to your fork** and submit a pull request

8. **Wait for review**:
   - Address any feedback from reviewers
   - Make sure CI checks pass

## Development Guidelines

### Branch Naming

- Feature branches: `feat/feature-name`
- Bug fixes: `fix/issue-number` or `fix/bug-description`
- Documentation: `docs/what-you-are-documenting`

### Code Style

- We use TypeScript - maintain type safety
- Follow the existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Add unit tests for new features when possible
- Test your changes in different browsers
- Verify Firestore rules work correctly using the emulator

### Privacy & Security

HerFlow is a privacy-first application. When contributing:

- **Never commit sensitive data** (API keys, credentials, etc.)
- **Respect user privacy** in all features
- **Follow secure coding practices**
- **Review security implications** of your changes
- **Report security vulnerabilities** privately (see [SECURITY.md](SECURITY.md))

## Project Structure

```
src/
 ├── app/               # Next.js App Router pages
 ├── components/        # Reusable UI components
 ├── ai/                # AI (Woomania) flows and logic
 ├── firebase/          # Firebase configuration and providers
 ├── hooks/             # Custom React hooks
 ├── lib/               # Utilities, helpers, analytics
 ├── locales/           # Internationalization
 └── context/           # React context providers
```

## Getting Help

- Read the [README.md](README.md) for setup instructions
- Check existing issues and pull requests
- Join discussions in GitHub Issues
- Be respectful and patient

## Recognition

Contributors will be recognized in our project. Thank you for helping make HerFlow better for everyone! 🌷

---

*"Here's to cycles understood, stories shared, and wellness made gentle."*
