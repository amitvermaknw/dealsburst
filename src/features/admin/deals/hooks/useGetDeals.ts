import { useEffect, useReducer } from "react";
import GetDealsReducer from "./reducer/GetDealsReducer";
import { fetchDealsService } from "../services/fetchDealsService";
import { GET_DEALS } from "../../../../utils/Constants";
import { ProductListProps } from "../../../../utils/Types";

const useGetDeals = (initState: Array<ProductListProps>) => {

    const [state, dispatch] = useReducer(GetDealsReducer, initState)

    useEffect(() => {
        async function getDeals() {
            const result = await fetchDealsService();
            dispatch({ type: GET_DEALS, content: result })
        }
        getDeals();
    }, [])

    return [state];
};

export default useGetDeals;