# Environment Configuration

This project uses Angular's environment system to manage different configurations for development, staging, and production environments.

## Available Environments

### Development (`environment.ts`)
- **API URL**: `http://localhost:8000/`
- **Production**: `false`
- **Debug**: `true`
- **Logging**: `true`

### Staging (`environment.staging.ts`)
- **API URL**: `https://staging-api.yevyev.am/`
- **Production**: `false`
- **Debug**: `true`
- **Logging**: `true`

### Production (`environment.prod.ts`)
- **API URL**: `https://api.yevyev.am/`
- **Production**: `true`
- **Debug**: `false`
- **Logging**: `false`



## Build Commands

### Development
```bash
ng serve
# or
ng serve --configuration=development
```

### Staging
```bash
ng build --configuration=staging
ng serve --configuration=staging
```

### Production
```bash
ng build --configuration=production
ng serve --configuration=production
```

