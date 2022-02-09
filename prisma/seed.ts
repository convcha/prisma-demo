import { randEmail, randFullName, randNumber } from "@ngneat/falso";
import { Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getUsers = (): Prisma.UserCreateInput[] => {
  return Array(10)
    .fill(0)
    .map(() => ({
      email: randEmail(),
      name: randFullName(),
      age: randNumber({ min: 0, max: 100 }),
    }));
};

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({ data: user });
    })
  );
}

seed();
