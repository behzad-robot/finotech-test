import { ProductDTO } from "./product.dto";
import { Product } from "./product.entity";

export function arrayToDTO(input: Product[]): ProductDTO[] {
    return input.map(t => toDTO(t) as ProductDTO);
}
export function toDTO(input: Product): ProductDTO {
    return {
        id: input.id,
        userId: input.userId,
        createdAt: input.createdAt.toString(),
        updatedAt: input.createdAt.toString(),
        description: input.description,
        name: input.name,
    };
}