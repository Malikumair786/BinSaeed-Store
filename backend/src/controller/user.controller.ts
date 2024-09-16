import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
    constructor (private userService: UserService){}


    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return await this.userService.createUser(createUserDto);
    }

    @Get("all")
    async getAllUsers(){
        return await this.userService.getAllUsers();
    }
    
}
