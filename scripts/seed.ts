const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Pemula" },
        { name: "Menengah" },
        { name: "Mahir" },
        { name: "Web development" },
        { name: "Javascript" },
      ],
    });

    console.log("sukses");
  } catch (error) {
    console.log("Error seeding database categories", error);
  } finally {
    await database.$disconnect;
  }
}

main();
