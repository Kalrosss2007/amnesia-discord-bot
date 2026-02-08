const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readData, writeData, getUser } = require("../storage/dutyStore");
const { formatCZ, formatShort } = require("../utils/time");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duty")
    .setDescription("Zapne nebo vypne službu (automaticky)."),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const userId = interaction.user.id;
    const data = readData();
    const user = getUser(data, userId);
    const now = Date.now();

    // ======================
    // ZAPNUTÍ SLUŽBY
    // ======================
    if (!user.active) {
      user.active = true;
      user.startedAt = now;
      writeData(data);

      const startEmbed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("🟢 ZAČÁTEK SMĚNY")
        .setDescription(
          "**ZAČÁTEK SMĚNY**\n" +
          "━━━━━━━━━━━━━━━\n" +
          `Začal jsi směnu: **${formatCZ(now)}**`
        );

      return interaction.editReply({ embeds: [startEmbed] });
    }

    // ======================
    // VYPNUTÍ SLUŽBY
    // ======================
    const end = now;
    const durationMs = end - user.startedAt;

    user.totalMs += durationMs;
    user.sessions.unshift({
      start: user.startedAt,
      end,
      durationMs
    });
    user.sessions = user.sessions.slice(0, 20);

    user.active = false;
    user.startedAt = null;
    writeData(data);

    const endEmbed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle("🔴 KONEC SMĚNY")
      .setDescription(
        "**KONEC SMĚNY**\n" +
        "━━━━━━━━━━━━━━━\n" +
        `Směna ukončena: **${formatCZ(end)}**`
      )
      .addFields({
        name: "Délka této směny:",
        value: `\`${formatShort(durationMs)}\``,
        inline: false
      });

    return interaction.editReply({ embeds: [endEmbed] });
  }
};
