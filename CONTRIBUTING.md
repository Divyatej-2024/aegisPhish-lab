# Contributing Guide

Thank you for interest in contributing to Aegis Phish Lab! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- No harassment, discrimination, or abusive behavior
- Focus on the code, not the coder
- Help others learn and grow

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/aegisPhish-lab.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Make changes** and test thoroughly
5. **Commit with clear messages**: `git commit -m "Add feature description"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Create a Pull Request** with detailed description

## Development Setup

See main [README.md](README.md) for setup instructions.

## Code Style

### Backend (Go)
```go
// Follow Go conventions
// Use gofmt for formatting
gofmt -w ./backend

// Use golint for linting
golint ./backend/...
```

### Frontend (TypeScript/React)
```bash
# Format code
pnpm -F web format

# Lint code
pnpm -F web lint
```

## Testing

### Backend Tests
```bash
cd backend
go test ./...
go test ./... -race
go test ./... -cover
```

### Frontend Tests
```bash
cd web
pnpm test
pnpm test --coverage
```

## Git Workflow

### Branch Naming
- `feature/description` - New feature
- `bugfix/description` - Bug fix
- `refactor/description` - Code refactoring
- `docs/description` - Documentation
- `ci/description` - CI/CD changes

### Commit Messages
```
Type: Brief description (50 chars max)

Detailed explanation if needed (72 chars per line)

Fixes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Adding/updating tests
- `chore`: Maintenance
- `ci`: CI/CD changes

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Request review** from maintainers
5. **Address feedback** and make changes
6. **Merge** once approved

### PR Title Format
```
[Type] Brief description
```

Example: `[feat] Add campaign scheduling feature`

## Issues

### Reporting Bugs
- Use "Bug Report" template
- Include reproduction steps
- Provide system/browser info
- Attach logs if applicable

### Feature Requests
- Use "Feature Request" template
- Explain use case
- Provide examples
- Discuss implementation approach

## Documentation

- Keep docs up-to-date with code changes
- Use clear, concise language
- Include examples where helpful
- Add code comments for complex logic

## Performance Guidelines

- Avoid N+1 queries with proper eager loading
- Implement pagination for large datasets
- Use database indexes wisely
- Profile before optimizing

## Security Guidelines

- Never commit secrets or credentials
- Use environment variables
- Validate all user inputs
- Use parameterized queries (GORM handles this)
- Keep dependencies updated

## Release Process

1. Bump version in `package.json` and `go.mod`
2. Update [CHANGELOG.md](CHANGELOG.md)
3. Create release PR
4. Tag release: `git tag v1.0.0`
5. Push tag: `git push origin v1.0.0`
6. Create GitHub release with notes

## Questions?

- 📧 Email: dev@aegisphish.com
- 💬 Discord: [Join community](https://discord.gg/aegisphish)
- 📋 Discussions: [GitHub Discussions](https://github.com/aegisphish/lab/discussions)

Thank you for contributing! 🙏
