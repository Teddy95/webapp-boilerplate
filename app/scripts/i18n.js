import i18nForBrowser, { __, __n } from 'i18n-for-browser'
import locales_de from '../locales/de.json'
import locales_en from '../locales/en.json'

i18nForBrowser.configure({
	locales: {
		'de': locales_de,
		'en': locales_en
	},
	defaultLocale: 'en',
	queryParameter: 'lang',
	cookieName: 'i18n'
})

window.i18n = {
	__: __,
	__n: __n
}
