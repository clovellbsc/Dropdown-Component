# Dropdown

### Basic Usage
<img width="619" alt="Screenshot 2023-11-16 at 09 18 42" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/c5f0fbb4-edd9-4523-9aa0-7e832adf567c">

For a basic dropdown you can use a similar set up to the dropdown below:

` <Dropdown
    placeholder="Select your choice"
    items={items}
    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedItem(() => e.target.value)}
    clearable={false}
  />
`

The Placeholder prop will be the text displayed when there is no item selected:

<img width="624" alt="Screenshot 2023-11-16 at 09 05 39" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/10883225-b99d-4046-9de0-c8d38d34bc90">

The items prop is the list of items that will appear in the dropdown. This takes a label and value, with an optional icon object. These need to be in the format of:

` icon?: {
    alt: string
    url: string
  }
  value: string
  label: string
`

The onChange handler exposes the select event object for use for example in the function where e.target.value is assigned to state: 

`onChange={(e: ChangeEvent<HTMLSelectElement>) => {
     setSelectedItem(() => e.target.value)
    }}`

The clearable prop allows the dropdown to be cleared, this by default is set to true, however if once an item is selected, you do not wish the dropdown to be clearable pass false to the clearable prop:

`clearable={false}`

### Multiple Select Basic Usage
<img width="624" alt="Screenshot 2023-11-16 at 09 20 24" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/4eee797e-a253-4780-b08c-f3b6220669ee">

For a basic dropdown you can use a similar set up to the dropdown below, very similar to the basic usage but pass the isMulti prop, which is false by default:

`<Dropdown
  placeholder="Select your choice"
  items={items}
  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedItem(() => e.target.value)}
  isMulti
/>`

### Searchable
By passing the searchable prop, you can make dropdown searchable, this can be used across all versions of the dropdown. Searchable by default is false.

#### Basic Dropdown: 

` <Dropdown
    placeholder="Select your choice"
    items={items}
    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedItem(e.target.value)}
    searchable
  />
`

<img width="624" alt="Screenshot 2023-11-16 at 09 29 11" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/5e8771b8-1ae1-47a7-8e40-41efc1e5ab39">

#### Multi Select Dropdown

`<Dropdown
  placeholder="Select your choice"
  items={items}
  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedItem(e.target.value}
  isMulti
  searchable
/>`

<img width="623" alt="Screenshot 2023-11-16 at 09 42 45" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/8004b7af-4911-4309-b9a3-3623eef0f912">


### Asynchronous Dropdown
<img width="621" alt="Screenshot 2023-11-16 at 09 52 11" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/41094efe-045c-4e40-89ed-c7dda35f45d0">

A simple example of the Async Dropdown is as follows:
  
  `       
  <Dropdown
    searchable
    placeholder="Select your choice"
    asyncFunction={handleAsync}
    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedItem(e.target.value)
    }}
    minimumSearchQuery={3}
  />
`

To implement the asynchronous dropdown you will need to pass a the asyncFunction prop. 
This prop takes a function that has exposes the filterText from within the component. 
The filterText is the string typed into the search input. 
The function should return an array of items in the format shown before:

` icon?: {
    alt: string
    url: string
  }
  value: string
  label: string
`

An example of such a function is as follows: 
  
  `const handleAsync = async (filterText: string) => {
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
  }`

When passing the asyncFunction prop, you should not pass anything to the items prop.

The async request is debounced in the dropdown component, so there is no need to debounce the asynFunction yourself.

** To utilise the async dropdown you must also pass the searchable prop. **

Another key feature of the async dropdown is that you can pass the minimumSearchQuery prop, which takes a number, the default being 1. 
This is the minimum number of characters the user has to type into the search field in order for the asyncFunction to be triggered.
This can be useful if you do not want an excessive number of results returned to the dropdown.
A message will be displayed whilst the user has not reached the minimumSearchQuery, eg:

<img width="622" alt="Screenshot 2023-11-16 at 10 16 59" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/a6a42bb7-92e3-49af-b300-5ce300d6bb17">

To customise the message displayed whilst the user has not met the minimumSearchQuery, you can pass the prop emptySearchPhrase with a string that will be displayed instead.
By default the message is: 'Start typing to search'

Whilst the data is loading from the backend there will be a message displayed simply stating 'Loading results', this currently cannot be overwritten.

<img width="633" alt="Screenshot 2023-11-16 at 10 24 42" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/2937a2b1-e676-4855-953d-61c77424f77f">

If there are no results returned from the asyncFunction then the following shall be displayed

<img width="619" alt="Screenshot 2023-11-16 at 10 26 34" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/3d42da00-a7dc-474a-80cb-5e6338b2ccd7">

This message can be changed by passing in the noResultsPhrase prop, which takes a string that will be displayed.

#### Multiple Select - Async Dropdown
<img width="876" alt="Screenshot 2023-11-17 at 14 18 37" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/2f0497c4-ddb8-4d2e-bae6-100e517cb1f0">

  `       
  <Dropdown
    searchable
    placeholder="Select your choice"
    asyncFunction={handleAsync}
    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedItem(e.target.value)
    }}
    minimumSearchQuery={3}
    isMulti
  />
`

Again, for making the async dropdown a multiple select, just pass the isMulti prop, which defaults to false. 

### Alternate Dropdown
<img width="878" alt="Screenshot 2023-11-17 at 14 28 55" src="https://github.com/clovellbsc/Dropdown-Component/assets/93338557/4fb69246-9631-4e87-9a0f-e996323e13c5">

` <Dropdown
    placeholder="Select your choice"
    items={items}
    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedItem(e.target.value)}
    searchable
    alternate
  />
`

The alternate dropdown acts in a very similar way to the asynchronous dropdown without the asynchronous function.
The alternate dropdown allows you set a minimum search query prior to displaying the dropdown list.
You may also pass the emptySearchPhrase and the noResultsPhrase.




