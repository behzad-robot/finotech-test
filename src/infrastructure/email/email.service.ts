import { Injectable } from "@nestjs/common";
import { SendEmailCommand } from "./email.command";

@Injectable()
export class EmailService {
    async sendEmail(command: SendEmailCommand): Promise<boolean> {
        //TODO: this is just a mock function it's not really sending email duh?!?
        console.log(`Mock Email Service Sending=>`, command.title, ':', command.to);
        return true;
    }
}
