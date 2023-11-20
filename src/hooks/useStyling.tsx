import { twMerge } from 'tailwind-merge'
import { IStylingClassnames } from '../types/dropdown'

function useStyling({
  stylingClassnames,
}: {
  stylingClassnames?: IStylingClassnames
}) {
  const defaultClasses = {
    container: `flex w-full text-left bg-white rounded cursor-pointer max-w-screen border border-gray-400 relative py-1 h-fit items-center`,
    input: `flex h-full px-5 py-2 text-sm bg-white outline-none max-w-[100%] w-1/2`,
    dropdown:
      'absolute bottom-0 left-0 z-[1] w-full translate-y-full h-fit dropdown-border bg-white',
    iconColour: 'black',
    rounded: 'rounded',
    shadow: 'shadow-md',
    multi: {
      multiLabelContainer: `flex flex-wrap gap-y-1.5 gap-x-2 relative left-0 w-full`,
      selectedItemContainer: `flex items-center relative gap-x-2 justify-center max-w-[100%] z-[2] px-2 py-1 mr-2 text-black bg-gray-100 rounded-md shadow-md hover:text-[#F00] group hover:bg-gray-200 transition-all duration-300 text-sm`,
      selectedItemIconBox: 'bg-transparent w-fit h-fit',
      selectedItemIcon: 'w-4 h-4 cursor-pointer',
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
      multiLabelContainer: twMerge(
        defaultClasses.multi.multiLabelContainer,
        stylingClassnames?.multi?.multiLabelContainer
      ),
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
