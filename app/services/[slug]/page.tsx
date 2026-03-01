import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Schema from '@/components/Schema';
export default async function ServiceDetail({params}:{params:{slug:string}}){
 const s=await prisma.service.findUnique({where:{slug:params.slug}}); if(!s) return notFound();
 return <main className='container section'><h1>{s.title}</h1><p>{s.content}</p><Schema data={{'@context':'https://schema.org','@type':'Service',name:s.title,description:s.summary,provider:{'@type':'Organization',name:'IMI DESIGN'}}}/></main>
}
