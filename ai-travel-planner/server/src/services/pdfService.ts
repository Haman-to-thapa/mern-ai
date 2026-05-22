import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractPdfText = async (
  filePath: string
) => {
  const dataBuffer = fs.readFileSync(filePath);

  const pdf = new PDFParse({ data: dataBuffer });
  const data = await pdf.getText();
  await pdf.destroy();

  return data.text;
};

export default extractPdfText;