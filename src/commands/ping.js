const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Test jestli bot odpovídá."),

  async execute(interaction) {
    return interaction.reply({ content: "pong ✅", ephemeral: true });
  }
};
