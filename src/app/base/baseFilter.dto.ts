import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator';
enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseFilterDTO {
  @ApiProperty({
    type: Number,
    description: 'The page number',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly page: number = 1;

  @ApiProperty({
    type: Number,
    description: 'Limit the number of results',
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  readonly limit: number = 10;

  @ApiProperty({ required: false })
  @IsBooleanString()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    type: String,
    description: 'The search term',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly searchTerm!: string;

  @ApiProperty({
    type: String,
    description: new Date().toString(),
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly startDate!: string;

  @ApiProperty({
    type: String,
    description: new Date().toString(),
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly endDate!: string;

  @ApiProperty({
    type: String,
    description: 'createdAt',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly sortBy!: string;

  @ApiProperty({
    type: String,
    description: 'ASC/DESC',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly sortOrder!: SortOrder;
}
