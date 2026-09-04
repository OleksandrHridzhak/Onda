import { PrismaClient } from "@prisma/client";
import { app } from "electron";
import path from "node:path";
import fs from "node:fs";

let prismaInstance: PrismaClient | null = null;

export function getDatabasePath(): string {
  if (process.env.NODE_ENV === "development" || !app?.isPackaged) {
    const devDir = path.resolve(process.cwd(), "apps/desktop/prisma");
    if (!fs.existsSync(devDir)) {
      fs.mkdirSync(devDir, { recursive: true });
    }
    return path.join(devDir, "dev.db");
  }
  const userDataPath = app.getPath("userData");
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }
  return path.join(userDataPath, "onda.db");
}

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    const dbPath = getDatabasePath();
    const databaseUrl = `file:${dbPath}`;
    process.env.DATABASE_URL = databaseUrl;

    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
  return prismaInstance;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export async function initDatabase(): Promise<void> {
  try {
    const prismaClient = getPrismaClient();

    // Ensure default settings exist
    const settings = await prismaClient.setting.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      // Initial seed with default columns
      const defaultColumns = [
        {
          id: "default-todo",
          name: "TodoList",
          isNameVisible: true,
          description: "Manage a list of tasks and categories.",
          emojiIconName: "ListTodo",
          width: 160,
          type: "todoListColumn",
          uniqueProps: JSON.stringify({
            availableCategories: [
              { id: "c1", name: "Urgent", color: "accent4" },
            ],
            todos: [],
          }),
          order: 0,
        },
        {
          id: "default-checkbox",
          name: "CheckBox",
          isNameVisible: false,
          description: "Track daily items with simple checkboxes.",
          emojiIconName: "Star",
          width: 50,
          type: "checkboxColumn",
          uniqueProps: JSON.stringify({
            checkboxColor: "accent1",
          }),
          order: 1,
        },
        {
          id: "default-textbox",
          name: "Notes",
          isNameVisible: true,
          description: "Store text strings for each day of the week.",
          emojiIconName: "Type",
          width: 130,
          type: "textboxColumn",
          uniqueProps: JSON.stringify({}),
          order: 2,
        },
      ];

      for (const col of defaultColumns) {
        await prismaClient.column.upsert({
          where: { id: col.id },
          update: {},
          create: col,
        });
      }

      await prismaClient.setting.create({
        data: {
          id: "global",
          layout: JSON.stringify({
            columnsOrder: defaultColumns.map((c) => c.id),
          }),
        },
      });
    }
  } catch (err) {
    console.error("[Desktop Database] Failed to initialize database:", err);
  }
}
