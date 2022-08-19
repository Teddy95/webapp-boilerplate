export default (req, res, next) => {
	res.send(res.__('greeting'))
}
