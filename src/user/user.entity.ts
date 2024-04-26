import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
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
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    hasEmailConfirm: boolean;
}