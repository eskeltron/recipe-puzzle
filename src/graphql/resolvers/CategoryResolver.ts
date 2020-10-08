import { Resolver, Query, Mutation, Arg, InputType, Field, Ctx, Int} from "type-graphql";
import { Category } from "../../entity/Category";
import { Context } from "vm";
import { validateUser } from "../../utils/userHelper";

@InputType()
class CategoryInput{
    @Field(() => String) name!:string
}

@Resolver()
export class CategoryResolver {

    @Query(() => [Category])
    async getCategories(
        @Ctx() ctx:Context
    ){
        try {
            await validateUser(ctx.email, ctx.id);
            return await Category.find();
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @Query(() => Category)
    async getOneCategory(
        @Ctx() ctx:Context,
        @Arg("id", () => Int) id:number
    ){
        try {
            await validateUser(ctx.email, ctx.id);
            return await Category.findOne({where:{id}});
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @Mutation(() => Category)
    async createCategory(
        @Ctx() ctx:Context,
        @Arg("name") name:string
    ){
        try {
            await validateUser(ctx.email, ctx.id);
            const category = Category.create({name});
            return category.save();
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @Mutation(() => Category, {description: 'Returns the modified category.'})
    async updateCategory(
        @Arg("id", () => Int,{description:'Category\'s id to edit.'}) id:number, 
        @Arg("attributes", () => CategoryInput) attributes:CategoryInput,
        @Ctx() ctx:Context
    ){
        try {
            await validateUser(ctx.email, ctx.id);

            let category = await Category.findOne({where:{id}});

            if(!category) return new Error(`Category for id ${id} not found.`);

            Object.assign(category, attributes);

            return category.save();
        } catch (e) {
            return e;
        }
    }

    @Mutation(() => String, {description: 'Returns the deleted category\'s name.'})
    async deleteCategory(
        @Arg("id", () => Int,{description:'Category\'s id to delete.'}) id:number, 
        @Ctx() ctx:Context
    ){
        try {
            await validateUser(ctx.email, ctx.id);
            let category = await Category.findOne({where:{id}});
            if(!category) return new Error(`Category for id ${id} not found.`);
            return (await category.remove()).name;
        } catch (e) {
            return e;
        }
    }

    
}