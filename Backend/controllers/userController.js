import User from "../models/User.js";
import { parsePDF } from "../utils/pdfParser.js";
import { extractSkills } from "../utils/skillExtractor.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const text = await parsePDF(req.file.buffer);
    const skills = extractSkills(text);

    const user = await User.findById(req.user._id);
    user.skills = skills;
    user.resume = "uploaded";
    await user.save();

    res.json({ success: true, skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

