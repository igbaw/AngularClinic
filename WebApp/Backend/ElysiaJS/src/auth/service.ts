import { prisma } from "../db/prisma";
import argon2 from "argon2";
import { err } from "../utils/errors";

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.active) {
      throw err("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw err("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        doctor: true,
      },
    });

    if (!user) {
      throw err("USER_NOT_FOUND", "User not found", 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async createUser(data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw err("EMAIL_EXISTS", "Email already exists", 400);
    }

    const passwordHash = await argon2.hash(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        fullName: data.fullName,
        role: data.role,
        mustChangePassword: true,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw err("USER_NOT_FOUND", "User not found", 404);
    }

    const valid = await argon2.verify(user.passwordHash, oldPassword);
    if (!valid) {
      throw err("INVALID_PASSWORD", "Current password is incorrect", 400);
    }

    const newHash = await argon2.hash(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });
  },
};
