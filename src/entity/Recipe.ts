import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BaseEntity, ManyToMany, OneToMany, ManyToOne} from 'typeorm';
import { Category } from "./Category";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from './User';

@ObjectType()
@Entity()
export class Recipe extends BaseEntity{
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field( () => String)
    @Column()
    name!:string

    @Field( () => String)
    @Column()
    description!:string
    
    @Field( () => String)
    @Column()
    ingredients!:string

    @ManyToOne(() => Category, category => category.recipes)
    @Field(() => Category)
    category!:Category;

    @ManyToOne(() => User, {nullable:false})
    @Field(() => User)
    user!:User;
}