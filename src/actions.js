/* eslint-disable no-console */
const path = require('path')
const config = require('./config/config.json')

const dataStore = require('./datastore')
// const config = require('./config/config.json')

const voiceStateChange = (member, speaking) => {
  const state = dataStore.getState()
  if (member.id !== state.targetUser.id) return

  if (speaking.has('SPEAKING')) {
    console.log(`${member.user.username} has started speaking`)

    dataStore.listenTrigger()
  } else {
    console.log(`${member.user.username} has finally shut up`)

    console.log(`Quiet? ${state.listenData.respectQuietTime}; last play: ${Date.now() - state.listenData.startedTS}`)
    if (state.listenData.respectQuietTime
      && Date.now() - state.listenData.lastPlayTS < config.quietTimeMS) return

    if (Date.now() - state.listenData.startedTS >= config.speakingTimeMS) {
      console.log('SICK DAD JOKE BRO')
      const dispatch = state.voiceConnection.play(
        path.join(__dirname, config.audioLink), { volume: 0.1 },
      )
      dispatch.on('start', () => {
        console.log('playing audio')
      })
      dataStore.enableQuiet()
    }
  }
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
      connection.setSpeaking(0)
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
