const botState = {
  isListening: false,
  targetUser: null,
  voiceChannel: null,
  guildId: null,
  voiceConnection: null,

  listenData: {
    speaking: false,
    startedTS: null,
    lastPlayTS: null,
    respectQuietTime: false,
  },
}

function getState() {
  return botState
}

function startListening(user, guild, voiceChannel, voiceConnection) {
  botState.targetUser = user
  botState.guildId = guild.id
  botState.voiceChannel = voiceChannel
  botState.voiceConnection = voiceConnection
  botState.isListening = true
}

function stopListening() {
  botState.targetUser = null
  botState.guildId = null
  botState.voiceChannel = null
  botState.voiceConnection = null
  botState.isListening = false
}

function listenTrigger() {
  botState.listenData.speaking = true
  botState.listenData.startedTS = Date.now()
}

function listenStop() {
  botState.listenData.speaking = false
  botState.listenData.startedTS = null
  botState.listenData.lastPlayTS = null
}

function enableQuiet() {
  botState.listenData.respectQuietTime = true
  botState.listenData.lastPlayTS = Date.now()
}

module.exports = {
  getState,
  startListening,
  stopListening,
  listenTrigger,
  listenStop,
  enableQuiet,
}
