import { ObjectClickHandler, IObjectItem } from '../types/dropdown';
import React from 'react';
import '../style.css';
import 'tailwindcss/tailwind.css';
interface IAsyncConfig {
    label: string | Array<string>;
    url: string;
    value?: string;
    query?: {
        [key: string]: any;
    };
}
interface IDropdownProps {
    placeholder: string;
    items?: IObjectItem[];
    onChange: ObjectClickHandler;
    searchable?: boolean;
    emptySearchPhrase?: string;
    noResultsPhrase?: string;
    minimumSearchQuery?: number;
    alternate?: boolean;
    name?: string;
    initialValue?: string;
    asyncConfig?: IAsyncConfig;
    clearable?: boolean;
    roundedClass?: string;
    stylingClassnames?: {
        container?: string;
        input?: string;
        dropdown?: string;
        iconColour?: string;
        rounded?: string;
        shadow?: string;
        highlightColor?: string;
        highlightTextColor?: string;
    };
}
/**
 *
 * @param items - { icon?: {alt: string, url: string}, value: string, label: string, [key: string]: any} - not needed if asyncConfig is provided
 * @param initialValue - initial value from the dropdown options
 * @param placeholder - A string that is displayed as the placeholder for the dropdown
 * @param name - A string that is used as the name for the dropdown - optional if not passed the name returned will be the label of the selected item
 * @param onChange - A function that handles the click event of a dropdown item and returns the item object selected
 * @param searchable - A boolean that determines whether the dropdown is searchable - optional - defaults to false
 * @param alternate - A boolean that determines whether the dropdown displays the emptySearchPhrase or noResultsPhrase and utilises the minimumSearchQuery - optional - defaults to false
 * @param emptySearchPhrase - A string that is displayed when the search input is empty - optional - defaults to "Start typing to search"
 * @param noResultsPhrase - A string that is displayed when the search input returns no results - optional - defaults to "No items match your search"
 * @param minimumSearchQuery - A number that determines the minimum number of characters required to trigger the search - optional - defaults to 1
 * @param stylingClassnames - An object that contains the classnames for the dropdown container, input, dropdown, iconColour, rounded and shadow - optional
 * @param asyncConfig - An object that contains the label, url, value and query for the async dropdown uses the http helper - optional
 * @param clearable - A boolean that determines whether the dropdown can be cleared - optional - defaults to true
 * @returns The dropdown component
 */
export default function Dropdown({ items, initialValue, placeholder, name, onChange, searchable, alternate, emptySearchPhrase, noResultsPhrase, minimumSearchQuery, asyncConfig, stylingClassnames, clearable, }: IDropdownProps): React.JSX.Element;
export {};
