const prisma = require("../config/prisma.js");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  const email = "ajitlookforbest@gmail.com";
  const password = "123456";
  const name = "Ajit (Admin)";

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          isPremium: true,
          plan: "premium",
        },
      });
      console.log(`Admin user '${email}' already exists. Password and premium status updated.`);
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isPremium: true,
          plan: "premium",
        },
      });
      console.log(`Admin user '${email}' created successfully with password '${password}'.`);
    }
  } catch (err) {
    console.error("Error seeding admin user:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();

