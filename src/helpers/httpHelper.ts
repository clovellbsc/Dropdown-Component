interface IRequestParams {
  url: string
  method: string
  query?: Record<string, any>
  body?: object
  headers?: object
}

interface IHttpResponse {
  data?: { [key: string]: any } | any[]
  error?: string
}

export default async function http(
  reqOptions: IRequestParams
): Promise<IHttpResponse> {
  const { url, headers, body, query = {}, method = "GET" } = reqOptions

  let queryString: string = ""

  if (Object.keys(query).length > 0) {
    queryString = `?${new URLSearchParams(query).toString()}`
  }

  try {
    const res = await fetch(`${url}${queryString}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: typeof body === "object" ? JSON.stringify(body) : body,
    })
    const data = await res.json()

    if (data.errorMessage) throw new Error(data.errorMessage)

    return { data }
  } catch (error: any) {
    return { error: error.message }
  }
}
