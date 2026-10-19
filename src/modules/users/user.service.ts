import { UserModel } from "./user.model.js";

export const createUser = (data: { email: string; name: string; passwordHash: string }) =>
    UserModel.create(data);

export const findUserByEmailWithPassword = (email: string) =>
    UserModel.findOne({ email }).select("+passwordHash");

export function toPublicUser(user: { id: string; email: string; name: string, createdAt: Date }) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    };
}
