/* eslint-disable prettier/prettier */
import { Controller, Post , Get , Body , HttpException , HttpStatus, Query } from "@nestjs/common";
import * as bcrypt from 'bcrypt' ;
import { AdminService } from './Admin.service'
import { Admin } from "src/schemas/Admin.schema";


@Controller()
export class AdminController {
    constructor (private readonly adminService : AdminService) {}
    
    @Post('adminsignup')
    async adminSignup(@Body() body : { name : string ; email : string ; phone : number ; password : string ; agreement : boolean }){

        try {
            const hashedPassword = await bcrypt.hash(body.password , 10);

            const newAdmin : Admin = {
                name : body.name , 
                email : body.email ,
                phone : body.phone ,
                password : hashedPassword ,
                agreement : body.agreement ,
            };

            await this.adminService.createAdmin(newAdmin);
            return { message : "Admin created successfully"}
        }catch(error){
            console.error("Error creating admin : " , error);
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('adminlogin')
    async adminLogin(@Body() body : { email : string ; password : string }){

        try{
            const user = await this.adminService.findAdminByEmail(body.email);
            if (!user){
                throw new HttpException('User not found' , HttpStatus.NOT_FOUND);
            }

            const checkPassword = await bcrypt.compare(body.password , user.password);
            if(!checkPassword){
                throw new HttpException('Incorrect Password' , HttpStatus.UNAUTHORIZED);
            }

            return{ message : 'User Found'};
        }catch(error){
            console.error("Login error : " , error);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('adminDetails')
    async getAdminDetails(@Query('id') id : string ){

        try{
            const admin = await this.adminService.findAdminById(id);
            if(!admin){
                throw new HttpException("Admin not found" , HttpStatus.NOT_FOUND);
            }
            return admin;   //return admin details
        }catch(error){
            console.error('Error fetching Admin details : ' , error);
            throw new HttpException('Internal Server Error' , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}