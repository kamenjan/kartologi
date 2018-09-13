module.exports = {
	compose: (...fns) => arg => fns.reduce((composed, f) => f(composed), arg),
	composeAsync: (...fns) => input => fns.reduce((chain, f) => chain.then(f), Promise.resolve(input)),
	logValue: (value) => {
		console.log(value)
		return value
	}
}