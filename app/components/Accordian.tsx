import React, { useContext, createContext, type ReactNode, useState } from 'react'
import { cn } from '~/lib/utils';

interface AccordianContextType {
    activeItems: string[];
    toggleItem: (id: string) => void;
    isItemActive: (id: string) => boolean;
}

const AccordianContext = createContext<AccordianContextType | undefined>(
    undefined
);

const useAccordian = () => {
    const context = useContext(AccordianContext);
    if (!context) {
        throw new Error("Accordian components must be used within an Accordian");
    }
    return context;
};

interface AccordianProps {
    children: ReactNode;
    defaultOpen?: string;
    allowMultiple?: boolean;
    className?: string;
}

export const Accordian: React.FC<AccordianProps> = ({children, defaultOpen, allowMultiple = false, className = "", }) => {
    const [activeItems, setActiveItems] = useState<string[]>(
        defaultOpen ? [defaultOpen] : [] 
    );

    const toggleItem = (id: string) => {
        setActiveItems((prev) => {
            if(allowMultiple) {
                return prev.includes(id)
                    ? prev.filter((item) => item!==id)
                    : [...prev, id];
            } else {
                return prev.includes(id) ? [] : [id];
            }
        });
    };

    const isItemActive = (id: string) => activeItems.includes(id);

    return (
        <AccordianContext.Provider
            value={{activeItems, toggleItem, isItemActive}}
        >
            <div className={`space-y-2 ${className}`}>{children}</div>
        </AccordianContext.Provider>
    );
};

interface AccordianItemProps{
    id: string;
    children: ReactNode;
    className?: string;
}

export const AccordianItem: React.FC<AccordianItemProps> = ({id, children, className = "",}) => {
    return (
        <div className={`overflow-hidden border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

interface AccordianHeaderProps {
    itemId: string;
    children:  ReactNode;
    className?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "Right";
}

export const AccordianHeader: React.FC<AccordianHeaderProps> = ({itemId, children, className="",icon, iconPosition = "right",}) => {
    const {toggleItem, isItemActive} = useAccordian();
    const isActive = isItemActive(itemId);

    const defaultIcon = (
        <svg
            className={cn("w-5 h-5 transition-transform duration-200", {"rotate-180": isActive,})}
            fill='none'
            stroke='#98A2B3'
            viewBox=' 0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 91-7 7-7-7'
            />
        </svg>
    );

    const handleClick = () => {
        toggleItem(itemId);
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full px-4 py-3 text-left focus:outline-none transition-colors duration-200 flex items-center justify-between cursor-pointer ${className}`}
        >
                <div className='flex items-center space-x-3'>
                    {iconPosition === "left" && (icon || defaultIcon)}
                    <div className='flex-1'>{children}</div>
                </div>
                {iconPosition === "right" && (icon || defaultIcon)}
        </button>
    );
};

interface AccordianContentProps {
    itemId: string;
    children: ReactNode;
    className?: string;
}

export const AccordianContent: React.FC<AccordianContentProps> = ({itemId, children, className = "",}) => {
    const {isItemActive} = useAccordian();
    const isActive = isItemActive(itemId);

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
            ${isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0"}
            ${className}
        `}
        >
            <div className='px-4 py-3'>{children}</div>
        </div>
    );
};