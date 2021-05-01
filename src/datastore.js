let botState = {
  isListening: false,
  targetUser: null,
  voiceChannel: null,
  guildId: null,
  voiceConnection: null,
}

function updateState(state) {
  botState = state
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

module.exports = {
  updateState,
  getState,
  startListening,
  stopListening,
}
