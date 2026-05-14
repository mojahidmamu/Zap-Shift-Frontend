import React from 'react';
import { useForm } from "react-hook-form";
import useAuth from '../../../hook/useAuth';

const Register = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const {} = useAuth();

    const handleRegister = (data) => {
        console.log("Register data:", data);
    };

    return (
        <div>
            <h2>This is the Register Page</h2>

            <form onSubmit={handleSubmit(handleRegister)}>
                <fieldset className="fieldset">

                    <label className="label">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className="input"
                        placeholder="Email"
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="input"
                        placeholder="Password"
                    />

                    <div>
                        <a className="link link-hover">Forgot password?</a>
                    </div>

                    <button className="btn btn-neutral mt-4">
                        Register
                    </button>

                </fieldset>
            </form>
        </div>
    );
};

export default Register;