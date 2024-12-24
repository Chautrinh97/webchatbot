/** @type {import('next').NextConfig} */
import * as dotenv from 'dotenv'
dotenv.config();
const nextConfig = {
   env: {
      API_ENDPOINT: process.env.API_ENDPOINT,
      CHATBOT_ENDPOINT: process.env.CHATBOT_ENDPOINT,
   }
};

export default nextConfig;
