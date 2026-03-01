const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main(){
  await prisma.service.createMany({data:[
    {title:'Architecture Design',slug:'architecture-design',summary:'Concept to execution.',content:'End-to-end architectural solutions.',metaTitle:'Architecture Design Services | IMI DESIGN',metaDesc:'Architecture design services in Goa by IMI DESIGN.'},
    {title:'Interior Design',slug:'interior-design',summary:'Residential and commercial interiors.',content:'Space planning, material selection and execution.',metaTitle:'Interior Design Services | IMI DESIGN',metaDesc:'Interior design services in Goa by IMI DESIGN.'}
  ], skipDuplicates:true});
}
main().finally(()=>prisma.$disconnect());
