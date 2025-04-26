// src/db/seed.ts
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { db } from "./db";
import { categories, users } from "./schema";

async function seedCategories(count = 100) {
  const rows = Array.from({ length: count }).map(() => ({
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    isPublish: faker.datatype.boolean(),
  }));
  await db.insert(categories).values(rows);
  console.log(`✅ Seeded ${count} categories`);
}

async function seedUsers(count = 50) {
  const rows = Array.from({ length: count }).map(() => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    passwordHash: bcrypt.hashSync("Password123!", 10),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.string.numeric(10),
    avatarUrl: faker.image.avatar(),
    role: "USER" as const,
    otp: faker.string.alphanumeric(6),
    isVerified: faker.datatype.boolean(),
  }));
  await db.insert(users).values(rows);
  console.log(`✅ Seeded ${count} users`);
}

async function main() {
  try {
    console.log("⏳ Seeding database...");
    await seedCategories(); // pass a number to override default
    await seedUsers();
    console.log("🎉 All done!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
