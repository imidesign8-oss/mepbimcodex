import Link from 'next/link';
import { getServices } from '@/lib/content';
export const metadata={title:'Services | IMI DESIGN'};
export default async function Services(){const services=await getServices();return <main className='container section'><h1>Services</h1><div className='grid grid-3'>{services.map(s=><article className='card' key={s.id}><h2><Link href={`/services/${s.slug}`}>{s.title}</Link></h2><p>{s.summary}</p></article>)}</div></main>}
