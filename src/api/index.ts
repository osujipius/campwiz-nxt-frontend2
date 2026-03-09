import type { ResponseError, ResponseList, ResponseSingle } from "@/types/response";

const API_PATH = import.meta.env.VITE_BACKEND_API_PATH || '/api/v2';
export const fetchFromBackend = async (path: string, options?: RequestInit): Promise<Response> => {
    const baseURL = import.meta.env.VITE_BACKEND_API_URL || '';
    if (!options) {
        options = {}
    }
    const headers = new Headers(options.headers)
    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }
    options = ({
        ...options,
        headers,
        credentials: 'include',
    })
    const res = await fetch(`${baseURL}${path}`, options)
    // Dispatch a session-expired event on 401 responses, except for the session
    // fetch itself (to avoid infinite loops when genuinely unauthenticated).
    if (res.status === 401 && !path.includes('/user/me')) {
        window.dispatchEvent(new CustomEvent('campwiz:session-expired'));
    }
    return res
}

export async function fetchAPIFromBackendSingleWithErrorHandling<T>(path: string, req?: RequestInit): Promise<ResponseSingle<T> | ResponseError> {
    try {
        console.log(`${API_PATH}${path}`, req)
        const res = await fetchFromBackend(`${API_PATH}${path}`, req)
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }
        const r = await res.json();
        if (res.ok) {
            return r
        } else {
            return {
                detail: r.detail
            }
        }
    } catch (e) {
        return {
            detail: (e as Error).message
        }
    }
}

export async function fetchAPIFromBackendListWithErrorHandling<T>(path: string, req?: RequestInit): Promise<ResponseList<T> | ResponseError> {
    try {
        const res = await fetchFromBackend(`${API_PATH}${path}`, req)
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }
        const r = await res.json();
        if (res.ok) {
            return r
        } else {
            return {
                detail: r.detail
            }
        }
    } catch (e) {
        return {
            detail: (e as Error).message
        }
    }
}