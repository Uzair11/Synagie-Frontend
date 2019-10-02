import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

const loadImageURLOrEmpty = async (path: string): Promise<string | null> => {
  if (!path) {
    return null
  }

  let dirPath = path.substring(0, path.lastIndexOf('/') + 1)
  let fileName = path.substring(dirPath.length)
  console.log('path', path)
  console.log('dirPath', dirPath)
  console.log('fileName', fileName)

  // let uploadRef = await firebase
  //   .storage()
  //   .ref()
  //   .child(path)

  let testUploadRef = await firebase
    .storage()
    .ref(dirPath)
    .child(fileName)

  try {
    // let uploadURL = await uploadRef.getDownloadURL()
    let newUploadURL = await testUploadRef.getDownloadURL()

    console.log(newUploadURL)
    // return uploadURL
    return newUploadURL
  } catch (e) {
    console.error('unable to loadImage', path, e)
  }
  return null
}

// load and cache images under fieldURL (photoURL): { original: '...', t128: '', t256: '', ...}
//  t#{size}
export const loadImageWithCache = async (
  record: Record<string, any>,
  id: string,
  path: string,
  field: string,
  force: boolean = false,
  sizes: number[] = [128, 256, 512, 1024, 2048]
): Promise<boolean> => {
  if (!id) {
    throw new Error('invalid id')
  }
  if (!path) {
    throw new Error('invalid path')
  }
  if (record[field]) {
    if (force || (!record[field + 'URL'] || !record[field + 'URL'].original)) {
      console.log('loadImageWithCache', id, path, field, record[field])
      // id: 0fGI6Mb6i4htixGuCKIf
      // path: baby_attribute/0fGI6Mb6i4htixGuCKIf
      // field: homeImg
      // record[field]: baby_attribute/0fGI6Mb6i4htixGuCKIf/thumb_a1609057406c10131069c124af808a7d_w640X1006.jpg
      let imageURLs: Record<string, string | null> = { original: null }

      let imgPath = record[field]
      let dirPath = imgPath.substring(0, imgPath.lastIndexOf('/') + 1)
      let fileName = imgPath.substring(dirPath.length)

      let loads = [
        loadImageURLOrEmpty(imgPath)
          .then((imageURL) => {
            imageURLs.original = imageURL
            console.log('imageURLs', imageURLs)
          })
          .catch((e) => {})
      ]

      if (sizes.length > 0) {
        for (let c = 0; c < sizes.length; c++) {
          loads.push(
            loadImageURLOrEmpty(dirPath + 'thumb@' + sizes[c] + '_' + fileName)
              .then((imageURL) => {
                imageURLs['t' + sizes[c]] = imageURL
              })
              .catch((e) => {})
          )
        } // each sizes
      }

      await Promise.all(loads)

      console.log('imageURLs', sizes.length, imageURLs)
      let rowRef = firebase.firestore().doc(path)
      let update: Record<string, any> = {}
      if (sizes.length > 0) {
        record[field + 'URL'] = imageURLs
        update[field + 'URL'] = imageURLs
      } else {
        record[field + 'URL'] = imageURLs.original //no hash
        update[field + 'URL'] = imageURLs.original
      }
      // console.log('updating', update)
      rowRef.update(update).catch((e) => {
        console.error('unable to update ' + field + 'URL', e)
      })
    } else {
      console.log('using cache', field, path)
    }

    return true
  } else {
    console.error('missing', field, record)
  }

  return false
}
