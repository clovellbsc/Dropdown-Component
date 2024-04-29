# Dropdown

### Basic Usage

<img width="100%" alt="Basic Dropdown" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/d83f21fe-78c1-4a67-bcd9-95678dcd25ef">

For a basic dropdown you can use a similar set up to the dropdown below:

```
<Dropdown
  items={items}
  placeholder="Select an item"
  onChange={(e) => setSelectedItem(e.target.value)}
/>
```

The Placeholder prop will be the text displayed when there is no item selected:

<img width="100%" alt="Placeholder Dropdown" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/1e051550-339f-43ae-be7a-c09d7d7a536c">

The items prop is the list of items that will appear in the dropdown. This takes a label and value, with an optional icon object. These need to be in the format of:

```
icon?: {
    alt: string
    url: string
  }
  value: string
  label: string
```

The label and value keys are straightforward enough, these are the same as any other dropdown component. The icon will be displayed alongside the text in the dropdown, this will be an img tag with a url and an alt value.

The onChange handler exposes the select event object for use for example in the function where e.target.value is assigned to state:

```
onChange={(e: ChangeEvent<HTMLSelectElement>) => {
     setSelectedItem(() => e.target.value)
    }}
```

The clearable prop allows the dropdown to be cleared, this by default is set to true, however if once an item is selected, you do not wish the dropdown to be clearable pass false to the clearable prop:

`clearable={false}`

### Multiple Select Basic Usage

<img width="100%" alt="Multiple Dropdown" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/220867d0-15f6-40ce-bc74-c291eec3ad3c">

For a basic dropdown you can use a similar set up to the dropdown below, very similar to the basic usage but pass the isMulti prop, which is false by default:

```
<Dropdown
  placeholder="Select your choice"
  items={items}
  onChange={(e) => {
    // Getting the options from the event target
    const { options } = e.target

    // Getting the array of values from the options
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value)

    // Setting the array of values to state
    setSelectedItems(selectedOptions)
  }}
  isMulti={true}
  value={selectedItems}
/>
```

The value prop is a list of values for the dropdown options.
As you can see in the above code, the onChange function grabs the values from the selected options and stores it in state.
This is what is used for the value prop.

### Searchable

By passing the searchable prop, you can make dropdown searchable, this can be used across all versions of the dropdown. Searchable by default is false.

#### Basic Dropdown:

<img width="100%" alt="Basic Searchable Dropdown" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/78aa3239-5b6f-4b14-ae5c-2a00940999c0">

```
 <Dropdown
  items={items}
  placeholder="Select an item"
  onChange={(e) => setSelectedItem(e.target.value)}
  searchable={true}
/>
```

#### Multi Select Dropdown

<img width="100%" alt="Multi Searchable Dropdown" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/cd266979-c2f1-4bce-9480-8a1a47689561">

```
<Dropdown
  placeholder="Select your choice"
  items={items}
  onChange={(e) => {
    // Getting the options from the event target
    const { options } = e.target

    // Getting the array of values from the options
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value)

    // Setting the array of values to state
    setSelectedItems(selectedOptions)
  }}
  isMulti={true}
  value={selectedItems}
  searchable={true}
/>
```

### Asynchronous Dropdown

<img width="100%" alt="Screenshot 2024-03-20 at 16 46 50" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/15eead4f-a993-4d43-93fc-51526b23942f">

A simple example of the Async Dropdown is as follows:

```
<Dropdown
placeholder="Select an item"
onChange={(e) => {
  const { value, selectedOptions } = e.target

  const label = selectedOptions[0]?.label

  setFullCountryDetails({ label: label, value: value })
}}
searchable
asyncFunction={handleAsync}
asyncValue={fullCountryDetails}
debounceTime={500}
/>
```

To implement the asynchronous dropdown you will need to pass a the asyncFunction prop.
This prop takes a function that has exposes the filterText from within the component.
The filterText is the string typed into the search input.
The function should return an object with a data key with an associated value as an array of items in the format shown before:

```
 icon?: {
    alt: string
    url: string
  }
  value: string
  label: string
```

An example of such a function is as follows:

