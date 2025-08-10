export interface IUser {
    id: string,
    email: string,
    password: string,
    username: string, 
    name: string,
    createdAt: Date,
    updatedAt: Date
}

export interface ILogin {
    message: string
    data: {
        user: Partial<IUser>,
        token: string
    }
}