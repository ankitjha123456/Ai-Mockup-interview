/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://interviewMocker_owner:lcoS6wjL5ZJM@ep-black-water-a5vzl8aj.us-east-2.aws.neon.tech/interviewMocker?sslmode=require',
    }
  };