import { fromCognitoIdentityPool as FromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { idToken } from "./misc"

const identityPoolId = import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID
const identityProvider = import.meta.env.VITE_APP_COGNITO_IDENTITY_PROVIDER
const region = import.meta.env.VITE_APP_COGNITO_REGION

const curryCognitoCreds = async () => {
  const creds = new FromCognitoIdentityPool({
    client: new CognitoIdentityClient({
      region,
    }),
    identityPoolId,
    logins: {
      [identityProvider]: idToken,
    },
  })

  const credentials = await creds()

  return (fn) => (val) => fn(credentials, val)
}

export { curryCognitoCreds }
