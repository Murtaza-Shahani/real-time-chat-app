import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService){}
  async findAllUsers(){
    return this.prisma.user.findMany({
      select:{
        id:true,
        name:true,
        email:true,
      },
orderBy:{
  createdAt:'asc',
}      
    })
  }
  // 🔹 Get single user
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
