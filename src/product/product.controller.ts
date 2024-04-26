import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductCommand, FindManyProductsQuery } from "./product.dto";
import { AuthGuard } from "../user/auth.guard";
import { Request } from "express";
import { UserDTO } from "../user/user.dto";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Get('/')
    async findMany(@Query() query: FindManyProductsQuery): Promise<any> {
        return await this.productService.findMany(query);
    }
    @Get('/:id')
    async getOne(@Param('id') id: number): Promise<any> {
        return await this.productService.getOne(id);
    }
    @Post('/create')
    @UseGuards(AuthGuard)
    async create(@Req() req: Request, @Body() command: CreateProductCommand): Promise<any> {
        command.userId = (req['user'] as UserDTO).id;
        return await this.productService.create(command);
    }
}