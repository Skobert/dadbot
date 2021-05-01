/* eslint-disable no-console */
const Discord = require('discord.js')
const dotenv = require('dotenv')
const { startListening, stopListening } = require('./actions')
const { dadUserId, dadEmoji, guildId } = require('./config/config.json')
const dataStore = require('./datastore')
// const config = require('./config/config.json')

dotenv.config()
const client = new Discord.Client()

client.once('ready', () => {
  console.log('Ready.')
})

const token = process.env.TOKEN

client.on('message', (message) => {
  if (message.author.bot) return

  if (message.channel.type === 'dm') {
    const parsedMsg = message.content.toLowerCase().trimLeft().trimRight()

    if (parsedMsg === 'dad time') {
      client.guilds.fetch(guildId)
        .then((g) => {
          g.members.fetch({ user: dadUserId, force: true })
            .then((u) => {
              startListening(client, g, u)
            }).catch(console.error)
        }).catch(console.error)
    } else if (parsedMsg === 'stop dad') {
      stopListening()
    }
  }

  if (message.author.id === dadUserId) {
    message.react(dadEmoji)
  }
  console.log(`${message.author.username}: ${message.content}`)
  console.log(`Listening: ${dataStore.getState().isListening}`)
})

client.login(token)
// 200796194325135370
