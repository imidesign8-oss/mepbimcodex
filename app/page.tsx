import Link from 'next/link';
import Schema from '@/components/Schema';
import { getServices, getProjects, getPosts } from '@/lib/content';

export default async function HomePage(){
  const [services, projects, posts] = await Promise.all([getServices(), getProjects(), getPosts()]);
  return <main>
    <section className="hero"><div className="container"><h1>IMI DESIGN</h1><p>Architecture, interiors, and turnkey project delivery in Goa.</p>
      <p><a className="btn" href="tel:+91XXXXXXXXXX">Call</a> <a className="btn alt" href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'91XXXXXXXXXX'}`}>WhatsApp</a> <Link className="btn" href="/contact#enquiry">Enquiry</Link></p>
    </div></section>
    <section className="section container"><h2>Services</h2><div className="grid grid-3">{services.map(s=><article className="card" key={s.id}><h3><Link href={`/services/${s.slug}`}>{s.title}</Link></h3><p>{s.summary}</p></article>)}</div></section>
    <section className="section container"><h2>Featured Projects</h2><div className="grid grid-3">{projects.map(p=><article className="card" key={p.id}><h3><Link href={`/projects/${p.slug}`}>{p.title}</Link></h3><p>{p.location}</p></article>)}</div></section>
    <section className="section container"><h2>Latest Blog</h2><div className="grid grid-3">{posts.map(p=><article className="card" key={p.id}><h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3><p>{p.excerpt}</p></article>)}</div></section>
    <Schema data={{'@context':'https://schema.org','@type':'LocalBusiness',name:'IMI DESIGN',url:'https://imidesign.in',email:'projects@imidesign.in',address:{'@type':'PostalAddress',streetAddress:'S4 B Block, Colaso Arcade, Desterro',addressLocality:'Vasco da Gama',addressRegion:'Goa',postalCode:'403802',addressCountry:'IN'}}} />
  </main>;
}
