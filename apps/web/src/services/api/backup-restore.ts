import { ApiClient } from "@/providers"
import type { AxiosResponse } from "axios";

export default {
    backup: () => {
        return ApiClient.get(`/backup`);
    },
    downloadBackup: (fileName: string): Promise<AxiosResponse<Blob>> => {
        return ApiClient.get('/backup/download', {
            params: { file: fileName },
            responseType: 'blob',
        });
    },
    restore: (formData: FormData) => {
        return ApiClient.post(`/restore`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}