import { prisma } from './prisma';
export const getServices = ()=>prisma.service.findMany({orderBy:{createdAt:'desc'}});
export const getProjects = ()=>prisma.project.findMany({orderBy:{createdAt:'desc'}});
export const getPosts = ()=>prisma.post.findMany({orderBy:{publishedAt:'desc'}});
