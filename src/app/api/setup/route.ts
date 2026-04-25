import { execSync } from 'child_process';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const logs: string[] = [];
  
  try {
    const prismaDir = path.join(process.cwd(), 'prisma');
    const dbFile = path.join(prismaDir, 'dev.db');

    // 1. Fix Permissions
    try {
      fs.chmodSync(prismaDir, 0o777);
      logs.push("Set prisma directory permissions to 777");
      
      if (fs.existsSync(dbFile)) {
        fs.chmodSync(dbFile, 0o666);
        logs.push("Set dev.db file permissions to 666");
      } else {
        logs.push("Warning: dev.db not found at " + dbFile);
      }
    } catch (e: any) {
      logs.push("Permission error: " + e.message);
    }

    // 2. Run Prisma Generate
    try {
      const output = execSync(`${process.execPath} node_modules/prisma/build/index.js generate`, { encoding: 'utf8' });
      logs.push("Prisma Generate Output: " + output);
    } catch (e: any) {
      logs.push("Prisma Generate Error: " + e.message);
    }
    
    // 3. Ensure database schema is pushed
    try {
      logs.push("Attempting DB Push...");
      let pushOutput = "";
      try {
        pushOutput = execSync(`npx prisma db push --accept-data-loss`, { encoding: 'utf8' });
      } catch (e1) {
        logs.push("npx prisma failed, trying direct path...");
        pushOutput = execSync(`${process.execPath} node_modules/prisma/build/index.js db push --accept-data-loss`, { encoding: 'utf8' });
      }
      logs.push("Prisma DB Push Output: " + pushOutput);
    } catch (e: any) {
      logs.push("Prisma DB Push Error: " + e.message);
      if (e.stdout) logs.push("Push Stdout: " + e.stdout);
      if (e.stderr) logs.push("Push Stderr: " + e.stderr);
    }

    // 4. Manual SQL Fallback for missing columns
    try {
      logs.push("Attempting manual SQL column addition...");
      const { prisma: prismaClient } = require('@/lib/prisma');
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN imageZoom REAL DEFAULT 1`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN imagePosX REAL DEFAULT 50`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN imagePosY REAL DEFAULT 50`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN stock INTEGER DEFAULT 0`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN lowStock INTEGER DEFAULT 5`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN cgst REAL DEFAULT 0`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN sgst REAL DEFAULT 0`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`ALTER TABLE ShopSettings ADD COLUMN chatbotActive INTEGER DEFAULT 1`); } catch(e) {}
      try { await prismaClient.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Lead" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT, "phone" TEXT NOT NULL UNIQUE, "email" TEXT, "address" TEXT, "notes" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`); } catch(e) {}
      logs.push("Manual SQL: Table/Column additions attempted");
    } catch (e: any) {
      logs.push("Manual SQL Note: " + e.message);
    }

    // 5. Run Seed
    try {
      const seedOutput = execSync(`${process.execPath} prisma/seed.js`, { encoding: 'utf8' });
      logs.push("Prisma Seed Output: " + seedOutput);
    } catch (e: any) {
      logs.push("Prisma Seed Error: " + e.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Setup script completed.",
      logs 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      logs 
    }, { status: 500 });
  }
}
