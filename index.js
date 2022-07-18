const {Telegraf, Markup, Scenes, sessions, } = require('telegraf')
require('dotenv').config()

const text = require('./content/text')
const btns = require('./content/btns')
const models = require('./content/models')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
	ctx.reply(text.startText, Markup.keyboard(btns.startBtns).resize())
})

function modelsInfo(name, text, img) {
	bot.hears(name, async (ctx) => {

		await ctx.replyWithMediaGroup(img, { caption: text })

		await ctx.reply(text, Markup.keyboard([
			['Назад к моделям', 'Меню']
		]).resize())
	})
}

let modelsBtn = []

for (let key in models.models) {
	modelsBtn.push(models.models[key].title)

	modelsInfo(models.models[key].title, models.models[key].text, models.models[key].img)
}

//Действия на кнопки
bot.hears('Модели', (ctx) => {
	ctx.reply('Выберете модель', Markup.keyboard([
		modelsBtn,
		['Меню']
	]).resize())
})

bot.hears('Назад к моделям', (ctx) => {
	ctx.reply('Выберете модель', Markup.keyboard([
		modelsBtn,
		['Меню']
	]).resize())
})

bot.hears('Контакты', async (ctx) => {
	await ctx.replyWithPhoto({ source: './photo/info/map.jpeg' }, { caption: text.contactText }, Markup.keyboard([
		['Меню']
	]).resize())
})

bot.hears('Оплата', (ctx) => {
	ctx.replyWithPhoto({ source: './photo/info/pay.jpeg'}, Markup.keyboard([
		['Меню']
	]).resize())
})

bot.hears('Связь с оператором', (ctx) => {
	ctx.reply('Whatsapp', Markup.inlineKeyboard([
		Markup.button.url('Написать на whatsapp', 'https://api.whatsapp.com/send/?phone=%2B77003986060&text&type=phone_number&app_absent=0')
	]).resize())
})

bot.hears('Тест-драйв', (ctx) => {
	ctx.reply(text.driveText, Markup.inlineKeyboard([
		Markup.button.url('Написать на whatsapp', 'https://api.whatsapp.com/send/?phone=%2B77003986060&text&type=phone_number&app_absent=0')
	]).resize())
})

bot.hears('Меню', (ctx) => {
	ctx.reply('Выберете пункт меню', Markup.keyboard(btns.startBtns).resize())
})


//Запуск бота
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))