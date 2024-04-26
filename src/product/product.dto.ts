import { IsNotEmpty } from "class-validator";

export interface ProductDTO {
    id: number,
    userId: number,
    name: string,
    description: string,
    createdAt: string,
    updatedAt: string,
}
export interface FindManyProductsQuery {
    limit?: number,
    offset?: number,
    userId?: number,
}
export class CreateProductCommand {
    userId: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
}