// Production build seed script for Supabase Auth and Profiles table
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

// Simple function to load .env variables manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const match = line.trim().match(/^([\w.-]+)\s*=\s*(.*)?$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in your .env file.');
  process.exit(1);
}

// Instantiate Supabase Admin Client using the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const prisma = new PrismaClient();

async function main() {
  // Read credentials from arguments
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/seed-admin.ts <email> <password>');
    process.exit(1);
  }

  console.log(`Seeding Admin User: ${email}...`);

  try {
    // 1. Create User in Supabase Auth via the Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirm email automatically
      user_metadata: { role: 'Admin' }
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already exists') || authError.message.includes('already registered')) {
        console.warn('User already exists in Supabase Auth. Checking if profile is linked...');
        
        // Find existing user by email using listUsers
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          throw listError;
        }
        const existingUser = users.find(u => u.email === email);
        if (!existingUser) {
          throw new Error('User supposedly exists but could not be found via listUsers.');
        }

        // Link profile
        await linkProfile(existingUser.id, email);
        return;
      }
      throw authError;
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('User created but ID is missing from response.');
    }
    console.log(`Successfully created user in Supabase Auth (ID: ${userId})`);

    // 2. Insert into profiles table using Prisma
    await linkProfile(userId, email);
    
  } catch (error: any) {
    console.error('Seeding failed:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function linkProfile(userId: string, email: string) {
  const profile = await prisma.profile.upsert({
    where: { id: userId },
    update: {
      email,
      role: 'Admin'
    },
    create: {
      id: userId,
      email,
      role: 'Admin'
    }
  });

  console.log('Successfully upserted profile in the database:', profile);
  console.log('Seeding process completed successfully!');
}

main();
