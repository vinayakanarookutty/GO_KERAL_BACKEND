import { Body, Controller, Post, Get, HttpException, HttpStatus } from "@nestjs/common";
import { DriverService } from "./Driver.service";
import * as bcrypt from 'bcrypt' ;
import { Driver } from "src/schemas/Driver.schema";

@Controller()
export class DriverController {
    constructor(private readonly driverService : DriverService) {}

    @Post("driversignup")
    async driverSignup(@Body() body : {name : string , email : string , phone : number , 
                        password : string , drivinglicenseNo : string , agreement : boolean }) {

        try{
            const hashedPassword = await bcrypt.hash(body.password,10);
            const newDriver : Driver = {
                name : body.name ,
                email : body.email ,
                phone : body.phone ,
                password : hashedPassword ,
                drivinglicenseNo : body.drivinglicenseNo ,
                agreement : body.agreement
            }
            await this.driverService.newDriver(newDriver)
            return { status : HttpStatus.OK ,
                     message : "Driver created successfully" , 
                     newDriver 
            }

        }catch(error){
            console.error("Error creating driver" , error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    @Post("driverlogin")
    async driverLogin(@Body() body : {email : string , password : string}) {
        try {
            const user = this.driverService.findDriverByEmail(body.email)
            if (!user) {
                throw new HttpException('User not found' , HttpStatus.NOT_FOUND)
            }
            const checkPassword = await bcrypt.compare(body.password , (await user).password)
            if(!checkPassword){ 
                throw new HttpException('Incorrect Password' , HttpStatus.UNAUTHORIZED)
            }

            return { message : "User Logged in Successfully", user }
        }catch(error){
            console.log("Login Error :" , error)
            throw new HttpException(error.message , HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}