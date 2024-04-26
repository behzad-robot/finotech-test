import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateProductCommand, FindManyProductsQuery, ProductDTO } from "./product.dto";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { ServiceError } from "../utils/service_error";
import { arrayToDTO, toDTO } from "./product.entity.utils";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly userService: UserService) {

    }
    async getOne(id: number): Promise<ProductDTO> {
        let product = await this.productRepository.findOneBy({ id: id });
        if (product == undefined)
            throw new ServiceError(404, 'product not found');
        return toDTO(product);
    }
    async findMany(query: FindManyProductsQuery): Promise<ProductDTO[]> {
        let products = await this.productRepository.find({
            where: query.userId ? { userId: query.userId } : {},
            take: query.limit ?? 10,
            skip: query.offset ?? 0,
            order: { createdAt: 'DESC' },
        });
        return arrayToDTO(products);
    }
    async create(command: CreateProductCommand): Promise<ProductDTO> {
        try {
            let user = await this.userService.getOne(command.userId);
            if (!user.hasEmailConfirm)
                throw new ServiceError(400, 'please confirm your email first');
            let product = await this.productRepository.save({
                name: command.name,
                description: command.description,
                userId: command.userId,
            });
            return toDTO(product);
        }
        catch (err) {
            // console.log(`err:`, err);
            throw new ServiceError(500, 'internal server error');
        }
    }

}