import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
export async function POST(req:Request){ if(!isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401}); const data=await req.json(); const x=await prisma.service.create({data}); return NextResponse.json(x); }
