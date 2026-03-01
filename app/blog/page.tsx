import Link from 'next/link';
import { getPosts } from '@/lib/content';
export default async function Blog(){const posts=await getPosts();return <main className='container section'><h1>Blog</h1><div className='grid'>{posts.map(p=><article className='card' key={p.id}><h2><Link href={`/blog/${p.slug}`}>{p.title}</Link></h2><p className='meta'>{p.category} · {new Date(p.publishedAt).toLocaleDateString()}</p><p>{p.excerpt}</p></article>)}</div></main>}
