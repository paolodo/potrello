import { useState } from 'react'
import AuthForm from './components/AuthForm'

function App() {
	const [token, setToken] = useState('')
	const [boardName, setBoardName] = useState('')
	const [boardList, setBoardList] = useState([])
	const [user, setUser] = useState({})
	const [login, setLogin] = useState(true)

	async function deleteBoard(id) {
		try {
			let res = await fetch('/api/boards/' + id, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
			})

			let resJson = await res.json()
			if (res.status === 200) {
				getUser(token)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}

	async function getUser(tok) {
		try {
			let res = await fetch('/api/users/', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }
			})

			let resJson = await res.json()
			if (res.status === 200) {
				setBoardList(resJson.result.boardList)
				setUser(resJson.result.result)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}

	async function createBoard() {
		let bearer = 'Bearer ' + token
		console.log(bearer)
		try {
			let res = await fetch('/api/boards/', {
				method: 'POST',

				headers: { 'Content-Type': 'application/json', Authorization: bearer },

				body: JSON.stringify({
					name: boardName
				})
			})
			let resJson = await res.json()
			if (res.status === 200) {
				setBoardName('')
				getUser(token)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}
	function handleAuth(token) {
		setToken(token)
		getUser(token)
	}

	if (!token) {
		return (
			<>
				<button onClick={() => setLogin(false)}>Go to {login ? 'signup' : 'login'} form</button>
				<AuthForm onSuccess={handleAuth} mode={login ? 'login' : 'signup'} />
			</>
		)
	}

	return (
		<div>
			<div>
				<h1>Welcome, {user.username}</h1>
				<form
					className="addBoard"
					onSubmit={(event) => {
						event.preventDefault()
						createBoard()
					}}
				>
					<input type="text" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
					<button type="submit">+</button>
				</form>
				{boardList ? (
					<div className="boards">
						{boardList.map((board) => (
							<div>
								<button>{board.name}</button>
								<button
									onClick={(event) => {
										event.preventDefault()
										deleteBoard(board._id)
									}}
								>
									x
								</button>
							</div>
						))}
					</div>
				) : (
					<div></div>
				)}
			</div>
		</div>
	)
}

export default App
