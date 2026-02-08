const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const ALLOWED_CHANNEL_ID = "1345839938716827699";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zapispozaru")
    .setDescription("Zápis požáru – Fire Investigation")
    .addStringOption(opt =>
      opt.setName("misto")
        .setDescription("Místo události (adresa / objekt)")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("datum_cas")
        .setDescription("Datum a čas zásahu")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("typ")
        .setDescription("Typ události")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("popis")
        .setDescription("Stručný popis situace")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("zjisteni")
        .setDescription("Předběžné zjištění")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("jednotky")
        .setDescription("Zúčastněné jednotky")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("zaver")
        .setDescription("Závěr zásahu")
        .setRequired(true)
    ),

  async execute(interaction) {
    // ❌ kontrola kanálu
    if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
      return interaction.reply({
        content: "❌ Tento příkaz lze použít pouze v kanálu **📑┃fire-investigation-zápisy**.",
        ephemeral: true
      });
    }

    const misto = interaction.options.getString("misto");
    const datumCas = interaction.options.getString("datum_cas");
    const typ = interaction.options.getString("typ");
    const popis = interaction.options.getString("popis");
    const zjisteni = interaction.options.getString("zjisteni");
    const jednotky = interaction.options.getString("jednotky");
    const zaver = interaction.options.getString("zaver");

    const embed = new EmbedBuilder()
      .setColor(0xED4245) // hasičská červená
      .setTitle("🔥 ZÁPIS POŽÁRU – FIRE INVESTIGATION")
      .setDescription(
        `**📍 MÍSTO UDÁLOSTI:**\n${misto}\n\n` +
        `**🕒 DATUM A ČAS:**\n${datumCas}\n\n` +
        `**🔥 TYP UDÁLOSTI:**\n${typ}\n\n` +
        `**🧯 STRUČNÝ POPIS SITUACE:**\n${popis}\n\n` +
        `**🔍 PŘEDBĚŽNÉ ZJIŠTĚNÍ:**\n${zjisteni}\n\n` +
        `**👨‍🚒 ZÚČASTNĚNÉ JEDNOTKY:**\n${jednotky}\n\n` +
        `**📄 ZÁVĚR:**\n${zaver}`
      )
      .setFooter({
        text: `Zapsal: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
