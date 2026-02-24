import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import uploadRoute from "./routes/upload.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.send("API running ✅"));

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    app.use("/upload", uploadRoute);

    // ✅ Apollo GraphQL
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await apolloServer.start();

    app.use("/graphql", express.json(), expressMiddleware(apolloServer));

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`✅ GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`✅ Upload endpoint: http://localhost:${PORT}/upload`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err.message);
    process.exit(1);
  }
};

start();