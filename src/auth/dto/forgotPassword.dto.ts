import { IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
}
