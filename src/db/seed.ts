import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { db } from "./db";
import { categories, products, users } from "./schema";

async function seedCategories(count = 50) {
  // Efficiently create unique category names by appending a random string
  const rows = Array.from({ length: count }).map(() => {
    const baseName = faker.commerce.department();
    const uniqueName = `${baseName}_${faker.string.alphanumeric(8)}_${Date.now()}_${faker.number.int({ min: 1000, max: 9999 })}`;
    return {
      name: uniqueName,
      description: faker.commerce.productDescription(),
      isPublish: faker.datatype.boolean(),
    };
  });
  await db.insert(categories).values(rows);
  console.log(`✅ Seeded ${count} categories`);
}

async function seedUsers(count = 1000, batchSize = 200) {
  // Generate user data first (without passwordHash)
  const userRows = Array.from({ length: count }).map(() => {
    const baseUsername = faker.internet.username();
    const uniqueUsername = `${baseUsername}_${faker.string.alphanumeric(8)}_${Date.now()}_${faker.number.int({ min: 1000, max: 9999 })}`;
    const baseEmail = faker.internet.email();
    const randomStr = `${faker.string.alphanumeric(8)}${Date.now()}${faker.number.int({ min: 1000, max: 9999 })}`;
    const uniqueEmail = baseEmail.replace("@", `+${randomStr}@`);
    const uniquePhone = `${faker.string.numeric(10)}${faker.string.numeric(4)}${Date.now().toString().slice(-6)}`;
    return {
      username: uniqueUsername,
      email: uniqueEmail,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: uniquePhone,
      avatarUrl: faker.image.avatar(),
      role: "USER" as const,
      otp: faker.string.alphanumeric(6),
      isVerified: faker.datatype.boolean(),
    };
  });

  // Hash passwords in parallel
  const passwordHashes = await Promise.all(
    userRows.map(() => bcrypt.hash("Password123!", 10)),
  );

  // Attach hashes
  const rows = userRows.map((user, i) => ({
    ...user,
    passwordHash: passwordHashes[i],
  }));

  // Batch insert
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await db.insert(users).values(batch);
  }
  console.log(`✅ Seeded ${count} users (batch size: ${batchSize})`);
}

async function seedProducts(count = 10000, batchSize = 1000) {
  // Efficiently create unique product names by appending a random string
  const rows = Array.from({ length: count }).map(() => {
    const baseName = faker.commerce.productName();
    const uniqueName = `${baseName}_${faker.string.alphanumeric(12)}_${Date.now()}_${faker.number.int({ min: 1000, max: 9999 })}`;
    return {
      name: uniqueName,
      description: faker.commerce.productDescription(),
      categoryId: faker.number.int({ min: 1, max: 50 }),
      price: faker.commerce.price({ min: 10000, max: 1000000 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      imageUrl: faker.image.url(),
      isPublish: faker.datatype.boolean(),
    };
  });
  // Batch insert
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await db.insert(products).values(batch);
  }
  console.log(`✅ Seeded ${count} products (batch size: ${batchSize})`);
}

async function main() {
  try {
    console.log("⏳ Seeding database...");
    // Run categories, users, and products in parallel (if no FK dependency)
    await Promise.all([
      seedCategories(200),
      seedUsers(1000, 200),
      seedProducts(10000, 1000),
    ]);
    console.log("🎉 All done!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
