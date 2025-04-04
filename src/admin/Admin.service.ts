/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "src/schemas/Admin.schema";


@Injectable()
export class AdminService {
    constructor(@InjectModel(Admin.name) private adminModel : Model<Admin>) {}

    //function to create an admin
    async createAdmin(adminData : Admin) : Promise <Admin>{

        try {
            const newAdmin = new this.adminModel(adminData);
            return newAdmin.save();
        }catch (error) {
            console.error("Error saving admin:", error);  // Log error during saving
            throw error;  // Re-throw the error to be handled by the controller
        }
    }

    //function to find an admin using email ; used during adminlogin
    async findAdminByEmail(email : string) : Promise<Admin | null> { 
        return this.adminModel.findOne({email}).exec();  //.exec()  executes and returns a proper javascript promise
    }

    //function to find an admin using ID ; used during adminDetails
    async findAdminById(id : string) : Promise <Admin | null> {
        return this.adminModel.findById(id).exec(); 
    }
}
