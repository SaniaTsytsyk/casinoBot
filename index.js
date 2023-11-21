const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '6733271373:AAHP69moOt4m_Qpw-aLXgQnrE-jBHq6fWTg';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
      await bot.sendMessage(chatId, 'Зараз я загадаю цифру від 0 до 9, а ти повинен відгадати!');
      const randomNumber = Math.floor(Math.random() * 10);
      chats[ chatId ] = randomNumber;
      await bot.sendMessage(chatId, 'Відгадуй!', gameOptions);
};

const start = () => {
bot.setMyCommands([
   { command: '/start', description: 'Початкове привітання' },
   { command: '/info', description: 'Отримати інформацію про користувача' },
   { command: '/game', description: 'Ігра-відгадай цифру' },
])

bot.on('message', async msg => {
   const text = msg.text;
   const chatId = msg.chat.id;

   if (text === '/start') {
      await bot.sendSticker(chatId, 'https://i.pinimg.com/564x/b7/5a/87/b75a877c67352b0d760b67bd92c61650.jpg');
      return bot.sendMessage(chatId, 'Вітаю у ігровому телеграм боті');
   }
   if (text === '/info') {
      return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name} ${msg.from.last_name}!`);
   }
   if (text === '/game') {
      return startGame(chatId);
   }

   return bot.sendMessage(chatId, 'Я тебе не розумію, спробуй ще раз!')
})
   
   bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
         return startGame(chatId);
      }
      if (data === chats[chatId]) {
         return bot.sendMessage(chatId, `Вітаю ти відгадав цифру ${chats[chatId]}!`, againOptions)
      } else {
         return bot.sendMessage(chatId, `Нажаль ти не відгадав, бот загадав цифру ${chats[chatId]}!`, againOptions)
      }
   })
};

start();