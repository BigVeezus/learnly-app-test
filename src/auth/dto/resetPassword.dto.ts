import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDTO {
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ChangePasswordDto {
  @IsStrongPassword()
  @IsNotEmpty()
  currentPassword: string;

  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}

export class UpdateGooglePasswordDto {
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;

  @IsStrongPassword()
  @IsNotEmpty()
  confirmNewPassword: string;
}
