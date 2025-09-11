import argon2 from "argon2";

import { UserRepository } from "../repository/users.repository.js";

const userRepo = new UserRepository();

export class AuthService {
  async register({ role, email, password, name }) {
    const hash = await argon2.hash(password);
    return userRepo.create(role, email, hash, name);
  }

  async login({ email, password }) {
    const u = await userRepo.findByEmail(email);
    if (!u) throw new Error("invalid email");
    const ok = await argon2.verify(u.password_hash, password);
    if (!ok) throw new Error("invalid password");
    return {
      token: sign(u),
      user: { id: u.id, role: u.role, email: u.email, name: u.name },
    };
  }
}
