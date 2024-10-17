import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { Cat } from 'src/cat/interfaces/cat.entity';
import { CreateCatDto } from 'src/cat/dto/createCat.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Get(':id')
  public getCatById(@Param('id') id: number): Promise<Cat | null> {
    return Promise.resolve(this.catService.getCatById(id));
  }

  @Post()
  public createCat(@Body() cat: CreateCatDto): Promise<Cat> {
    return Promise.resolve(this.catService.createCat(cat));
  }

  @Get('')
  public getAllCats(
    @Query('breed') breed: string,
    @Query('name') name: string,
  ): Promise<Cat[]> {
    if (!breed) {
      return Promise.resolve(this.catService.getCats(breed, name));
    }
  }

  @Delete('/:id')
  public deleteCatById(@Param('id') id: number): Promise<void> {
    try {
      return Promise.resolve(this.catService.deleteCat(id));
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Cat with ${id} has not found`,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
