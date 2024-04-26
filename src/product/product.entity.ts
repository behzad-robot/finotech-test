import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

     // Column for creation timestamp
     @CreateDateColumn()
     createdAt: Date;
 
     // Column for last update timestamp
     @UpdateDateColumn()
     updatedAt: Date;
 
     // Column for soft deletion timestamp (optional, if you're implementing soft delete)
     @DeleteDateColumn({ nullable: true })
     deletedAt?: Date;

    @Column()
    userId : number;

    @Column()
    name: string;

    @Column()
    description: string;


}