require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.resolve(process.cwd(), "src/uploads")));

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media Backend API",
      version: "1.0.0",
      description: "API documentation for the social media backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerjsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
