# OmniCart Testing Guide

This document provides a comprehensive guide to testing the OmniCart e-commerce application.

## Overview

The OmniCart application includes comprehensive testing at multiple levels:

- **Backend**: Spring Boot application with JUnit 5, Mockito, and TestContainers
- **Frontend**: React application with Vitest, React Testing Library, and jsdom

## Backend Testing

### Test Structure

```
api/src/test/java/com/sumuka/ecommerce_backend/
├── modules/
│   ├── user/
│   │   ├── controller/
│   │   │   ├── UserControllerTest.java (Unit Tests)
│   │   │   └── UserControllerIntegrationTest.java (Integration Tests)
│   │   └── service/
│   │       └── UserServiceTest.java (Unit Tests)
│   └── procurement/
│       ├── service/
│       │   └── ProductServiceTest.java (Unit Tests)
│       └── controller/
│           └── ProductControllerTest.java (Unit Tests)
└── EcommerceBackendApplicationTests.java (Application Context Test)
```

### Running Backend Tests

#### Unit Tests Only
```bash
cd api
mvn test
```

#### Integration Tests Only
```bash
cd api
mvn verify
```

#### All Tests
```bash
cd api
mvn clean verify
```

#### Generate Test Reports
```bash
cd api
mvn clean verify jacoco:report
```

### Test Configuration

The backend uses H2 in-memory database for testing with the following configuration in `application-test.yml`:

- **Database**: H2 in-memory with PostgreSQL compatibility mode
- **JPA**: Create-drop schema for each test
- **Security**: JWT with test secret key
- **Logging**: Debug level for comprehensive test output

### Test Coverage Areas

#### Unit Tests Cover:
- Service layer business logic
- Repository interactions (mocked)
- Controller request/response handling
- Exception handling
- Data validation

#### Integration Tests Cover:
- Full request/response cycles
- Database operations
- Security authentication/authorization
- API endpoint functionality
- Transaction management

## Frontend Testing

### Test Structure

```
web/src/test/
├── components/
│   └── Navbar.test.jsx (Component Unit Tests)
├── redux/
│   └── userSlice.test.js (Redux State Tests)
├── pages/
│   └── Home.test.jsx (Page Component Tests)
├── integration/
│   └── AuthenticationFlow.test.jsx (Integration Tests)
└── setup.js (Test Configuration)
```

### Running Frontend Tests

#### Unit Tests
```bash
cd web
npm test
```

#### Watch Mode
```bash
cd web
npm test -- --watch
```

#### Coverage Report
```bash
cd web
npm run test:coverage
```

#### Interactive Test UI
```bash
cd web
npm run test:ui
```

### Test Configuration

The frontend uses Vitest with the following configuration in `vite.config.js`:

- **Environment**: jsdom for DOM simulation
- **Setup File**: `src/test/setup.js` for global test configuration
- **CSS Support**: Enabled for Tailwind CSS testing
- **Globals**: Global test functions available

### Test Coverage Areas

#### Unit Tests Cover:
- Component rendering and behavior
- User interactions (clicks, form submissions)
- Redux state management
- API calls (mocked)
- Conditional rendering

#### Integration Tests Cover:
- Multi-component workflows
- Authentication flows
- Routing behavior
- State persistence
- User journey scenarios

## Running All Tests

### Automated Test Script

Use the provided test script to run all tests:

```bash
chmod +x test-all.sh
./test-all.sh
```

This script will:
1. Check prerequisites (Maven, npm)
2. Run backend unit and integration tests
3. Run frontend unit and integration tests
4. Generate coverage reports
5. Provide a comprehensive summary

### Manual Testing

#### Backend
```bash
cd api
mvn clean verify
```

#### Frontend
```bash
cd web
npm install
npm test
npm run test:coverage
```

## Test Data and Mocking

### Backend Mocking
- **Mockito**: Used for mocking dependencies in unit tests
- **TestContainers**: For integration testing with real databases
- **@MockBean**: Spring Boot test annotation for mocking beans

### Frontend Mocking
- **jest.mock()**: Mock API modules and external dependencies
- **localStorage Mock**: Simulate browser storage
- **React Router Mock**: Mock navigation and routing

## Continuous Integration

### GitHub Actions (Recommended)

Create `.github/workflows/test.yml`:

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run backend tests
        run: |
          cd api
          mvn clean verify

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Run frontend tests
        run: |
          cd web
          npm install
          npm test
          npm run test:coverage
```

## Best Practices

### Backend Testing
1. **Test Categories**: Use `@Tag` annotations to categorize tests
2. **Test Naming**: Use descriptive test method names
3. **Assertion Messages**: Provide clear assertion messages
4. **Test Isolation**: Ensure tests don't depend on each other
5. **Mock Verification**: Verify mock interactions

### Frontend Testing
1. **User-Centric Tests**: Test from user perspective
2. **Accessibility**: Include accessibility testing
3. **Component Isolation**: Test components in isolation
4. **Mock External Dependencies**: Mock API calls and browser APIs
5. **Test Coverage**: Aim for high test coverage

## Troubleshooting

### Common Issues

#### Backend
- **Database Connection**: Ensure H2 database configuration is correct
- **Test Dependencies**: Check that all test dependencies are in pom.xml
- **Security Context**: Mock security context for protected endpoints

#### Frontend
- **Module Resolution**: Ensure import paths are correct
- **Mock Setup**: Verify mocks are properly configured
- **Async Testing**: Use proper async/await patterns

### Debugging Tips

#### Backend
- Enable debug logging in `application-test.yml`
- Use `@SpringBootTest` with `@ActiveProfiles("test")`
- Check test logs in target/surefire-reports/

#### Frontend
- Use `test -- --run` to run tests without watch mode
- Check test output for specific error messages
- Use `console.log` in test files for debugging

## Coverage Reports

### Backend Coverage
Generate with JaCoCo:
```bash
mvn clean verify jacoco:report
```
View report: `target/site/jacoco/index.html`

### Frontend Coverage
Generate with Vitest:
```bash
npm run test:coverage
```
View report: `coverage/index.html`

## Future Enhancements

1. **E2E Testing**: Add Cypress or Playwright for end-to-end tests
2. **Performance Testing**: Add load testing with JMeter or k6
3. **Visual Testing**: Add visual regression testing with Percy or Chromatic
4. **API Testing**: Add comprehensive API contract testing
5. **Accessibility Testing**: Add axe-core for accessibility testing
