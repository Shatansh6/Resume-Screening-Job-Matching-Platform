import axios from "axios";
import { parsePDF } from "./pdfParser.js";

export const parseResume = async (fileUrl) => {
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });

  return await parsePDF(response.data);
};
