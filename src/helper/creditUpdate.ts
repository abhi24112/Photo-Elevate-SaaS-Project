import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";

export const creditUpdate = async (email: String) => {
    try {
        await connect();

        const user = await User.findOne({ email });
        
        if (user && user.credits > 0) {
            user.credits = user.credits - 1;
            await user.save();
        }

        const newUserData = await User.findOne({ email });
        return newUserData.credits

    } catch (error: any) {
        throw new Error(error.message);
    }
};