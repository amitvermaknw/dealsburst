/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { DealsReview } from '../../../../utils/Interface';
import { fetchDealsReview } from './helper/cacheDealsReview';
import { DealsReviewInt } from '../interface/dreviews';

const mode = import.meta.env;
const baseUrl = mode.DEV === true ? import.meta.env.VITE_REVIEW_SERVICE_LOCAL : import.meta.env.VITE_REVIEW_SERVICE_PROD;

export const getDealsReview = async (deals: DealsReviewInt, _db: unknown): Promise<Array<DealsReview> | Array<[]>> => {
    try {
        const response = await fetchDealsReview(_db);
        if (response.length) {
            return response;
        } else {
            const result: AxiosResponse<Array<DealsReview>> = await axios.get<Array<DealsReview>>(`${baseUrl}/deals/review/${deals.userId}/${deals.dealsId}/${deals.page}`);
            if (result.status === 200) {
                return result.data;
            } else {
                toast.error(result.statusText);
                return [];
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        }
        return [];
    }
}

export const addDealsReview = async (payload: DealsReview, _db: any): Promise<string> => {
    try {
        const matchingDocs = await _db.userToken.find().exec();
        const result: AxiosResponse<DealsReview> = await axios.post<DealsReview>(`${baseUrl}/deals/review`, payload, { headers: { Authorization: matchingDocs.accessToken } });
        if (result.status === 200) {
            return result.data as unknown as string;
        } else {
            toast.error(result.statusText);
            return result.data as unknown as string;
        }
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        }
        return 'error';
    }
}