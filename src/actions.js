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

const channelChange = (oldVState, newVState) => {
  if (newVState.channel !== null) {
    newVState.channel.join()
  //  } else {
  //    const s = dataStore.getState()
  //    s.voiceChannel.leave()
  }
}

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
      client.on('voiceStateUpdate', channelChange)
    })
    .catch(console.error)
}

function stopListening(client) {
  client.removeListener('guildMemberSpeaking', voiceStateChange)
  client.removeListener('voiceStateUpdate', channelChange)

  const s = dataStore.getState()
  s.voiceChannel.leave()
  dataStore.stopListening()
  console.log('stopped listening')
}

module.exports = { startListening, stopListening }
