import Link from 'next/link';
import { getProjects } from '@/lib/content';
export default async function Projects(){const projects=await getProjects();return <main className='container section'><h1>Projects</h1><div className='grid grid-3'>{projects.map(p=><article className='card' key={p.id}><h2><Link href={`/projects/${p.slug}`}>{p.title}</Link></h2><p>{p.summary}</p></article>)}</div></main>}
