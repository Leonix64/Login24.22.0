import { UserModel } from "./user.model.js";

export const createUser = (data: { name: string; email: string; passwordHash: string }) =>
    UserModel.create(data);

export const findByEmailWithPassword = (email: string) =>
    UserModel.findOne({ email }).select("+passwordHash");

export const findById = (id: string) => UserModel.findById(id);

export function toPublicUser(user: { id: string; name: string; email: string; createdAt: Date }) {
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}
