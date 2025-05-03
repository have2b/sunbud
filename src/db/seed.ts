import {
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  Role,
  ShippingStatus,
} from "@/generated/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

// Helper function to generate a random date within the past 6 months
const getRandomDateInPast6Months = () => {
  // Current date
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  // 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  // Random date between now and 6 months ago
  return faker.date.between({ from: sixMonthsAgo, to: now });
};

async function seedCategories(count = 20) {
  const names = new Set<string>();
  const rows = [];
  while (names.size < count) {
    const name = faker.commerce.department();
    if (names.has(name)) continue;
    names.add(name);
    rows.push({
      name,
      description: faker.commerce.productDescription(),
      isPublish: faker.datatype.boolean(),
      createdAt: getRandomDateInPast6Months(),
    });
  }
  await prisma.category.createMany({ data: rows });
  console.log(`✅ Seeded ${count} categories`);
  return count;
}

async function seedUsers(count = 100, batchSize = 20) {
  const usernames = new Set<string>();
  const emails = new Set<string>();
  const phones = new Set<string>();

  const userRows = [];
  while (userRows.length < count) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username();
    if (usernames.has(username)) continue;
    usernames.add(username);

    const email = faker.internet.email();
    if (emails.has(email)) continue;
    emails.add(email);

    const phone = faker.string.numeric(10);
    if (phones.has(phone)) continue;
    phones.add(phone);

    userRows.push({
      username,
      email,
      firstName,
      lastName,
      phone,
      avatarUrl: faker.image.avatar(),
      role: Math.random() < 0.5 ? Role.USER : Role.SHIPPER,
      otp: faker.string.numeric(6),
      isVerified: faker.datatype.boolean(),
      createdAt: getRandomDateInPast6Months(),
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
  count = 500,
  batchSize = 100,
  categoryCount: number,
) {
  const names = new Set<string>();
  const rows = [];
  while (rows.length < count) {
    const name = faker.commerce.productName();
    if (names.has(name)) continue;
    names.add(name);

    rows.push({
      name,
      description: faker.commerce.productDescription(),
      categoryId: faker.number.int({ min: 1, max: categoryCount }),
      price: faker.commerce.price({ min: 1000, max: 10000 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      imageUrl: faker.image.url(),
      isPublish: faker.datatype.boolean(),
      createdAt: getRandomDateInPast6Months(),
    });
  }

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.product.createMany({ data: batch });
  }
  console.log(`✅ Seeded ${count} products (batch size: ${batchSize})`);
}

async function seedOrders(count = 100, batchSize = 20) {
  // Get all user IDs from the database
  const users = await prisma.user.findMany({
    select: { id: true, role: true },
  });

  if (users.length === 0) {
    console.log("⚠️ No users found. Cannot seed orders.");
    return [];
  }

  const rows = [];
  while (rows.length < count) {
    // Randomly select a user
    const randomUser = users[Math.floor(Math.random() * users.length)];

    rows.push({
      userId: randomUser.id,
      shipperId: users
        .filter((user) => user.role === Role.SHIPPER)
        .map((user) => user.id)[Math.floor(Math.random() * users.length)],
      status: faker.helpers.enumValue(OrderStatus),
      paymentStatus: faker.helpers.enumValue(PaymentStatus),
      paymentMethod: faker.helpers.enumValue(PaymentMethod),
      deliveryMethod: faker.helpers.enumValue(DeliveryMethod),
      shippingStatus: faker.helpers.enumValue(ShippingStatus),
      totalAmount: faker.commerce.price({ min: 1000, max: 10000 }),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      createdAt: getRandomDateInPast6Months(),
    });
  }

  const createdOrders = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.order.createMany({ data: batch });
    createdOrders.push(...batch);
  }
  console.log(`✅ Seeded ${count} orders (batch size: ${batchSize})`);

  // Return all orders for use in seedOrderItems
  const allOrders = await prisma.order.findMany({
    select: { id: true },
  });
  return allOrders;
}

async function seedOrderItems(
  count = 100,
  batchSize = 20,
  orders: { id: number }[],
) {
  // Get all product IDs from the database
  const products = await prisma.product.findMany({
    select: { id: true, price: true },
  });

  if (products.length === 0 || orders.length === 0) {
    console.log("⚠️ No products or orders found. Cannot seed order items.");
    return;
  }

  const rows = [];
  while (rows.length < count) {
    // Randomly select an order and product
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const quantity = faker.number.int({ min: 1, max: 10 });

    rows.push({
      orderId: randomOrder.id,
      productId: randomProduct.id,
      quantity: quantity,
      price: randomProduct.price, // Use the actual product price for realism
      createdAt: getRandomDateInPast6Months(),
    });
  }

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.orderItem.createMany({ data: batch });
  }
  console.log(`✅ Seeded ${count} order items (batch size: ${batchSize})`);
}

async function main() {
  try {
    console.log("⏳ Seeding database...");

    console.log("🗑️ Truncating tables and resetting sequences...");
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
    console.log("✅ Tables truncated");

    const categoryCount = await seedCategories(20);

    // Seed users and products first
    await Promise.all([
      seedUsers(200, 20),
      seedProducts(500, 100, categoryCount),
    ]);

    // Then seed orders and order items sequentially with proper relationships
    const seededOrders = await seedOrders(200, 20);
    await seedOrderItems(400, 20, seededOrders);

    console.log("🎉 All done!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

main();
