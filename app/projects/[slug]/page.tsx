import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
export default async function ProjectDetail({params}:{params:{slug:string}}){const p=await prisma.project.findUnique({where:{slug:params.slug}}); if(!p) return notFound(); return <main className='container section'><h1>{p.title}</h1><p className='meta'>{p.location}</p><p>{p.content}</p></main>}
