import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "benewende.dev@gmail.com";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log("Admin account already exists:", adminEmail);
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Benewende",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      plan: "business",
      cvCredits: 999,
    },
  });

  console.log("Admin account created:");
  console.log("  Email:", admin.email);
  console.log("  Password: admin123");
  console.log("  Role:", admin.role);
  console.log("");
  console.log("⚠️  Changez le mot de passe en production !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
