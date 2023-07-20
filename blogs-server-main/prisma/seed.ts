import { PrismaClient } from '@prisma/client';
import { USER } from '../src/interfaces/user';
import { POST } from '../src/interfaces/post';
import POSTS from '../src/constants/posts';
import { encryptData } from '../src/helpers/encryptionHelpers';

const prisma = new PrismaClient();

const userData: USER = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'abcd1234',
};

const addUser = async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (!user) {
    const encryptedPassword = encryptData(userData.password);
    const userObj = await prisma.user.create({
      data: { ...userData, password: encryptedPassword },
    });
    console.log(`Created new user: ${userObj.email}`);
    for (const postData of POSTS) {
      await prisma.post.create({
        data: {
          ...postData,
          authorId: userObj.id,
        },
      });
    }
    console.log(`Created dummy posts`);
  }
};

async function main() {
  await addUser();
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
