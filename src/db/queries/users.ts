import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
};

export async function resetAllUsers() {
    await db.delete(users);
};

export async function getUserByEmail( email: string ) {
    const [result] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
    return result;
};

export async function updateUserEmail(userId: string, newEmail: string) {
    const [user] = await db.update(users)
    .set({ email: newEmail, updatedAt: new Date(Date.now()) })
    .where(eq(users.id, userId))
    .returning();
    return user
}

export async function updateUserPassword(userId: string, newPassword: string) {
    const [user] = await db.update(users)
    .set({ hashedPassword: newPassword, updatedAt: new Date(Date.now()) })
    .where(eq(users.id, userId))
    .returning();
    return user
}

export async function upgradeUserToChirpyRed(userId: string) {
    const [result] = await db.update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning();

    return result;
}