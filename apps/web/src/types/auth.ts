export enum RoleEnum {
    ADMIN = 'admin',
    USER = 'user'
}

export interface IUser {
    id: string,
    email: string,
    password: string,
    username: string, 
    name: string,
    role: RoleEnum,
    createdAt: Date,
    updatedAt: Date
}

export interface ILogin {
    message: string;
    data: {
        user: IUser;
        token: {
            token: string;
            expiresAt: string;
        }
    }
}
