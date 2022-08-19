import githubAuthMethod from './lib/auth/github.auth.js'

export default {
	'github': {
		authMehtodFile: githubAuthMethod,
		callbackHttpMethod: 'get'
	}
}
