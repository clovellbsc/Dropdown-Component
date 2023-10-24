import { IObjectItem } from '../types/dropdown';
import React from 'react';
import 'tailwindcss/tailwind.css';
interface IDropdownItemProps {
    item: IObjectItem;
    highlighted: boolean;
    selected: boolean;
    highlightColor: string;
    highlightTextColor: string;
}
export default function Item({ item, highlighted, selected, highlightColor, highlightTextColor, }: IDropdownItemProps): React.JSX.Element;
export {};
