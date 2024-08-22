import { useContext, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DealsReview } from "../../../../utils/Interface";
import DealsReviewReducer from "./reducer/DealsReviewReducer";
import { getDealsReview, addDealsReview } from "../services/dealsReviewService";
import { GET_REVIWS } from "../../../../utils/Constants";
import { DbContext } from "../../../../providers/DBProvider";
import { dealsReviewSchema } from "../../../../schema/dealsReviewSchema";
import { insertDealsReview } from "../services/helper/cacheDealsReview";
import { DealsReviewInt } from "../interface/dreviews";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDealsReview = (initState: any) => {

    const [prstate, dispatch] = useReducer(DealsReviewReducer, initState);
    const navigate = useNavigate();
    const localDb = useContext(DbContext);

    useEffect(() => {
        async function setSchema() {
            if (localDb?.db) {
                await localDb?.db.addCollections({
                    dealsReview: {
                        schema: dealsReviewSchema
                    }
                })
            }
        }

        setSchema();
    }, [localDb?.db])

    const getReview = async (dealsReq: DealsReviewInt) => {
        const result = await getDealsReview(dealsReq, localDb?.db);
        if (result) {
            dispatch({ type: GET_REVIWS, content: result, });
        } else {
            navigate('/404');
        }
    }

    const addReview = async (payload: DealsReview) => {
        const result = await addDealsReview(payload, localDb?.db);
        if (result) {
            dispatch({ type: GET_REVIWS, content: [payload] })
            await insertDealsReview(localDb, payload);
        }
    }


    return [prstate, getReview, addReview] as const;
};

export default useDealsReview;