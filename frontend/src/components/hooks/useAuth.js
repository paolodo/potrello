// @ts-check
import { useEffect, useState } from 'react'
import axios from 'redaxios'

/**
 * @typedef {Object} User
 * @property {string} username
 */

/**
 *
 * @param {string} token
 *
 *
 * @returns Promise<User>
 */
async function fetchUser(token) {
	const res = await axios({
		url: '/api/users/',
		headers: {
			Authorization: 'Bearer ' + token
		}
	})

	return res.data.result.result
}

/**
 * @returns {{
 *   user: User | null,
 *   token: string,
 *   updateToken: (token: string) => void
 * }}
 */
function useAuth(storage = localStorage) {
	const [token, setToken] = useState(getLastSavedToken)
	const [user, setUser] = useState(null)

	function getLastSavedToken() {
		return storage.getItem('token') || ''
	}

	function saveToken(token) {
		storage.setItem('token', token)
	}

	/**
	 * @param {string} token
	 */
	function handleTokenUpdate(token) {
		saveToken(token)
		setToken(token)
		fetchUser(token).then(setUser)
	}

	useEffect(() => {
		if (token) {
			fetchUser(token)
				.then(setUser)
				.catch(() => {
					// expired
					setToken('')
				})
		}
	}, [])

	return {
		user,
		token,
		updateToken: handleTokenUpdate
	}
}

export default useAuth
