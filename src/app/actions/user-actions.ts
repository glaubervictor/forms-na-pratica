"use server";

import db from "@/db";
import { users as usersTable } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import bcrypt from "bcrypt";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";

type User = Omit<InferInsertModel<typeof usersTable>, "hashedPassword"> & {
  password: string;
};

export const createUser = async (user: User) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const [createdUser] = await db
      .insert(usersTable)
      .values({ ...user, hashedPassword })
      .returning();

    return {
      success: true,
      data: createdUser,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Falha ao criar usuário" };
  }
};

export const createUserWithSafeAction = authActionClient
  .schema(
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
  )
  .metadata({ actionName: "create-user" })
  .action(async ({ parsedInput }) => {
    return createUser(parsedInput);
  });
