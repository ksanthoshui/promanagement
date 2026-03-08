import { User } from "../models/User.ts";

export const getUserSettings = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user._id).select("settings");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserSettings = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.settings = { ...user.settings, ...req.body };
    await user.save();

    res.json(user.settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req: any, res: any) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
