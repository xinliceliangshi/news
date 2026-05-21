import { AppError } from "../../shared/http/app-error";
import { ensureString } from "../../shared/utils/string";
import { prisma } from "../../lib/prisma";
import type { LoginBody, RegisterBody } from "./auth.types";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerUser(payload: RegisterBody) {
  const nickname = ensureString(payload.nickname);
  const email = normalizeEmail(ensureString(payload.email));
  const password = ensureString(payload.password);
  const confirmPassword = ensureString(payload.confirmPassword);

  if (!nickname || !email || !password || !confirmPassword) {
    throw new AppError(
      "nickname, email, password and confirmPassword are required",
      400,
    );
  }

  if (!isValidEmail(email)) {
    throw new AppError("email format is invalid", 400);
  }

  if (password.length < 6) {
    throw new AppError("password must be at least 6 characters", 400);
  }

  if (password !== confirmPassword) {
    throw new AppError("password and confirmPassword do not match", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("user already exists", 409);
  }

  const user = await prisma.user.create({
    data: {
      nickname,
      email,
      password,
    },
  });

  return {
    nickname: user.nickname,
    email: user.email,
  };
}

export async function loginUser(payload: LoginBody) {
  const email = normalizeEmail(ensureString(payload.email));
  const password = ensureString(payload.password);

  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.password !== password) {
    throw new AppError("email or password is incorrect", 401);
  }

  return {
    nickname: user.nickname,
    email: user.email,
  };
}
