/* eslint-disable no-console */
const dataStore = require('./datastore')
// const config = require('./config/config.json')

const voiceStateChange = (member, speaking) => {
  const state = dataStore.getState()
  if (member.id !== state.targetUser.id) return

  if (speaking.has('SPEAKING')) {
    console.log('I can now hear the user speaking :)')
  }

  console.log('no console log warnings')
}

// const channelChange = () => {
//   console.log('no console log warnings')
// }

function startListening(client, guild, user) {
  const s = dataStore.getState()

  if (s.isListening) {
    console.warn('Tried to start listening, but was already listening')
    return
  }

  console.log(`Initializing voice listener on user with ID ${user.user.username}`)

  if (user.voice.channel === null) {
    console.warn('tried to join user\'s channel, but user isn\'t in a voice channel.')
    return
  }

  console.info(`joining channel ${user.voice.channel.name}`)
  user.voice.channel.join()
    .then((connection) => {
      dataStore.startListening(user, guild.id, user.voice.channel, connection)

      client.on('guildMemberSpeaking', voiceStateChange)
    })
    .catch(console.error)
}

function stopListening(client) {
  const s = dataStore.getState()

  if (!s.isListening) return

  client.removeListener('guildMemberSpeaking', voiceStateChange)

  s.stopListening()

  console.info('stopped listening')
}

module.exports = { startListening, stopListening }
