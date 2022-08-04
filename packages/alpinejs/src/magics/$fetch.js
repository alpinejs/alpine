import { magic } from "../magics";

magic('fetchjson', () => {
    return async (
        url,
        jsonItem = null,
        method = "GET"
    ) => {
        let response = await xfetch(url = url, jsonItem = jsonItem, method = method)
        return await response;
    }
})

magic('fetch', () => {
    return async (
        url,
        method = "GET"
    ) => {
        let response = await xfetch(url = url, jsonItem = null, method = method)
        return await response;
    }
})


// Actual fetch function
async function xfetch(url, jsonItem = null, method = 'GET') {

    if (jsonItem == null) {

        return fetch(url, {method: method})
            .then((response) => response.text())
            .then((responseText) => {
                return responseText
            })
            .catch((error) => {
              console.log(error)
            });

    } else {

        return fetch(url, {method: method})
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson[jsonItem]
            })
            .catch((error) => {
              console.log(error)
            });

    }
}
