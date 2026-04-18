import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
    @ApiOperation({ summary: 'Get all users' })
  findAllUsers(){
    return this.userService.findAllUsers();
  }
  //get by id
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  finduserById(@Param('id') id:string){
      return this.userService.findOne(Number(id));
  }
}
