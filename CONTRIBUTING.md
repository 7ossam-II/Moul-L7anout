# Contributing to Moul L7anout

Thank you for your interest in contributing to Moul L7anout! This document provides guidelines and instructions for contributing to the project.

## Git Workflow

We follow a standard Git workflow with the following branches:

- **`main`** – Production-ready code. Protected branch, only accepts PRs from `develop`.
- **`develop`** – Integration branch for features. All feature branches should target `develop`.
- **`feature/*`** – Feature branches created from `develop`. Format: `feature/feature-name` or `feature/ISSUE-123`.
- **`bugfix/*`** – Bug fix branches. Format: `bugfix/bug-name` or `bugfix/ISSUE-123`.
- **`hotfix/*`** – Critical fixes for production. Format: `hotfix/issue-name`.

## Getting Started

1. **Fork the repository** and clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Moul-L7anout.git
   cd Moul-L7anout
   ```

2. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit regularly (see Commit Message Format below).

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** to `develop` with a clear description of your changes.

## Commit Message Format

We follow **Conventional Commits** format for clear, semantic commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tooling changes

### Examples

```bash
git commit -m "feat(auth): add JWT token refresh endpoint"
git commit -m "fix(store): correct geospatial query for nearby stores"
git commit -m "docs(readme): update quick start instructions"
git commit -m "refactor(order): simplify order creation logic"
```

## Code Style Guidelines

### TypeScript

- Use **strict mode** in `tsconfig.json`
- Define **explicit types** for function parameters and return values
- Use **interfaces** for data structures
- Avoid `any` type; use `unknown` if necessary

### Naming Conventions

- **Files**: Use `camelCase` for utilities, `PascalCase` for components and classes
- **Variables/Functions**: Use `camelCase`
- **Constants**: Use `UPPER_SNAKE_CASE`
- **Interfaces**: Prefix with `I` (e.g., `IUser`, `IStore`)

### Backend (Express/Node.js)

```typescript
// Good
export const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  return user;
};

// Bad
export const getUser = async (id: any) => {
  return User.findById(id);
};
```

### Frontend (React/Next.js)

```typescript
// Good
export default function ProductCard({ product }: { product: IProduct }) {
  return <div className="p-4">{product.name}</div>;
}

// Bad
export default function ProductCard(props: any) {
  return <div>{props.product.name}</div>;
}
```

## Adding a New API Endpoint

1. **Create a controller** in `backend/src/controllers/`:
   ```typescript
   export const getStoreStats = async (req: Request, res: Response) => {
     // Implementation
   };
   ```

2. **Add a route** in `backend/src/routes/index.ts`:
   ```typescript
   router.get('/stores/:storeId/stats', authMiddleware, storeController.getStoreStats);
   ```

3. **Add validation** in `backend/src/validators/` if needed.

4. **Update frontend** in `frontend/lib/api/endpoints.ts`:
   ```typescript
   export const storesApi = {
     getStats: (storeId: string) => 
       apiClient.get<StoreStats>(`/v1/stores/${storeId}/stats`),
   };
   ```

## Adding a New Frontend Page

1. **Create a page** in `frontend/app/[role]/[feature]/page.tsx`:
   ```typescript
   'use client';
   export default function FeaturePage() {
     return <div>Feature content</div>;
   }
   ```

2. **Add navigation** in `BottomTabBar` or relevant navigation component.

3. **Use React Query** for data fetching:
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['feature-data'],
     queryFn: () => apiClient.get('/api/feature'),
   });
   ```

## Testing

- Write **unit tests** for business logic
- Write **integration tests** for API endpoints
- Ensure tests pass before submitting a PR:
  ```bash
  npm run test
  ```

## Pull Request Process

1. **Update documentation** if your changes affect user-facing features.
2. **Test locally** before submitting:
   ```bash
   docker-compose up
   ```
3. **Ensure all tests pass**:
   ```bash
   npm run test
   ```
4. **Request review** from at least one team member.
5. **Address feedback** and push updates to the same branch.
6. **Merge** once approved.

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Commit messages are clear and semantic
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements left in production code
- [ ] TypeScript types are properly defined
- [ ] No hardcoded secrets or credentials

## Reporting Issues

- Use **GitHub Issues** to report bugs or suggest features
- Include a clear description, steps to reproduce, and expected behavior
- Label issues appropriately (bug, feature, documentation, etc.)

## Questions?

Feel free to reach out to the team or open a discussion in the GitHub repository.

---

**Thank you for contributing to Moul L7anout!**
