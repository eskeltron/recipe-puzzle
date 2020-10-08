import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToMany} from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { Recipe } from './Recipe';



@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field( () => String)
    @Column()
    name!:string
    
    @Field( () => String)
    @Column({unique: true})
    email!:string
    
    @Field( () => String)
    @Column()
    password!:string

    @ManyToMany(() => Recipe, recipe => recipe.user)
    // @Field(() => [Recipe])
    recipes?:Recipe[];

}