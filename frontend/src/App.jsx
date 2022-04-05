import { useState } from 'react'
import AuthForm from './components/AuthForm'
import useAuth from './components/hooks/useAuth'

function App() {
	const auth = useAuth()
	const [boardName, setBoardName] = useState('')
	const [boardList, setBoardList] = useState([])
	const [login, setLogin] = useState(true)

	async function deleteBoard(id) {
		try {
			const res = await fetch('/api/boards/' + id, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token }
			})
			if (res.status === 200) {
				updateBoards()
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}

	async function updateBoards() {
		try {
			let res = await fetch('/api/users/', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token }
			})

			let resJson = await res.json()
			if (res.status === 200) {
				setBoardList(resJson.result.boardList)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}

	async function createBoard() {
		try {
			let res = await fetch('/api/boards/', {
				method: 'POST',

				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },

				body: JSON.stringify({
					name: boardName
				})
			})
			if (res.status === 200) {
				setBoardName('')
				updateBoards()
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}

	if (!auth.token) {
		return (
			<>
				<button onClick={() => setLogin(false)}>Go to {login ? 'signup' : 'login'} form</button>
				<AuthForm onSuccess={auth.updateToken} mode={login ? 'login' : 'signup'} />
			</>
		)
	}

	// Loading
	if (!auth.user) return null

	return (
		<div>
			<div>
				<h1>Welcome, {auth.user.username}</h1>
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
