export interface IItem {
    id: string,
    masterId: string,
    masterName: string,
    locationId: string,
    locationName: string,
    stock: number,
    expDate: Date,
    createdAt: Date,
    updatedAt: Date
}