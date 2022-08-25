const  Telegraf = require('telegraf').Telegraf;
const dotenv = require("dotenv");
const fs = require('fs')

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);

let alertsIdRaw = fs.readFileSync( __dirname + '/alerts.json');
let alertsId = JSON.parse(alertsIdRaw);

// bot.on('text', (ctx) => {
//     // Explicit usage
//     ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)
  
//     // Using context shortcut
//     ctx.reply(`Hello ${ctx.state.role}`)
//   })

bot.start((ctx) => {
    ctx.reply('Привет! Я бот для уведомлений о новых заказах в магазине.');
    ctx.reply(ctx.message.chat.id);
})
bot.help((ctx) => {
    const msg = `
/all     - получить список всех пользователей бота
/add * - добавить нового пользователя бота
/rm *  - удалить пользователя бота
    `
    ctx.reply(msg);
})
//reg exp for text case insensitive

  bot.hears(/id/gi, (ctx) =>{
    // console.log()
    ctx.reply(ctx.message.chat.id)
  })
  bot.command('all', (ctx)=>{
    const answer = alertsId.join('\n');
    ctx.reply(answer)
  })
bot.command('add', (ctx)=>{
    const addId = ctx.message.text.split(' ')[1] 
    console.log(addId)
    if(alertsId.includes(ctx.message.chat.id + '')){
        
        if(alertsId.includes(addId)){
            ctx.reply('Такой id уже есть в списке')
        }else{
            ctx.reply('Добавлено')
            alertsId.push(addId)
            bot.telegram.sendMessage(addId, 'Вас добавили в список уведомлений')
            fs.writeFileSync( __dirname + '/alerts.json', JSON.stringify(alertsId))
            
        }
    }else{
        ctx.reply('Не достаточно прав для добавления')
    }
})

bot.command('rm', (ctx)=>{
    const rmId = ctx.message.text.split(' ')[1] 
    console.log(rmId)
    if(alertsId.includes(ctx.message.chat.id + '')){
        
        if(alertsId.includes(rmId)){
            ctx.reply('Удалено')
            let newAlertsId = alertsId.filter(id => id != rmId)

            bot.telegram.sendMessage(rmId, 'Вас удалили из списка уведомлений')
            bot.telegram.leaveChat(rmId)
            // alertsId.pull(rmId)
            fs.writeFileSync( __dirname + '/alerts.json', JSON.stringify(newAlertsId))
        }else{
            
            ctx.reply('Такого id нету списке')
        }
    }else{
        ctx.reply('Не достаточно прав для добавления')
    }
})


  bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = bot;
// module.exports = {};