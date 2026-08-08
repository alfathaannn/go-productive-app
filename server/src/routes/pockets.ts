import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const pocketsRouter = Router();

pocketsRouter.use(requireAuth);

pocketsRouter.get("/", async (req, res) => {
  const pockets = await prisma.pocket.findMany({
    where: { userId: req.userId },
    include: { transactions: { orderBy: { createdAt: "desc" } } },
  });
  res.json(pockets);
});

pocketsRouter.post("/", async (req, res) => {
  const { name, balance, icon, color } = req.body;
  const pocket = await prisma.pocket.create({
    data: { name, balance, icon, color, userId: req.userId! },
  });
  res.status(201).json(pocket);
});
