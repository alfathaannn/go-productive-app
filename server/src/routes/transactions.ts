import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const transactionsRouter = Router();

transactionsRouter.use(requireAuth);

transactionsRouter.get("/", async (req, res) => {
  const { pocketId } = req.query;
  const transactions = await prisma.transaction.findMany({
    where: {
      pocket: { userId: req.userId },
      ...(pocketId ? { pocketId: String(pocketId) } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(transactions);
});

transactionsRouter.post("/", async (req, res) => {
  const { title, amount, type, icon, pocketId } = req.body;

  const pocket = await prisma.pocket.findFirst({
    where: { id: pocketId, userId: req.userId },
  });
  if (!pocket) {
    res.status(404).json({ error: "Pocket not found" });
    return;
  }

  const transaction = await prisma.transaction.create({
    data: { title, amount, type, icon, pocketId },
  });

  await prisma.pocket.update({
    where: { id: pocketId },
    data: { balance: { increment: amount } },
  });

  res.status(201).json(transaction);
});
