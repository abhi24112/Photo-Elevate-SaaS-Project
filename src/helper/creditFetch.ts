import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";

export const creditFeching = async (email: String) => {
  try {
    await connect();

    const user = await User.findOne({ email });
    const credits = user.credits
    return credits;

  } catch (error: any) {
    throw new Error("Failed to fetch credits", error);
  }
};
