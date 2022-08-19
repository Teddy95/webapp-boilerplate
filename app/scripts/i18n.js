// Import required files & modules
import { sprintf } from 'sprintf-js'
import Cookies from 'js-cookie'

// Import language files
import locales_en from '../locales/en.json' assert { type: 'json' }
import locales_de from '../locales/de.json' assert { type: 'json' }

// Define locales
const locales = [
	{
		code: 'en',
		catalog: locales_en
	},
	{
		code: 'de',
		catalog: locales_de
	}
]

// Define I18n class
class I18n {
	constructor(locales) {
		this.locales = locales
		this.language = null
		this.catalog = null
		this.setLanguage()
		this.registerTranslationHelper()
	}

	registerTranslationHelper () {
		if (typeof window !== 'undefined') {
			window.i18n = this.getTranslationHelper()
		} else {
			global.i18n = this.getTranslationHelper()
		}
	}

	getTranslationHelper () {
		return {
			__: (key) => this.translate(key),
			__n: (key, number) => this.translatePlurals(key, number)
		}
	}

	setLanguage () {
		if (typeof window !== 'undefined') {
			let languageCookie = Cookies.get('i18n')

			if (typeof languageCookie !== 'undefined') {
				this.language = languageCookie
				this.catalog = this.getCatalog(this.language)
			} else {
				this.setDefaultLanguage()
			}
		} else {
			this.setDefaultLanguage()
		}
	}

	setDefaultLanguage() {
		this.language = this.locales[0].code
		this.catalog = this.locales[0].catalog
	}

	setPreferredUserLanguage (req) {
		const userLanguages = req.acceptsLanguages()
		let localeIndex = null
		let preferredUserLanguage = null

		for (const userLanguage of userLanguages) {
			localeIndex = this.locales.findIndex((x) => x.code.toLowerCase() === userLanguage.toLowerCase())
			if (localeIndex >= 0) {
				preferredUserLanguage = userLanguage.toLowerCase()
				break
			}
		}

		if (preferredUserLanguage === null) {
			this.setDefaultLanguage()
		} else {
			this.language = this.locales[localeIndex].code
			this.catalog = this.locales[localeIndex].catalog
		}
	}

	translate (key) {
		const argv = [...arguments]
		const phrase = this.catalog[key]

		if (typeof phrase !== 'undefined') {
			argv.shift()
			argv.unshift(phrase)
		}

		return sprintf(...argv)
	}

	translatePlurals (key, number) {
		const phrase = this.catalog[key]
		let translateString = ''

		if (typeof phrase !== 'undefined') {
			if (parseInt(number) === 1) {
				translateString = phrase.one
			} else {
				translateString = phrase.other
			}
		} else {
			translateString = key
		}

		return sprintf(translateString, number)
	}

	expressMiddleware (req, res, next) {
		// Check lang query param
		if ('lang' in req.query) {
			if (this.locales.filter((x) => x.code === req.query.lang).length === 1) {
				this.language = req.query.lang
				this.catalog = this.getCatalog(this.language)
			}
		} else {
			if (typeof req.cookies.i18n !== 'undefined') {
				if (this.locales.filter((x) => x.code === req.cookies.i18n).length === 1) {
					this.language = req.cookies.i18n
					this.catalog = this.getCatalog(this.language)
				} else {
					this.setPreferredUserLanguage(req)
				}
			} else {
				this.setPreferredUserLanguage(req)
			}
		}

		res.cookie('i18n', this.language, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false, secure: true })
		res.__ = (key) => this.translate(key)
		res.__n = (key, number) => this.translatePlurals(key, number)
		next()
	}

	getCatalog (langCode) {
		return this.locales.find((x) => x.code === langCode).catalog
	}
}

export default new I18n(locales)
