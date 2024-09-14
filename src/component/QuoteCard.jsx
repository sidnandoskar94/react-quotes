const QuoteCard = ({ id, quote, author }) => {
    return (
        <div className='border border-zinc-600 rounded-sm p-4 bg-gray-100 text-zinc-950'>
            <p>{quote}</p>
            <span className='text-sm font-bold'>- {author}</span>
        </div>
    )
}

export default QuoteCard;