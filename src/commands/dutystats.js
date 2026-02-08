const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readData, getUser } = require("../storage/dutyStore");
const { formatCZ, formatShort } = require("../utils/time");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dutystats")
    .setDescription("Ukáže statistiku služby (duty).")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Uživatel (když nevybereš, ukáže to tebe)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") ?? interaction.user;

    const data = readData();
    const user = getUser(data, target.id);

    const isActive = user.active;
    const activeText = isActive ? "🟢 Aktivní" : "🔴 Neaktivní";
    const activeColor = isActive ? 0x57F287 : 0xED4245;

    // Kolik běží aktuální směna
    const currentSession = isActive && user.startedAt
      ? formatShort(Date.now() - user.startedAt)
      : "—";

    // Posledních 5 směn
    const lastSessions = user.sessions.slice(0, 5).map((s, i) => {
      return `**${i + 1}.** ${formatShort(s.durationMs)} • ${formatCZ(s.start)}`;
    }).join("\n") || "Žádné směny zatím.";

    const embed = new EmbedBuilder()
      .setColor(activeColor)
      .setTitle("📊 DUTY STATISTIKY")
      .setDescription(
        `**Uživatel:** ${target.username}\n` +
        `**Stav služby:** ${activeText}`
      )
      .addFields(
        {
          name: "⏱️ Celkový čas služby",
          value: `\`${formatShort(user.totalMs)}\``,
          inline: true
        },
        {
          name: "▶️ Aktuální směna",
          value: `\`${currentSession}\``,
          inline: true
        },
        {
          name: "🕘 Posledních 5 směn",
          value: lastSessions,
          inline: false
        }
      );

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
