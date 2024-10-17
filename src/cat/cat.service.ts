import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCatDto } from 'src/cat/dto/createCat.dto';
import { Cat } from 'src/cat/interfaces/cat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  public async getCatById(id: number): Promise<Cat | null> {
    return this.catRepository.findOneBy({ id });
  }

  public async getCats(breed: string, name: string): Promise<Cat[]> {
    return await this.catRepository.find({ where: { breed, name } });
  }

  public async createCat(catInput: CreateCatDto): Promise<Cat> {
    const cat: Cat = new Cat();
    cat.name = catInput.name;
    cat.breed = catInput.breed;

    return await this.catRepository.save(cat);
  }

  public async deleteCat(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }
}
