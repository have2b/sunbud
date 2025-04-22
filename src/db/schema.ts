import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Enums
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "CREDITCARD",
  "ONLINEBANKING",
  "CODE",
]);
export const shippingStatusEnum = pgEnum("shipping_status", [
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
]);
export const roleEnum = pgEnum("role", ["USER", "ADMIN", "SHIPPER"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  role: roleEnum("role").default("USER").notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
});

export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPublish: boolean("is_publish").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
