'use server'
import axiosInstance from "../../_utils/axiosInstance";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
let backend_url = "http://localhost:3000";

export default async function login(prevState: any, formData: FormData) {
    const cookieStrore = await cookies()
    console.log(formData.get('email'))
    try {
        const response = await axiosInstance.post(`${backend_url}/auth/login`, {
            email: formData.get('email'),
            password: formData.get('password')
        });
        if (response.status != 201) {

            console.log(response)
            return { 'message': 'error' }

        }
        // console.log(response.headers["set-cookie"]![0].split(';')[1].split('=')[1]);
        let token = response.headers["set-cookie"]![0].split(';')[0].split('=')[1]
        let maxAge = parseInt(response.headers["set-cookie"]![0].split(';')[1].split('=')[1])

        cookieStrore.set('CookieFromServer', token, { secure: true, httpOnly: true, sameSite: true, maxAge })
        redirect('/about');
    }
    catch (error: any) {
        console.log('hi', error.response.data.message)
        let m = error.response.data.message
        return { message: m }
    }
}