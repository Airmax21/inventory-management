import { ApiClient } from "@/providers";
import type { ApiPaginateResponse } from "@/types/api";
import type { ITransaction } from "@/types/transactions";
import type { PaginateParams } from "@/types/paginate";

const endpoint = '/transaction';

export default {
    paginate: (params: PaginateParams) => {
        return ApiClient.get<ApiPaginateResponse<ITransaction>>(endpoint, { params })
    },
    create: (body: Partial<ITransaction>) => {
        return ApiClient.post<Partial<ITransaction>>(endpoint, body)
    },
    update: (id: ITransaction['id'], body: Partial<ITransaction>) => {
        return ApiClient.put<ITransaction>(`${endpoint}/${id}`, body)
    },
    remove: (id: ITransaction['id']) => {
        return ApiClient.delete<ITransaction>(`${endpoint}/${id}`)
    },
    removeMany: (ids: ITransaction['id'][]) => {
        return ApiClient.delete<ITransaction>(endpoint, {
            params: { ids: ids.join(',') }
        })
    },
    approve: (id: ITransaction['id'], body: Pick<ITransaction, 'status'>) => {
        return ApiClient.patch<Partial<ITransaction>>(`${endpoint}/${id}`, body)
    },
    getTotal: () => {
        return ApiClient.get<Number>(`${endpoint}/total`)
    }
}