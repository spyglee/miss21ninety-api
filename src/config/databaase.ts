import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: process.env.DBNAME
    })
    // eslint-disable-next-line no-console
    console.log(`💫 MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ Error connecting to MongoDB: ${error}`)
    process.exit(1)
  }
}