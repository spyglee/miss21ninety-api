import express, { Application } from 'express';
import userRoutes from './routes/user'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { connectDB } from './config/databaase';
import helmet from 'helmet'
import cors from 'cors'
import videoRoutes from './routes/video'

const app: Application = express();
dotenv.config()
const PORT = process.env.PORT || 3006;

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API Docs", version: "1.0.0" },
  },
  apis: ["./routes/*.ts"],
};

connectDB()
app.use(helmet())
app.use(express.json())
app.use(cors())


app.use('/user', userRoutes)
app.use('/video', videoRoutes)

const swaggerDocs = swaggerJSDoc(swaggerOptions);
// @ts-ignore
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});