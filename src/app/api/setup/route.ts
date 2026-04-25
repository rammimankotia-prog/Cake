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
      const output = execSync('npx prisma generate', { encoding: 'utf8' });
      logs.push("Prisma Generate Output: " + output);
    } catch (e: any) {
      logs.push("Prisma Generate Error: " + e.message);
    }
    
    // 3. Ensure database schema is pushed
    try {
      const pushOutput = execSync('npx prisma db push --accept-data-loss', { encoding: 'utf8' });
      logs.push("Prisma DB Push Output: " + pushOutput);
    } catch (e: any) {
      logs.push("Prisma DB Push Error: " + e.message);
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
