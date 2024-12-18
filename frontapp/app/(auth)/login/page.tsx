"use client"
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import login from "./login.server";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    const [state, formAction] = useActionState(login, { message: '' })

    return (
        <form action={formAction}>
            <h1>Login</h1>
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ color: 'black' }}
            />
            <input
                name='password'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ color: 'black' }}
            />
            <button className = "bg-blue-500"type="submit">Login</button>
            <p>{state?.message}</p>
        </form>
    );
}


export default Login;