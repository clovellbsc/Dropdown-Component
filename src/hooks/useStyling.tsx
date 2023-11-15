import { twMerge } from 'tailwind-merge'
import { IStylingClassnames } from '../types/dropdown'

function useStyling(stylingClassnames?: IStylingClassnames) {
  const defaultClasses = {
    container:
      'inline-block w-full text-left bg-white rounded cursor-pointer max-w-screen border border-gray-400',
    input:
      'absolute top-0 left-0 w-[90%] max-h-full px-5 py-2 text-sm bg-white outline-none',
    dropdown:
      'absolute bottom-0 left-0 z-10 w-full translate-y-full h-fit dropdown-border bg-white',
    iconColour: 'black',
    rounded: 'rounded',
    shadow: 'shadow-md',
    multi: {
      selectedItemContainer:
        'relative flex items-center justify-center px-2 py-1 mr-2 text-sm text-black bg-gray-100 rounded-md shadow-md hover:text-[#F00] group hover:bg-gray-200 transition-all duration-300',
      selectedItemIconBox:
        'absolute right-0 top-0 translate-x-1/2 bg-gray-100 w-fit h-fit shadow-md group p-0.5 rounded-md flex justify-center items-center z-10 group-hover:bg-gray-200 transition-all duration-300',
      selectedItemIcon: 'w-3 h-3 cursor-pointer',
    },
  }

  const combinedClasses = {
    container: twMerge(defaultClasses.container, stylingClassnames?.container),
    input: twMerge(defaultClasses.input, stylingClassnames?.input),
    dropdown: twMerge(defaultClasses.dropdown, stylingClassnames?.dropdown),
    iconColour: stylingClassnames?.iconColour ?? defaultClasses.iconColour,
    rounded: twMerge(defaultClasses.rounded, stylingClassnames?.rounded),
    shadow: twMerge(defaultClasses.shadow, stylingClassnames?.shadow),
    multi: {
      selectedItemContainer: twMerge(
        defaultClasses.multi.selectedItemContainer,
        stylingClassnames?.multi?.selectedItemContainer
      ),
      selectedItemIconBox: twMerge(
        defaultClasses.multi.selectedItemIconBox,
        stylingClassnames?.multi?.selectedItemIconBox
      ),
      selectedItemIcon: twMerge(
        defaultClasses.multi.selectedItemIcon,
        stylingClassnames?.multi?.selectedItemIcon
      ),
    },
  }
  return { combinedClasses }
}

export default useStyling
