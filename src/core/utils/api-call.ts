/**
 * 
 * @file api-call.ts
 * @description using for api call
 */


/**
 * 
 * API call to POST data
 * @param url 
 * @param data 
 * @returns 
 */
export async function postData(url: string, data: any) {
    return await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
}