// password.ts — Custom Password Hashing with Argon2
// Install: npm install @node-rs/argon2

import { hash, type Options, verify } from "@node-rs/argon2";

const opts: Options = {
  memoryCost: 65536, // 64 MiB
  timeCost: 3,       // 3 iterations
  parallelism: 4,    // 4 lanes
  outputLen: 32,     // 32 bytes
  algorithm: 2,      // Argon2id
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, opts);
}

export async function verifyPassword(data: { password: string; hash: string }): Promise<boolean> {
  return verify(data.hash, data.password, opts);
}
