const getIdToken = () => {
  const modifiedUrl = window.location.href.replace("#", "?")
  const url = new URL(modifiedUrl)

  return url.searchParams.get("id_token")
}

const idToken = getIdToken()

export { idToken }