```
const handleAsync = async (filterText: string) => {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${filterText}`
  )

  const data = await response.json()

  const formattedData = !data?.status
    ? data?.map((country: any) => ({
        label: country.name.common,
        value: country.name.common,
      }))
    : []

  return {
    data: formattedData,
  }
}
```

**When passing the asyncFunction prop, you should not pass anything to the items prop otherwise this will cause the dropdown to not work correctly.**

The async request is debounced in the dropdown component, so there is no need to debounce the asynFunction yourself. However, you are able to pass the debounceTime.
By default The debounceTime is 300ms and any time you pass through to the debounce time must be in milliseconds.

**To utilise the async dropdown you must also pass the searchable prop as true.**

Another key feature of the async dropdown is that you can pass the minimumSearchQuery prop, which takes a number, the default being 1.
This is the minimum number of characters the user has to type into the search field in order for the asyncFunction to be triggered.
This can be useful if you do not want an excessive number of results returned to the dropdown, or if you only want to make calls to the database after a certain number of characters.
A message will be displayed whilst the user has not reached the minimumSearchQuery, eg:

<img width="100%" alt="Screenshot 2024-03-21 at 09 27 14" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/0a979fc5-b81d-4468-96de-0e471a50a382">

To customise the message displayed whilst the user has not met the minimumSearchQuery, you can pass the prop emptySearchPhrase with a string that will be displayed instead.
By default the message is: 'Start typing to search'

Whilst the data is loading from the backend there will be a message displayed simply stating 'Loading results', this currently cannot be overwritten.

<img width="100%" alt="Screenshot 2023-11-16 at 10 24 42" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/2937a2b1-e676-4855-953d-61c77424f77f">

If there are no results returned from the asyncFunction then the following shall be displayed

<img width="100%" alt="Screenshot 2023-11-16 at 10 26 34" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/3d42da00-a7dc-474a-80cb-5e6338b2ccd7">

This message can be changed by passing in the noResultsPhrase prop, which takes a string that will be displayed.

When using the async dropdown there is a different prop to pass the value into the component, this is the **asyncValue** prop. This needs to have a different format compared to the value prop.
Where the value prop is just used with the value of the dropdown option. The asyncValue requires the label and value.
The data passed through this prop needs to look something like the following:

```
{ label: 'Uganda', value: '256' }
```

This can also be used to set any initial values that you want. For example:

```
  const [fullCountryDetails, setFullCountryDetails] = useState<
    | {
        label: string
        value: string
      }
    | undefined
  >({ label: 'Namibia', value: 'Namibia' })

<Dropdown
  placeholder="Select an item"
  onChange={(e) => {
    const { value, selectedOptions } = e.target

    const label = selectedOptions[0]?.label

    setFullCountryDetails({ label: label, value: value })
  }}
  searchable
  asyncFunction={handleAsync}
  asyncValue={fullCountryDetails}
  />
```

<img width="100%" alt="Screenshot 2024-03-21 at 09 40 21" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/bff74c9c-774b-4767-ac82-654d625e3ce9">

#### Multiple Select - Async Dropdown

<img width="100%" alt="Screenshot 2023-11-17 at 14 18 37" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/2f0497c4-ddb8-4d2e-bae6-100e517cb1f0">

```
<Dropdown
  placeholder="Select an item"
  onChange={(e) => {
    const { value, selectedOptions } = e.target

    const label = selectedOptions[0]?.label

    setFullCountryDetails({ label: label, value: value })
  }}
  searchable
  asyncFunction={handleAsync}
  asyncValue={allCountryDetails}
  minimumSearchQuery={2}
  isMulti
/>
```

Again, for making the async dropdown a multiple select, just pass the isMulti prop, which defaults to false.

In this case the asyncValue prop will need to be an array of items. Other than that, this pretty much works identically to the basic asynchronous dropdown that you can read about above.

### Alternate Dropdown

<img width="878" alt="Screenshot 2023-11-17 at 14 28 55" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/4fb69246-9631-4e87-9a0f-e996323e13c5">

```
<Dropdown
    placeholder="Select your choice"
    items={items}
    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedItem(e.target.value)}
    searchable
    alternate
  />
