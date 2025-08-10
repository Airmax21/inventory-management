import { ApiClient } from "@/providers";
import type { ApiPaginateResponse } from "@/types/api";
import type { IUser } from "@/types/auth";
import type { PaginateParams } from "@/types/paginate";

const endpoint = '/user';

export default {
    paginate: (params: PaginateParams) => {
        return ApiClient.get<ApiPaginateResponse<IUser>>(endpoint, { params })
    },
    update: (id: IUser['id'], body: Partial<IUser>) => {
        return ApiClient.put<IUser>(`${endpoint}/${id}`, body)
    },
    remove: (id: IUser['id']) => {
        return ApiClient.delete<IUser>(`${endpoint}/${id}`)
    },
    removeMany: (ids: IUser['id'][]) => {
        return ApiClient.delete<IUser>(endpoint, {
            params: { ids: ids.join(',') }
        })
    }
}