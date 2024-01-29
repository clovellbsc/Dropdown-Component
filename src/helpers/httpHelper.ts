import { IHttpResponse, IRequestParams } from '../types/dropdown'

export default async function http(
  reqOptions: IRequestParams
): Promise<IHttpResponse> {
  const { url, headers, body, query = {}, method = 'GET' } = reqOptions

  let queryString: string = ''

  if (Object.keys(query).length > 0) {
    queryString = `?${new URLSearchParams(query).toString()}`
  }

  try {
    const res = await fetch(`${url}${queryString}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body: typeof body === 'object' ? JSON.stringify(body) : body,
    })
    const data = await res.json()

    if (data.errorMessage) throw new Error(data.errorMessage)

    return { data }
  } catch (error: any) {
    return { error: error.message }
  }
}
