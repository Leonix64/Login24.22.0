// Adds the `auth` property that the authenticate middleware attaches to the request
declare global {
    namespace Express {
        interface Request {
            auth?: { userId: string };
        }
    }
}

export { };
