import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
});

export async function loadS3IntoPinecone(filekey: string) {
  console.log('downloading s3 into the system');
  const file_name = await downloadFromS3(filekey);
  if (!file_name) {
    throw new Error("Could not download from s3")
  }
  const loader = new PDFLoader(file_name!)
  const pages = await loader.load()
  return pages;
}
