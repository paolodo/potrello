// @ts-check
import React, { useState, useId } from 'react'
import axios from 'redaxios'

import './AuthForm.css'

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns Promise<{ token: string }>
 */
async function doLogin(email, password) {
	const res = await axios({
		method: 'POST',
		url: '/api/login/',
		data: {
			email,
			password
		}
	})

	return res.data
}

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns Promise<{ token: string }>
 */
async function doSignup(email, password) {
	const res = await axios({
		method: 'POST',
		url: '/api/signup/',
		data: {
			email,
			password,
			username: email
		}
	})

	return res.data
}

/**
 *
 * @param {{ onSuccess: (token: string) => void, mode: 'login' | 'signup' }} props
 * @returns
 */
const AuthForm = (props) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	/**
	 *
	 * @param {import('react').FormEvent<HTMLFormElement>} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault()

		const doAuth = props.mode === 'login' ? doLogin : doSignup

		try {
			const { token } = await doAuth(email, password)

			props.onSuccess(token)
		} catch (err) {
			if (err.status === 401) {
				setError('Uh, we have not found users with these credentials')
			} else if (err.status) {
				setError('Uh, there are some problems with the services')
			} else {
				setError('Uh, this error happened: ' + err.message)
			}
		}
	}

	const emailId = `email-${useId()}`
	const passwordId = `password-${useId()}`

	return (
		<form className="AuthForm" onSubmit={handleSubmit}>
			<label htmlFor={emailId}>Email</label>
			<input
				id={emailId}
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<label htmlFor={passwordId}>Password</label>
			<input
				id={passwordId}
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<button type="submit">{props.mode === 'login' ? 'Login' : 'Signup'}</button>
			{error && (
				<div role="status" aria-live="polite" className="AuthForm__Error">
					{error}
				</div>
			)}
		</form>
	)
}

export default AuthForm
