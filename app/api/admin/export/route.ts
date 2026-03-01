import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
export async function GET(){if(!isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401}); const leads=await prisma.lead.findMany(); const rows=['name,email,phone,service,message,createdAt',...leads.map(l=>`"${l.name}","${l.email}","${l.phone}","${l.service}","${l.message.replace(/"/g,'""')}","${l.createdAt.toISOString()}"`)]; return new NextResponse(rows.join('\n'),{headers:{'content-type':'text/csv'}})}
