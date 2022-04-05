// @ts-check
import { act, render, screen, userEvent, waitFor, cleanup } from '../../test-utils'
import LoginForm from './LoginForm'
import axios from 'redaxios'
import { vi, expect, describe, it, afterEach } from 'vitest'

vi.mock('redaxios')

describe('LoginForm', () => {
	const props = {
		onLogin: vi.fn()
	}

	function setup() {
		return {
			user: userEvent.setup(),
			rtl: render(<LoginForm {...props} />)
		}
	}

	afterEach(() => {
		vi.clearAllMocks()
		cleanup()
	})

	it('submits the form', async () => {
		vi.mocked(axios).mockImplementationOnce(() => {
			/** @type {*} */
			const response = Promise.resolve({ data: { token: 'success' } })

			return response
		})

		const { user } = setup()

		await user.type(
			screen.getByRole('textbox', {
				name: 'Email'
			}),
			'test@test.test'
		)

		await user.type(screen.getByLabelText('Password'), 'test{enter}')

		await waitFor(() => expect(props.onLogin).toHaveBeenCalled())

		expect(props.onLogin).toHaveBeenCalledWith('success')
	})

	it('handles the API errors', async () => {
		vi.mocked(axios).mockImplementationOnce(() => {
			/** @type {*} */
			const response = Promise.reject({ status: 401 })

			return response
		})

		const { user } = setup()

		await user.type(
			screen.getByRole('textbox', {
				name: 'Email'
			}),
			'test@test.test'
		)

		await user.type(screen.getByLabelText('Password'), 'test')

		await act(() => user.click(screen.getByRole('button')))

		expect(await screen.findByRole('status')).toHaveClass('LoginForm__Error')
	})
})
