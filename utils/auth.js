import { createClient } from '@supabase/supabase-js';
import prisma from '@/utils/prisma';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    // Query database to ensure the user has the Admin role
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });
    
    if (!profile || profile.role !== 'Admin') {
      return null;
    }
    
    return user;
  } catch (err) {
    console.error('verifyAdmin check failed:', err);
    return null;
  }
}
