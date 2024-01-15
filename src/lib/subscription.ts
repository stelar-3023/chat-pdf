import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";

// Define a constant for the number of milliseconds in a day
const DAY_IN_MS = 1000 * 60 * 60 * 24;
// Define an asynchronous function named 'checkSubscription'
export const checkSubscription = async () => {
   // Get the 'userId' from the 'auth' object by awaiting its execution
  const { userId } = await auth();
  // If there is no 'userId', return false
  if (!userId) {
    return false;
  }
  // Query the database using the 'db' object to select records from 'userSubscriptions'
  const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));
  // If there is no user subscription, return false
  if (!_userSubscriptions[0]) {
    return false;
  }
  // Get the first user subscription
  const userSubscription = _userSubscriptions[0];

  // Check if the user subscription has a Stripe price ID and a current period end date
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();
  // Return the boolean value of 'isValid'
  return !!isValid;
};