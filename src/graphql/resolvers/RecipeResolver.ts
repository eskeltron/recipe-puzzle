import { Resolver, Query, InputType, Field, Ctx, Mutation, Arg, Int} from "type-graphql";
import { Category } from "../../entity/Category";
import { Context } from "vm";
import { validateUser } from "../../utils/userHelper";
import { Recipe } from "../../entity/Recipe";
import { User } from "../../entity/User";

@InputType()
class RecipeArgs {
    @Field( () => String) name!:string
    @Field( () => String) description!:string
    @Field( () => String) ingredients!:string
    @Field( () => Int, {description:'Number of the category that belong the recipe.'})
    categoryId!:number
}

@InputType()
class RecipeArgsUpdate {
    @Field( () => Int, {description:'The recipe\'s id to modified.'}) 
    id!:number

    @Field( () => String, {description:'The new name.', nullable: true}) 
    name?:string

    @Field( () => String, {description:'The new description.', nullable: true}) 
    description?:string

    @Field( () => String, {description:'The new ingredients.', nullable: true}) 
    ingredients?:string

    @Field( () => Int, {description:'Number of the category that belong the recipe.', nullable: true}) 
    categoryId?:number
}


@Resolver()
export class RecipeResolver {
    
    @Query(() => [Recipe])
    async getRecipes(
        @Ctx() ctx:Context
    ){
        try {
            validateUser(ctx.email, ctx.id);
            return await Recipe.find({relations:{category:true, user: true}});
        } catch (e) {
            console.log(e);
            return  e;
        }
    }

    @Query(() => Recipe)
    async getOneRecipe(
        @Ctx() ctx:Context,
        @Arg("id", () => Int) id:number
    ){
        try {
            validateUser(ctx.email, ctx.id);

            const recipe = await Recipe.findOne({where:{id}, relations:{category:true, user:true}});

            console.log(recipe);

            if(!recipe) return  new Error(`There is not a recipe with the id:${id}`)

            return recipe;
        } catch (e) {
            console.log(e);
            return  e;
        }
    }

    @Query(() => [Recipe])
    async getMyRecipes(
        @Ctx() ctx:Context
    ){
        try {
            validateUser(ctx.email, ctx.id);

            return await Recipe.createQueryBuilder("recipe")
                               .innerJoinAndSelect("recipe.user", "user","user.id = :id", { id:ctx.id })
                               .innerJoinAndSelect("recipe.category", "category", "category.id = recipe.categoryId")
                               .getMany();;
        } catch (e) {
            return  e;
        }
    }
    
    @Mutation(() => Recipe, {description:'The recipe created.'})
    async createRecipe(
        @Ctx() ctx:Context,
        @Arg("Recipe", () => RecipeArgs) recipe:RecipeArgs
    ){
        try {
            validateUser(ctx.email, ctx.id);

            const {name, description, ingredients, categoryId} = recipe;

            const category = await Category.findOne({where:{id:categoryId}});

            if(!category) return  new Error('Category not found. Use "getCategories" for find some category or create a category using the mutation "createCategory".');

            const user = await User.findOne({where:{id:ctx.id}});

            const newRecipe = await Recipe.createQueryBuilder()
                                    .insert()
                                    .values({category, user, ingredients, name, description})
                                    .execute();

            return await Recipe.findOne({where:{id:newRecipe.identifiers[0].id}, relations:{category: true, user:true}});
        } catch (e) {
            console.log(e);
            return  e;
        }
    }

    @Mutation(() => Recipe, {description:'The recipe updated.'})
    async updateRecipe(
        @Ctx() ctx:Context,
        @Arg("Recipe", () => RecipeArgsUpdate) recipe:RecipeArgsUpdate
    ){
        try {
            validateUser(ctx.email, ctx.id);

            const category = await Category.findOne({where:{id:recipe.categoryId}});

            if(!category) return  new Error(`Category for the id ${recipe.categoryId} not found.`);
            
            const findedRecipe = await Recipe.findOne({where:{id:recipe.id}, relations:{category:true, user:true}});

            if(!findedRecipe) return  new Error(`Recipe for the id ${recipe.id} not found.`);

            Object.assign(findedRecipe, recipe);

            findedRecipe.category = category;

            return await findedRecipe.save();
            
        } catch (e) {
            console.log(e);
            return  e;
        }
    }

    @Mutation(() => String, {description: 'The recipe\'s name deleted.'})
    async deleteRecipe(
        @Ctx() ctx:Context,
        @Arg("id", () => Int, { description: 'Recipe\'s id to delete.' }) id:number
    ){
        try {
            validateUser(ctx.email, ctx.id);

            const recipe = await Recipe.findOne({where:{id},relations:{category:true, user:true}});

            if(!recipe) return  new Error(`Recipe for the id ${id} not found`);

            return await (await recipe.remove()).name;
        } catch (e) {
            console.log(e);
            return  e;
        }
    }
    

}