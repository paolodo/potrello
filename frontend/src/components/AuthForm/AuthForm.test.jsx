// @ts-check
import { act, render, screen, userEvent, waitFor, cleanup } from '../../test-utils'
import AuthForm from './AuthForm'
import axios from 'redaxios'
import { vi, expect, describe, it, afterEach } from 'vitest'

vi.mock('redaxios')

describe('AuthForm', () => {
	const props = {
		onSuccess: vi.fn()
	}

	/**
	 *
	 * @param {'login' | 'signup'} mode
	 */
	function setup(mode = 'login') {
		return {
			user: userEvent.setup(),
			rtl: render(<AuthForm {...props} mode={mode} />)
		}
	}

	afterEach(() => {
		vi.clearAllMocks()
		cleanup()
	})

	it('does login', async () => {
		vi.mocked(axios).mockImplementationOnce((params) => {
			expect(params).toMatchObject({ url: '/api/login/' })

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

		await user.type(screen.getByLabelText('Password'), 'test')

		await act(() =>
			user.click(
				screen.getByRole('button', {
					name: 'Login'
				})
			)
		)

		await waitFor(() => expect(props.onSuccess).toHaveBeenCalled())

		expect(props.onSuccess).toHaveBeenCalledWith('success')
	})

	it('does signup', async () => {
		vi.mocked(axios).mockImplementationOnce((params) => {
			expect(params).toMatchObject({ url: '/api/signup/' })

			/** @type {*} */
			const response = Promise.resolve({ data: { token: 'success' } })

			return response
		})

		const { user } = setup('signup')

		await user.type(
			screen.getByRole('textbox', {
				name: 'Email'
			}),
			'test@test.test'
		)

		await user.type(screen.getByLabelText('Password'), 'test')

		await act(() =>
			user.click(
				screen.getByRole('button', {
					name: 'Signup'
				})
			)
		)

		await waitFor(() => expect(props.onSuccess).toHaveBeenCalled())

		expect(props.onSuccess).toHaveBeenCalledWith('success')
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

		expect(await screen.findByRole('status')).toHaveClass('AuthForm__Error')
	})
})
