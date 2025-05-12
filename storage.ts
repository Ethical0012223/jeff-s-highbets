import { users, type User, type InsertUser, games, type Game, type InsertGame } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllGames(): Promise<Game[]>;
  getGameById(gameId: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<string, Game>;
  userCurrentId: number;
  gameCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.userCurrentId = 1;
    this.gameCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGameById(gameId: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(
      (game) => game.gameId === gameId
    );
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameCurrentId++;
    const game: Game = { ...insertGame, id };
    this.games.set(insertGame.gameId, game);
    return game;
  }
}

export const storage = new MemStorage();
