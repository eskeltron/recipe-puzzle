import { Resolver, Mutation, Arg, ObjectType, InputType, Field, Int} from "type-graphql";
import { User } from "../../entity/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { SECRET_KEY } from "../../utils/secretKey";

@InputType()
class UserArgs {
    @Field()
    name!:string;
    @Field()
    email!:string;
    @Field()
    password!:string;
}
/*
@InputType()
class UserUpdateInput {
    
    @Field(() => String, {nullable:true})
    name?:string;
    
    @Field(() => String, {nullable:true})
    email?:string;
    
    @Field(() => String, {nullable:true})
    password?:string;
}
*/

@ObjectType()
export class Token {
    @Field(() => String)
    token!:string;
    constructor(token:string,){
        this.token = token;
    }
}

@Resolver()
export class UserResolver {

    @Mutation(() => Token, {description:'Returns the token.'})
    async login(
        @Arg("email", () => String) email:string,
        @Arg("password", () => String) password:string
    ){
        try {

            const user = await User.findOne({where:{email}, select:{password: true, id: true, email:true}});

            if(!user) return  new Error('The email was not found.');

            const matched = await bcrypt.compare(password, user.password);

            if(!matched) return  new Error('Password not matched.');

            const token = jwt.sign({email, id:user.id}, SECRET_KEY, {
                expiresIn: 5400 //1:30hs
            });

            return new Token(token);
        } catch (e) {
            return new Error('An unexpected error.\n' + e);
        }
    }

    @Mutation(() => Boolean)
    async signUp(
        @Arg("User", () => UserArgs) user:User
    ) {
        try{
            const userExists = await User.findOne({where: {email:user.email}});
            
            if(userExists) return  new Error('This email already exists.');
    
            user.password = await bcrypt.hash(user.password, 10);

            const newUser = User.create(user);

            const userCreated = await newUser.save();

            return (userCreated != null);
        }catch(e){
            return new Error('An unexpected error.\n' + e);
        }
    }

    // @Query(() => User)
    // async getUser(
    //     @Arg("id") id:String
    // ){
    //     return await User.findByIds([id]);
    // }

    // @Query(() => [User])
    // async users(){
    //     return await User.find();
    // }

}