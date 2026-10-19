# login-api

Authentication API (login/register) built with Node.js, Express 5, TypeScript and MongoDB. Designed to work with an Ionic/Angular front end.

## Requirements

| Tool    | Version       |
|---------|---------------|
| Node.js | 24.22.0       |
| npm     | 11.19.1       |
| MongoDB | Local or Atlas |

## Stack and versions

### Core
| Package    | Version | Purpose                          |
|------------|---------|----------------------------------|
| express    | 5.3.0   | Web framework                    |
| typescript | 7.0.2   | Static typing                    |
| tsx        | 4.23.15 | Run TypeScript directly in dev   |
| mongoose   | 9.11.2  | MongoDB ODM                      |

### Security
| Package            | Version | Purpose                                  |
|--------------------|---------|------------------------------------------|
| argon2             | 0.45.1  | Password hashing                         |
| jose               | 6.2.12  | Sign and verify JWT tokens               |
| helmet             | 8.3.0   | Secure HTTP headers                      |
| cors               | 2.8.6   | Allowed origins control                  |
| express-rate-limit | 8.7.1   | Request limiting (brute-force protection)|
| cookie-parser      | 1.4.7   | Cookie parsing                           |

### Validation and logging
| Package     | Version | Purpose                         |
|-------------|---------|---------------------------------|
| zod         | 4.6.7   | Input validation                |
| pino        | 10.4.0  | Logger                          |
| pino-http   | 11.0.0  | Per-request HTTP logging        |
| pino-pretty | 13.2.0  | Human-readable logs in dev      |

### Types (dev)
`@types/express` 5.0.6 · `@types/cors` 2.8.19 · `@types/cookie-parser` 1.4.10 · `@types/node` 26.6.5

`npm i -D @types/node@24`

## Installation

```bash
git clone <repo-url>
cd login-api
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/login
JWT_SECRET=change
CORS_ORIGIN=http://localhost:8100
```

## Running the project

```bash
npm run dev
```

## License

MIT