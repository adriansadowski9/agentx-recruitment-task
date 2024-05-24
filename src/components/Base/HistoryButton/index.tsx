import * as React from 'react';

interface HistoryButtonProps {
    onClick: () => void
    children: React.ReactNode
}

const HistoryButton: React.FC<HistoryButtonProps> = ({ onClick, children }) => {
    return (
        <button 
            type="button" 
            onClick={onClick}
            className="bg-white text-violet-500 font-semibold py-1 px-4 mr-2 my-1 border border-violet-400 rounded-full hover:text-white hover:border-white hover:bg-violet-400"
        >
            {children}
        </button>
    )
}

export default HistoryButton