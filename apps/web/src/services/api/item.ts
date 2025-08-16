import { ApiClient } from "@/providers";
import type { ApiPaginateResponse } from "@/types/api";
import type { IItem } from "@/types/item";
import type { PaginateParams } from "@/types/paginate";

const endpoint = '/item';

export default {
    paginate: (params: PaginateParams) => {
        return ApiClient.get<ApiPaginateResponse<IItem>>(endpoint, { params })
    },
    create: (body: Partial<IItem>) => {
        return ApiClient.post<Partial<IItem>>(endpoint, body)
    },
    update: (id: IItem['id'], body: Partial<IItem>) => {
        return ApiClient.put<IItem>(`${endpoint}/${id}`, body)
    },
    remove: (id: IItem['id']) => {
        return ApiClient.delete<IItem>(`${endpoint}/${id}`)
    },
    removeMany: (ids: IItem['id'][]) => {
        return ApiClient.delete<IItem>(endpoint, {
            params: { ids: ids.join(',') }
        })
    }
}