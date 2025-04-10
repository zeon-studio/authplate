export async function findOrCreateUser(user: any, account: any) {
  const { default: UserModel } = await import("@/models/User");

  const dbUser = await UserModel.findOneAndUpdate(
    { email: user.email },
    {
      $setOnInsert: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        emailVerified: true,
        isTermsAccepted: true,
        provider: account?.provider === "google" ? "GOOGLE" : "GITHUB",
      },
      $set: { emailVerified: true },
    },
    { upsert: true, new: true },
  );

  if (!dbUser) {
    throw new Error("Failed to find or create the user.");
  }

  return dbUser;
}
