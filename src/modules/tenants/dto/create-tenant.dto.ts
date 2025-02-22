import { Matches, MaxLength, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString({ message: 'Företagsnamnet måste vara en sträng' })
  @MaxLength(45, { message: 'Företagsnamnet får max vara 15 tecken.' })
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message:
      'Företagsnamnet får endast innehålla bokstäver, siffror och mellanslag',
  })
  company!: string;
}
