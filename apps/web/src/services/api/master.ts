import { ApiClient } from "@/providers";
import type { ApiPaginateResponse } from "@/types/api";
import type { IMaster } from "@/types/master";
import type { PaginateParams } from "@/types/paginate";

const endpoint = '/master';

export default {
    paginate: (params: PaginateParams) => {
        return ApiClient.get<ApiPaginateResponse<IMaster>>(endpoint, { params })
    },
    create: (body: Partial<IMaster>) => {
        return ApiClient.post<Partial<IMaster>>(endpoint, body)
    },
    update: (id: IMaster['id'], body: Partial<IMaster>) => {
        return ApiClient.put<IMaster>(`${endpoint}/${id}`, body)
    },
    remove: (id: IMaster['id']) => {
        return ApiClient.delete<IMaster>(`${endpoint}/${id}`)
    },
    removeMany: (ids: IMaster['id'][]) => {
        return ApiClient.delete<IMaster>(endpoint, {
            params: { ids: ids.join(',') }
        })
    }
}