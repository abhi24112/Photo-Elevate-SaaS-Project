import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";

export const creditFeching = async (email: string) => {
  try {
    await connect();

    const user = await User.findOne({ email });
    const credits = user.credits
    return credits;

  } catch{
    throw new Error("Failed to fetch credits");
  }
};
