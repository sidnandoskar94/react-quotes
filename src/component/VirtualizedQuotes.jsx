// With intersection observer

import { useState } from 'react';
import useFetchQuotes from '../hooks/useFetchQuotes';
import QuoteCard from './QuoteCard';
import { FixedSizeList as List } from 'react-window';


const VirtualizedQuotes = () => {
    const [skip, setSkip] = useState(0);
    const limit = 20;
    const { quotes, error, loading, hasMore } = useFetchQuotes(limit, skip);

    // Detect when the user is near the bottom to load more memes
    const handleScroll = ({ scrollOffset, scrollHeight }) => {
        if (!loading && hasMore && scrollHeight - scrollOffset < 300) {
            setSkip((prevSkip) => prevSkip + limit);
        }
    };

    return (
        <div className='quotes-wrapper flex flex-wrap gap-3'>
            {error && <p className='w-full'>Error While Fetching Quotes...</p>}
            {quotes?.length > 0 &&
                <List
                    height={500} // Height of the scrolling container
                    itemCount={quotes.length} // Total number of items
                    itemSize={100} // Height of each item (assuming meme images are around 200px)
                    width="100%" // Full width container
                    onScroll={handleScroll} // Detect when to load more
                >
                    {({ index, style }) => (
                        <div key={quotes[index].id} id={`quote-${quotes[index].id}`} className='quotes-list flex-auto flex-shrink-0 w-full' >
                            <QuoteCard {...quotes[index]} />
                        </div>
                    )}
                </List>
            }
            {!hasMore && <div className='w-full'>No more motivation available....</div>}
            {loading && <p className='w-full text-xl text-black font-bold py-2'>Fetching Quotes...</p>}
        </div>
    )
}

export default VirtualizedQuotes