import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function Dashboard(){
  if(!isAdmin()) redirect('/admin/login');
  const [leads, posts, services, projects] = await Promise.all([prisma.lead.findMany({orderBy:{createdAt:'desc'}}), prisma.post.findMany(), prisma.service.findMany(), prisma.project.findMany()]);
  return <main className='container section'><h1>Admin Dashboard</h1><p className='meta'>2FA, RBAC and audit logs can be integrated via Auth.js/Clerk in production.</p>
    <h2>Content APIs</h2><p>POST JSON to <code>/api/admin/posts</code>, <code>/api/admin/services</code>, <code>/api/admin/projects</code>.</p>
    <h2>Leads ({leads.length})</h2><a className='btn' href='/api/admin/export'>Export CSV</a><div className='grid'>{leads.map(l=><article key={l.id} className='card'><strong>{l.name}</strong><p>{l.email} · {l.phone}</p><p>{l.service}</p><p>{l.message}</p></article>)}</div>
    <h2>SEO checks</h2><ul>{posts.filter(p=>p.metaTitle.length<30||p.metaTitle.length>65).map(p=><li key={p.id}>Adjust title length: {p.title}</li>)}</ul>
    <p>Posts: {posts.length} · Services: {services.length} · Projects: {projects.length}</p>
  </main>
}
