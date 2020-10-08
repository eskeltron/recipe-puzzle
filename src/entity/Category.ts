import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { Recipe } from './Recipe';

@ObjectType()
@Entity()
export class Category extends BaseEntity{
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    name!:string

    
    // @ManyToOne(() => Recipe, recipe => recipe.category)
    // recipes!: Recipe;
    @OneToMany(() => Recipe, recipe => recipe.category)
    recipes!: Recipe[];
}