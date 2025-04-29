import { PrismaClient } from "@/generated/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function seedCategories(count = 200) {
  const rows = Array.from({ length: count }).map(() => {
    const baseName = faker.commerce.department();
    const uniqueName = `${baseName}_${faker.string.alphanumeric(8)}_${Date.now()}_${faker.number.int({ min: 1000, max: 9999 })}`;
    return {
      name: uniqueName,
      description: faker.commerce.productDescription(),
      isPublish: faker.datatype.boolean(),
    };
  });
  await prisma.category.createMany({ data: rows });
  console.log(`✅ Seeded ${count} categories`);
  return count;
}

async function seedUsers(count = 1000, batchSize = 200) {
  const uniqueCheck = {
    usernames: new Set<string>(),
    emails: new Set<string>(),
    phones: new Set<string>(),
  };

  const userRows = [];
  while (userRows.length < count) {
    const baseUsername = faker.internet.username();
    const uniqueUsername = `${baseUsername}_${faker.string.alphanumeric(8)}_${Date.now()}_${faker.number.int({ min: 1000, max: 9999 })}`;
    if (uniqueCheck.usernames.has(uniqueUsername)) continue;

    const baseEmail = faker.internet.email();
    const randomStr = `${faker.string.alphanumeric(8)}${Date.now()}${faker.number.int({ min: 1000, max: 9999 })}`;
    const uniqueEmail = baseEmail.replace("@", `+${randomStr}@`);
    if (uniqueCheck.emails.has(uniqueEmail)) continue;

    const uniquePhone = `${faker.string.numeric(10)}${faker.string.numeric(4)}${Date.now().toString().slice(-6)}`;
    if (uniqueCheck.phones.has(uniquePhone)) continue;

    uniqueCheck.usernames.add(uniqueUsername);
    uniqueCheck.emails.add(uniqueEmail);
    uniqueCheck.phones.add(uniquePhone);

    userRows.push({
      username: uniqueUsername,
      email: uniqueEmail,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: uniquePhone,
      avatarUrl: faker.image.avatar(),
      role: "USER" as const,
      otp: faker.string.alphanumeric(6),
      isVerified: faker.datatype.boolean(),
    });
  }

  // Lower bcrypt work factor for faster hashing during seeding
  const passwordHashes = await Promise.all(
    userRows.map(() => bcrypt.hash("Password123!", 4)),
  );

  const rows = userRows.map((user, i) => ({
    ...user,
    passwordHash: passwordHashes[i],
  }));

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.user.createMany({ data: batch });
  }
  console.log(`✅ Seeded ${count} users (batch size: ${batchSize})`);
}

async function seedProducts(
  count = 10000,
  batchSize = 1000,
  categoryCount: number,
) {
  const rows = Array.from({ length: count }).map(() => {
    const baseName = faker.commerce.productName();
    const uniqueName = `${baseName}_${faker.string.alphanumeric(12)}_${Date.now()}_${faker.number.int({ min: 1000, max: 9999 })}`;
    return {
      name: uniqueName,
      description: faker.commerce.productDescription(),
      categoryId: faker.number.int({ min: 1, max: categoryCount }),
      price: faker.commerce.price({ min: 10000, max: 1000000 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      imageUrl: faker.image.url(),
      isPublish: faker.datatype.boolean(),
    };
  });

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.product.createMany({ data: batch });
  }
  console.log(`✅ Seeded ${count} products (batch size: ${batchSize})`);
}

async function main() {
  try {
    console.log("⏳ Seeding database...");

    console.log("🗑️ Truncating tables and resetting sequences...");
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
    console.log("✅ Tables truncated");

    const categoryCount = await seedCategories(50);

    // Seed users and products in parallel
    await Promise.all([
      seedUsers(100, 200),
      seedProducts(1000, 1000, categoryCount),
    ]);

    console.log("🎉 All done!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

main();
