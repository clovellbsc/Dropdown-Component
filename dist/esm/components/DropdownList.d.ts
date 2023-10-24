import { IObjectItem } from '../types/dropdown';
import React from 'react';
import 'tailwindcss/tailwind.css';
interface IDropdownListProps {
    filterText: string;
    minimumSearchQuery: number;
    data: IObjectItem[];
    emptySearchPhrase: string;
    noResultsPhrase: string;
    handleClick: (item: IObjectItem) => void;
    dropdownClassnames: string;
    loading?: boolean;
    highlightedIndex?: number;
    handleMouseOver: (index: number) => void;
    selected: IObjectItem | null;
    highlightColor: string;
    highlightTextColor: string;
}
export default function DropdownList({ filterText, minimumSearchQuery, data, emptySearchPhrase, noResultsPhrase, handleClick, dropdownClassnames, loading, highlightedIndex, handleMouseOver, selected, highlightColor, highlightTextColor, }: IDropdownListProps): React.JSX.Element;
export {};
