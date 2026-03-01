import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
const base='https://imidesign.in';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const [services,projects,posts]=await Promise.all([prisma.service.findMany(),prisma.project.findMany(),prisma.post.findMany()]);
  const staticPages=['','/about','/services','/projects','/blog','/contact'].map(p=>({url:base+p,lastModified:new Date()}));
  return [...staticPages,...services.map(s=>({url:`${base}/services/${s.slug}`,lastModified:s.updatedAt})),...projects.map(p=>({url:`${base}/projects/${p.slug}`,lastModified:p.updatedAt})),...posts.map(p=>({url:`${base}/blog/${p.slug}`,lastModified:p.updatedAt}))];
}
