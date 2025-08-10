import { ApiClient } from "@/providers";
import type { ApiPaginateResponse } from "@/types/api";
import type { ILocation } from "@/types/location";
import type { PaginateParams } from "@/types/paginate";

const endpoint = '/location';

export default {
    paginate: (params: PaginateParams) => {
        return ApiClient.get<ApiPaginateResponse<ILocation>>(endpoint, { params })
    },
    create: (body: Partial<ILocation>) => {
        return ApiClient.post<Partial<ILocation>>(endpoint, body)
    },
    update: (id: ILocation['id'], body: Partial<ILocation>) => {
        return ApiClient.put<ILocation>(`${endpoint}/${id}`, body)
    },
    remove: (id: ILocation['id']) => {
        return ApiClient.delete<ILocation>(`${endpoint}/${id}`)
    },
    removeMany: (ids: ILocation['id'][]) => {
        return ApiClient.delete<ILocation>(endpoint, {
            params: { ids: ids.join(',') }
        })
    }
}