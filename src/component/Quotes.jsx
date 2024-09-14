// With intersection observer

import { useCallback, useRef, useState } from 'react';
import useFetchQuotes from '../hooks/useFetchQuotes';
import QuoteCard from './QuoteCard';

const Quotes = () => {
    const [skip, setSkip] = useState(0);
    const limit = 50;
    const { quotes, error, loading, hasMore } = useFetchQuotes(limit, skip);

    // useRef is used because it ensures that the observer instance survives re-renders. Without useRef, the observer would be recreated on each render, leading to inefficiency.
    const observer = useRef();

    const lastMemeElementRef = useCallback((node) => {

        // This prevents the function from running if memes are still being fetched
        if (loading) return;

        // observer.current: holds a reference to the existing IntersectionObserver instance (stored in useRef).
        // Before creating a new observer, the old observer is disconnected to avoid having multiple observers tracking the same element.
        // This ensures that we only observe the new "last meme" element without any leftover observers watching old elements.
        if (observer.current) observer.current.disconnect();

        //A new IntersectionObserver instance is created. This will observe the node (the last meme element).
        // The callback function will be called when the element intersects with the viewport.
        // If the element is intersecting with the viewport and the hasMore state is true, then the skip state is incremented.
        // This will trigger the fetchQuotes hook to fetch more quotes.
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setSkip((prevSkip) => prevSkip + limit);
            }
        }, { rootMargin: '500px' });

        // This line attaches the observer to the new node (the last meme element).
        // If node exists, we start observing it for when it appears in the viewport.
        if (node) observer.current.observe(node);

    }, [loading, hasMore]);

    return (
        <div className='quotes-wrapper flex flex-wrap gap-3'>
            {error && <p className='w-full'>Error While Fetching Quotes...</p>}
            {quotes?.length > 0 && quotes.map((quote, index) =>
                <div key={quote.id} ref={index === quotes.length - 1 ? lastMemeElementRef : null} id={`quote-${quote.id}`} className='quotes-list flex-auto flex-shrink-0 w-full' >
                    <QuoteCard {...quote} />
                </div>
            )
            }
            {!hasMore && <div className='w-full py-4 text-black font-black'>No more motivation available....</div>}
            {loading && <p className='w-full text-xl text-black font-black py-2'>Fetching Quotes...</p>}
        </div>
    )
}

export default Quotes