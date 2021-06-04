import "./style.css"
import { idToken } from "./utils/misc"
import { listItems, upload } from "./utils/s3"

const App = async () => {
  if (!idToken) {
    return (document.querySelector("#app").innerHTML = `
      <h1 id="title">AWS Simple Cognito Auth</h1>
      <div id="content">
        <a id="login-link" href="${
          import.meta.env.VITE_APP_COGNITO_LOGIN_URL
        }">Sign In</a>
      </div>
    `)
  }

  document.querySelector("#app").innerHTML = `
    <h1 id="title">AWS Simple Cognito Auth</h1>
    <p>
      <a href="${import.meta.env.VITE_APP_COGNITO_LOGOUT_URL}">Sign Out</a>
    </p>
    <input class="mt-1" type="file" id="input-upload" />
    <button id="upload-button">Upload</button>
    <h3 class="mt-2">Files uploaded:</h3>
    <div id="list-items" />
  `

  document.querySelector("#upload-button").addEventListener("click", upload)

  listItems()
}

App()
