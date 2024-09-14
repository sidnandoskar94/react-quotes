import { useEffect, useState } from "react";
import { quotesAPIURL } from "../config/config";

const useFetchQuotes = (limit = 10, skip = 0) => {
    const [quotes, setQuotes] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);

                const fetchedQuotes = await fetch(`${quotesAPIURL}?limit=${limit}&skip=${skip}`, { signal: controller.signal });
                const quotesData = await fetchedQuotes.json();
                const hasMore = quotesData.total > Number(quotesData.skip + quotesData.limit);

                setQuotes((prevQuotes) => {
                    return [...prevQuotes, ...quotesData?.quotes || []]
                });

                setHasMore(hasMore);
                setError(false);
                setLoading(false);
            } catch (err) {
                if (err.name === "AbortError") {
                    console.warn("the fetch was aborted")
                } else {
                    setError(true);
                }
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

        return () => {
            controller.abort();
        };
    }, [limit, skip]);


    return { quotes, error, loading, hasMore };
}

export default useFetchQuotes;