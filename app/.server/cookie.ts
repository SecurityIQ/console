// create a function that get cookie from request prop

export function getCookie(request: Request) {
  const cookieHeader = request.headers.get('Cookie')
  const cookies = new URLSearchParams(cookieHeader?.replace(/;\s*/g, '&'))
  return cookies
}