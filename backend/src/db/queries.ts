import { eq, sql, desc, asc } from "drizzle-orm";
import { db } from "./index";
import { NewUser, users, type User } from "./schema";

export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
};

// upsert adalah either create or update
export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({ target: users.id, set: data })
    .returning();
  return user;

  //   const existingUser = await getUserById(data.id);
  //   if (existingUser) return updateUser(data.id, data);
  //   return createUser(data);
};

export const addPoints = async (id: string, points: number) => {
  const [user] = await db
    .update(users)
    .set({
      points: sql`${users.points} + ${points}`,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return user;
};

export const getLeaderboard = async () => {
  return db.query.users.findMany({
    orderBy: desc(users.points),
  });
};
