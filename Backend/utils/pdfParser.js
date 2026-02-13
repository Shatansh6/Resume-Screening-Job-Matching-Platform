import pdf from "pdf-parse";

export const parsePDF = async (buffer) => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Invalid buffer");
  }

  const data = await pdf(buffer);

  if (!data.text || data.text.trim().length < 30) {
    throw new Error("No readable text in PDF");
  }

  return data.text
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
};
