# Contributing to Claude Code VSCode Problem Resolver

Thank you for your interest in contributing to the Claude Code VSCode Problem Resolver! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct. Please treat all other contributors with respect and professionalism.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```
   git clone https://github.com/YOUR_USERNAME/claude-vscode-resolver.git
   ```
3. Install dependencies:
   ```
   cd claude-vscode-resolver
   npm install
   ```
4. Create a `.env` file with your API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

## Development Workflow

### Running the Tool Locally

During development, you can run the tool directly:

```bash
node index.js --workspace /path/to/test/project
```

For easier debugging and development:

```bash
node --inspect index.js --workspace /path/to/test/project
```

### Testing

Please write tests for new features or bug fixes:

```bash
npm test
```

We use Jest for testing. Place your test files in the `__tests__` directory with a `.test.js` suffix.

## Pull Request Process

1. Create a feature branch:
   ```
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with clear, descriptive commit messages:
   ```
   git commit -m "feat: Add new verification method for TypeScript errors"
   ```

3. Push your branch:
   ```
   git push origin feature/your-feature-name
   ```

4. Open a pull request against the `main` branch.

### PR Requirements

- Ensure all tests pass
- Update documentation if needed
- Follow code style guidelines
- Add tests for new functionality
- Make sure your PR addresses only one concern

## Coding Guidelines

### Code Style

We follow standard JavaScript/Node.js best practices:

- Use meaningful variable and function names
- Comment complex logic
- Follow the existing project structure
- Use ES6+ features where appropriate

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Changes that don't affect code behavior (formatting, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Changes to the build process or auxiliary tools

## Project Structure

```
claude-vscode-resolver/
├── index.js                # Main executable script
├── lib/                    # Core functionality
│   ├── collector.js        # Problem collection logic
│   ├── resolver.js         # Problem resolution logic
│   ├── verification.js     # Fix verification logic
│   └── reporting.js        # Report generation
├── __tests__/              # Test files
├── docs/                   # Documentation
├── examples/               # Example configurations and use cases
└── templates/              # Prompt templates
```

## Feature Requests and Bug Reports

Please use the GitHub issue tracker to submit feature requests and bug reports. Include as much detail as possible:

- For bugs: steps to reproduce, expected behavior, actual behavior, and environment details
- For features: clear description of the feature and why it would be valuable

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.

## Questions?

If you have any questions, feel free to open an issue or contact the maintainers directly.