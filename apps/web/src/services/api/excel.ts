import { ApiClient } from "@/providers"

const endpoint = '/excel'

export default {
    master: () => {
        return ApiClient.get(`${endpoint}/master`,{
            responseType: 'blob'
        })
    },
    item: () => {
        return ApiClient.get(`${endpoint}/items`,{
            responseType: 'blob'
        })
    },
    transaction: () => {
        return ApiClient.get(`${endpoint}/transactions`,{
            responseType: 'blob'
        })
    }
} 