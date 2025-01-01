import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import * as bcrypt from 'bcrypt' ;
import { UserService } from "./User.service";
import { User } from "src/schemas/User.schema";
import { stat } from "fs";

@Controller()
export class UserController {
    constructor(private readonly userService : UserService){}

    @Post('signup')
    async userSignup(@Body() body : { name : string ; email : string ; phone : number ; password : string ; terms : boolean }) {

        try{
            const hashedPassword = await bcrypt.hash(body.password , 10);
            const user : User = {
                name : body.name ,
                email : body.email ,
                phoneNumber : body.phone , 
                password : hashedPassword ,
                terms : body.terms ,
            }

            await this.userService.createUser(user);
            return {
                status : 201 , 
                message : "User Created Successfully" ,
                user
            }
        }
        catch(error){
            console.log("Error creating user : " , error);
            throw new HttpException("Error creating user" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async userLogin(@Body() body : { email : string ; password : string}){
        try{
            const user = await this.userService.findUserByEmail(body.email);
            if(!user){
                throw new HttpException("USER NOT FOUND" , HttpStatus.NOT_FOUND);
            }
            const checkPassword = await bcrypt.compare(user.password , body.password);
            if(!checkPassword){
                throw new HttpException("INCORRECT PASSWORD" , HttpStatus.UNAUTHORIZED);
            }
            return {
                message : "Login Succesfull" ,
                HttpStatus : 200 ,
                user
            }
        }catch(error){
            console.log("Login error : " , error);
            throw new HttpException("User Login failed" , HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    @Get('userList')
    async getAllUser(){
        
        try{
            var userData = await this.userService.findUsers();
            return {userData}
        }
        catch(error){
            console.log("Error retreiving users : " , error);
            throw new HttpException("Error retrieving user data " , HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }

    @Get('userDetails')
    async getUser(@Query('id') email : string){

        try{
            const userData = await this.userService.findUserByEmail(email);
            return {userData}
        }catch(error){
            throw new HttpException("Error getting user data" , HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }

    @Get('userProfile')
    async getUserFromQuery(@Query('user') userIdFromQuery : string){

        try{
            const user = await this.userService.findUserByName(userIdFromQuery);
            return {user}
        }
        catch(error){
            throw new HttpException("Error retreiving user from Query",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
