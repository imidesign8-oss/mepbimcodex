import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import nodemailer from 'nodemailer';

const schema=z.object({name:z.string().min(2),email:z.string().email(),phone:z.string().min(8),service:z.string().min(2),message:z.string().min(10),website:z.string().optional()});

export async function POST(req:Request){
  const ip=(req.headers.get('x-forwarded-for')||'local').split(',')[0];
  if(!rateLimit(`lead:${ip}`,5,60000)) return NextResponse.json({error:'Too many requests'},{status:429});
  const form=Object.fromEntries(await req.formData()) as Record<string,string>;
  if(form.website) return NextResponse.redirect(new URL('/contact?ok=1', req.url));
  const parsed=schema.safeParse(form);
  if(!parsed.success) return NextResponse.json({error:'Invalid fields'},{status:400});
  const lead=await prisma.lead.create({data:parsed.data});
  if(process.env.SMTP_HOST){
    const t=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:false,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
    await t.sendMail({from:process.env.SMTP_FROM,to:'projects@imidesign.in',subject:`New enquiry: ${lead.service}`,text:`${lead.name} ${lead.email} ${lead.phone}\n${lead.message}`});
    await t.sendMail({from:process.env.SMTP_FROM,to:lead.email,subject:'Thanks, we received your query',text:'Thanks, we received your query. Our team will contact you shortly.'});
  }
  return NextResponse.redirect(new URL('/contact?ok=1', req.url));
}
