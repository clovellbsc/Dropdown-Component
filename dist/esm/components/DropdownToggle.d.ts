import React from 'react';
import 'tailwindcss/tailwind.css';
interface IProps {
    label: string;
    placeholder: string;
    handleRemoveSelected?: () => void;
    removeSearchText: () => void;
    isOpen: boolean;
    iconColour?: string;
    handleToggle: () => void;
    clearable: boolean;
}
export default function DropdownToggle({ label, placeholder, handleRemoveSelected, removeSearchText, isOpen, iconColour, handleToggle, clearable, }: IProps): React.JSX.Element;
export {};