```

The alternate dropdown acts in a very similar way to the asynchronous dropdown without the asynchronous function.
The alternate dropdown allows you set a minimum search query prior to displaying the dropdown list.
You may also pass the emptySearchPhrase and the noResultsPhrase.

## Styling

To style the dropdown component you can pass through the stylingClassnames prop. Examples for each option are listed below (The styles are ugly but to make it obvious what is being styled):

```
    <Dropdown
      name="receiver_id"
      searchable
      asyncFunction={handleAsyncRequest}
      placeholder="Start typing..."
      onChange={handleSelectChange}
      minimumSearchQuery={3}
      noResultsPhrase="No colleagues found"
      emptySearchPhrase="Start typing..."
      stylingClassnames={{
        input: "border-none",
        dropdown: "shadow-md",
      }}
    />
```

The way that the styling classnames works, is that it starts with the following default styling classnames:

```
  const defaultClasses = {
    container: `flex w-full text-left bg-white rounded cursor-pointer max-w-screen border border-gray-400 relative py-1 h-fit items-center`,
    input: `flex h-full px-5 py-2 text-sm bg-white outline-none w-full flex-1`,
    dropdown:
      'absolute bottom-0 left-0 z-[1] w-full translate-y-full h-fit bg-white',
    dropdownItem:
      'focus:outline-none flex gap-2.5 cursor-pointer w-full h-full text-sm pl-5 py-1 items-center',
    iconColour: 'black',
    rounded: 'rounded',
    shadow: 'shadow-md',
    highlightColor: 'bg-[#0000FF]',
    highlightTextColor: 'text-white',
    multi: {
      multiLabelContainer: `flex flex-wrap gap-y-1.5 gap-x-2 relative left-0 w-full`,
      selectedItemContainer: `flex items-center relative gap-x-2 justify-center max-w-[100%] z-[2] px-2 py-1 mr-2 text-black bg-gray-100 rounded-md shadow-md hover:text-[#F00] group hover:bg-gray-200 transition-all duration-300 text-sm cursor-pointer`,
      selectedItemIconBox: 'bg-transparent w-fit h-fit',
      selectedItemIcon: 'w-4 h-4',
    },
  }
```

You can make additions or changes to the above styling without removing all of the classnames, this is done by utilising tailwind-merge. This therefore takes any tailwind classes that you pass to the styling classnames and overwrites any conflicting classnames on the dropdown, therefore you don't have to write all styling from scratch, if you only want to make one change.

#### Container

<img width="100%" alt="Screenshot 2024-03-27 at 12 02 07" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/c21953b5-11d2-44b2-a45d-ff3dde329af9">

This is the overall container of the dropdown, which has the following default classnames

```
container: 'flex w-full text-left bg-white rounded cursor-pointer max-w-screen border border-gray-400 relative py-1 h-fit items-center'
```

An example implementation of the container styling would be the following:

```
<Dropdown
  placeholder="Select an item"
  items={items}
  onChange={(e) => setSelectedItem(e.target.value)}
  stylingClassnames={{
    container: 'border-2 border-white-500 rounded-full pr-2',
  }}
/>
```

#### Input

<img width="100%" alt="Screenshot 2024-03-27 at 12 12 52" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/d8730722-b529-4d55-83c4-1ab3d676b3b9">

This is the styling for the input, which is used for searchable dropdowns

```
input: 'flex h-full px-5 py-2 text-sm bg-white outline-none max-w-[100%] flex-1'
```

An example implementation of the input styling would be the following:

```
<Dropdown
  placeholder="Select an item"
  items={items}
  onChange={(e) => setSelectedItem(e.target.value)}
  searchable
  stylingClassnames={{
    input: 'border-2 border-gray-500',
  }}
/>
```

#### Dropdown

<img width="100%" alt="Screenshot 2024-03-27 at 12 21 09" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/4f22e795-4e9b-4fe9-a94b-0b9fa49c6e08">

This is the styling for the container of the dropdown list

```
dropdown: 'absolute bottom-0 left-0 z-[1] w-full translate-y-full h-fit bg-white'
```

```
<Dropdown
  placeholder="Select an item"
  items={items}
  onChange={(e) => setSelectedItem(e.target.value)}
  searchable
  stylingClassnames={{
    dropdown: 'border-2 border-gray-500',
  }}
