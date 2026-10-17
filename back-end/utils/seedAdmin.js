const prisma = require("../config/prisma.js");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "ajitlookforbest@gmail.com";
const ADMIN_PASSWORD = "123456";

const initAdminUser = async () => {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (!existing) {
      await prisma.user.create({
        data: {
          name: "Admin",
          email: ADMIN_EMAIL,
          password: hashedPassword,
          isPremium: true,
          plan: "pro",
          validTill: new Date("2099-12-31")
        }
      });
      console.log(`[Admin Seed] Admin account initialized: ${ADMIN_EMAIL}`);
    } else {
      await prisma.user.update({
        where: { email: ADMIN_EMAIL },
        data: {
          password: hashedPassword,
          isPremium: true,
          plan: "pro",
          validTill: new Date("2099-12-31")
        }
      });
      console.log(`[Admin Seed] Admin account verified: ${ADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error("[Admin Seed] Error seeding admin account:", error.message);
  }
};

module.exports = { initAdminUser, ADMIN_EMAIL, ADMIN_PASSWORD };
