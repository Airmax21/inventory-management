import { ApiClient } from "@/providers";
import type { ApiPaginateResponse } from "@/types/api";
import type { ICategory } from "@/types/category";
import type { PaginateParams } from "@/types/paginate";

const endpoint = '/category';

export default {
    paginate: (params: PaginateParams) => {
        return ApiClient.get<ApiPaginateResponse<ICategory>>(endpoint, { params })
    },
    create: (body: Partial<ICategory>) => {
        return ApiClient.post<Partial<ICategory>>(endpoint, body)
    },
    update: (id: ICategory['id'], body: Partial<ICategory>) => {
        return ApiClient.put<ICategory>(`${endpoint}/${id}`, body)
    },
    remove: (id: ICategory['id']) => {
        return ApiClient.delete<ICategory>(`${endpoint}/${id}`)
    },
    removeMany: (ids: ICategory['id'][]) => {
        return ApiClient.delete<ICategory>(endpoint, {
            params: { ids: ids.join(',') }
        })
    }
}