/>
```

#### Icon Colour

<img width="100%" alt="Screenshot 2024-03-27 at 12 23 46" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/d68ecbfb-7e00-4cee-83db-28a16a70ae72">

As the name suggests, this is the colour of the icons, the chevrons and the X.

```
iconColour: 'red'
```

```
<Dropdown
  placeholder="Select an item"
  items={items}
  onChange={(e) => setSelectedItem(e.target.value)}
  searchable
  stylingClassnames={{
    iconColour: 'red'
  }}
/>
```

#### Rounded

<img width="100%" alt="Screenshot 2024-03-27 at 12 28 02" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/56f70a96-1230-4671-befd-8b5226faf044">

This class is used to provide a border radius to the dropdown and container, should you wish them to be the same and not individually style them

```
rounded: 'rounded'
```

```
<Dropdown
  placeholder="Select an item"
  items={items}
  onChange={(e) => setSelectedItem(e.target.value)}
  searchable
  stylingClassnames={{
    rounded: 'rounded-lg'
  }}
/>
```

### Multi

Multi is a group of styles for styling the multi specific styles, for example the selected items.

```
{
    multiLabelContainer: `flex flex-wrap gap-y-1.5 gap-x-2 relative left-0 w-full`,
    selectedItemContainer: `flex items-center relative gap-x-2 justify-center max-w-[100%] z-[2] px-2 py-1 mr-2 text-black bg-gray-100 rounded-md shadow-md hover:text-[#F00] group hover:bg-gray-200 transition-all duration-300 text-sm`,
    selectedItemIconBox: 'bg-transparent w-fit h-fit',
    selectedItemIcon: 'w-4 h-4 cursor-pointer',
}
```

#### Multi Label Container

<img width="100%" alt="Screenshot 2024-03-27 at 12 41 23" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/c5f09e5e-8b3a-490e-b08f-5a337dee48a7">

This is used to style the container of all the selected items, should you wish you could make it absolute to display the items above the dropdown should you wish

```
multiLabelContainer: `flex flex-wrap gap-y-1.5 gap-x-2 relative left-0 w-full`
```

```
<Dropdown
  placeholder="Select an item"
  items={items}
  isMulti
  onChange={handleChange}
  value={selectedItems}
  stylingClassnames={{
    multi: {
      multiLabelContainer: 'flex flex-col gap-4 border-2 border-gray-500 p-2',
    },
  }}
/>
```

#### Selected Item Container

<img width="100%" alt="Screenshot 2024-03-27 at 14 04 46" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/44b4cf28-13fb-4315-8ff3-1b83c8bba7f4">

This is the container for each individual selected item.

```
selectedItemContainer: `flex items-center relative gap-x-2 justify-center max-w-[100%] z-[2] px-2 py-1 mr-2 text-black bg-gray-100 rounded-md shadow-md hover:text-[#F00] group hover:bg-gray-200 transition-all duration-300 text-sm`
```

```
<Dropdown
  placeholder="Select an item"
  items={items}
  isMulti
  onChange={handleChange}
  value={selectedItems}
  stylingClassnames={{
    multi: {
      selectedItemContainer: 'bg-blue-500 text-white',
    },
  }}
/>
```

#### Selected Item Icon Box

<img width="100%" alt="Screenshot 2024-03-27 at 14 11 39" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/345d963f-dda1-4cf4-8f6f-c54554c1b147">

This is for styling the container of the icon, this is incase you do not wish for the icon to be inline in the selected item container but if you wanted to make it absolutely positioned top right of the selected item box for example

```
selectedItemIconBox: 'bg-transparent w-fit h-fit'
```

```
<Dropdown
  placeholder="Select an item"
  items={items}
  isMulti
  onChange={handleChange}
  value={selectedItems}
  stylingClassnames={{
    multi: {
      selectedItemIconBox: 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-gray-300 rounded-md',
    },
  }}
/>
```

#### Selected Item Icon

<img width="100%" alt="Screenshot 2024-03-27 at 14 15 12" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/99409321-d83a-4152-a054-df6788b269a6">

This is for styling the actual X Icon, if you want to change it's size etc.

```
selectedItemIcon: 'w-4 h-4 cursor-pointer'
```

```
<Dropdown
  placeholder="Select an item"
  items={items}
  isMulti
  onChange={handleChange}
  value={selectedItems}
  stylingClassnames={{
    multi: {
      selectedItemIcon: 'w-4 h-4 stroke-red-500 stroke-2',
    },
  }}
/>
```
