import http from '../helpers/httpHelper'

export default function useDropdownData() {
  // Async function to get dropdown data based on string
  const getDropdownData = async ({
    config,
    label,
    value,
  }: {
    config: any
    label: string | Array<string>
    value: string | undefined
  }) => {
    const { data, error }: any = await http({
      ...config,
      method: 'GET',
    })

    if (error) return { error }

    const response = data?.data?.map((item: any) => {
      return {
        label:
          typeof label === 'string'
            ? item[label]
            : label.reduce(
                (acc, curr) => (curr ? `${acc} ${item[curr]}` : `${acc}`),
                ''
              ),
        value: value ? item[value] : item.id,
      }
    })

    return { data: response }
  }

  return { getDropdownData }
}
