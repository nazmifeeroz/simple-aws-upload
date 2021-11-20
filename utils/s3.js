import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const bucket = import.meta.env.VITE_APP_S3_BUCKET
const region = import.meta.env.VITE_APP_BUCKET_REGION

const filenameGenerator = (key) => {
  const name = key.split("/")[1]
  return { name, encoded: name.replace(/\s+|[\d,/.()]/g, "-") }
}

const listItemsFn = async (credentials) => {
  const client = new S3Client({
    region,
    credentials,
  })

  const { Contents } = await client.send(
    new ListObjectsCommand({
      Bucket: bucket,
      Prefix: `${credentials.identityId}/`,
    })
  )

  if (!Contents) {
    return (document.querySelector("#list-items").innerHTML =
      "No uploads found.")
  }

  const fileNames = Contents?.map(({ Key }) => {
    const { name, encoded } = filenameGenerator(Key)
    return `<p><a class="link" id="${encoded}">${name}</a></p>`
  })

  document.querySelector("#list-items").innerHTML = fileNames?.join("\n")

  Contents?.forEach(({ Key }) => {
    const { encoded } = filenameGenerator(Key)
    document
      .querySelector(`#${encoded}`)
      .addEventListener("click", () => view(credentials, Key))
  })
}

const uploadFn = async (credentials) => {
  const files = document.querySelector("#input-upload").files

  if (!files.length) return alert("Please choose a file to upload first!")

  try {
    const file = files[0]
    const fileName = file.name

    const s3Client = new S3Client({
      region,
      credentials,
    })

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `${credentials.identityId}/${fileName}`,
        Body: file,
        ContentType: file.type,
      })
    )

    alert("Uploaded successful!")
    window.location.reload()
  } catch (err) {
    alert(err.message)

    window.location = "http://localhost:3000"
  }
}

const view = async (credentials, key) => {
  const s3Client = new S3Client({
    region,
    credentials,
  })

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  window.open(url)
}

export { listItemsFn, uploadFn }
