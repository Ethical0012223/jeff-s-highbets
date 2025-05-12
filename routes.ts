import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameData } from "../client/src/lib/utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGameById(req.params.id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Initialize games data
  const initGames = async () => {
    try {
      for (const game of gameData) {
        const existingGame = await storage.getGameById(game.id);
        if (!existingGame) {
          await storage.createGame({
            gameId: game.id,
            name: game.name,
            description: game.description,
            image: game.image,
            link: game.link
          });
        }
      }
      console.log("Games data initialized");
    } catch (error) {
      console.error("Failed to initialize games data:", error);
    }
  };

  // Initialize the games data
  initGames();

  const httpServer = createServer(app);

  return httpServer;
}
