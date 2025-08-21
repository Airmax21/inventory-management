enum StatusEnum {
    APPROVE = 'approve',
    REJECT = 'reject'
}

export interface ITransaction {
    id: string,
    srcItemId: string,
    srcItemName: string,
    srcItemLocation: string,
    dstLocationId: string,
    dstLocationName: string,
    qty: number,
    status: StatusEnum,
    approveAt: Date,
    createdAt: Date,
    updatedAt: Date
}