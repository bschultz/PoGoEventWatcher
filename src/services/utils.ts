'use strict';

const axios = require('axios');

/**
 * HTTP GET request to url
 * @param {*} url Web address url to make request to
 */
export const get = async <T>(url: string): Promise<T | null> => {
    const req = await axios.get(url);
    if (req.status !== 200) {
        console.error(`Failed to get data from ${url}:`, req.statusText);
        return null;
    }
    return <T>req.data;
}

/**
 * HTTP POST request to url with data
 * @param {*} url 
 * @param {*} data 
 */
export const post = async <T>(url: string, data: any): Promise<T | null> => {
    const req = axios({
        url: url,
        method: 'POST',
        data: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });
    //const req = await axios.post(url, data);
    if (req.status !== 200 && req.statusText !== 'No Content') {
        console.error(`Failed to post data to ${url}:`, req.statusText);
        return null;
    }
    return <T>req.data;
}

/**
 * Strip PMSF icon format for raw ids
 * @param {*} ids 
 */
export const stripIds = (ids: string[]): number[] => {
    return ids.map(x => parseInt(x.replace('_00', '')));
}

/**
 * Deep equals between two objects
 * @param {*} object1 
 * @param {*} object2 
 */
export const deepEqual = (object1: any, object2: any): any => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}

/**
 * Is object an object
 * @param {*} object 
 */
export const isObject = (object: object): boolean => {
    return object != null && typeof object === 'object';
}

/**
 * Get channel id from webhook url response
 * @param {*} webhookUrl 
 */
export const getWebhookData = async (webhookUrl: string): Promise<WebhookData | null> => {
    const data = await axios.get(webhookUrl);
    if (data.data) {
        console.log('webhook:', data.data);
        return data.data;
    }
    return null;
}

interface WebhookData {
    type: number;
    id: string;
    name: string;
    avatar: string;
    channel_id: string;
    guild_id: string;
    application_id: string;
    token: string;
}