import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Schema from '@/components/Schema';
export default async function PostDetail({params}:{params:{slug:string}}){const p=await prisma.post.findUnique({where:{slug:params.slug}}); if(!p) return notFound(); return <main className='container section'><h1>{p.title}</h1><p className='meta'>By {p.author} · {new Date(p.publishedAt).toLocaleDateString()} · {Math.max(1,Math.ceil(p.content.split(' ').length/200))} min read</p><p>{p.content}</p><Schema data={{'@context':'https://schema.org','@type':'Article',headline:p.title,author:{'@type':'Person',name:p.author},datePublished:p.publishedAt}}/></main>}
