const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { setVacation } = require("../storage/vacationStore");

// CZ datum z YYYY-MM-DD na DD.MM.YYYY
function formatDateCZ(yyyyMmDd) {
  // očekává "2026-02-02"
  const [y, m, d] = yyyyMmDd.split("-");
  return `${d}.${m}.${y}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dovolena")
    .setDescription("Správa dovolené / omluvenek")
    .addSubcommand(sub =>
      sub
        .setName("nastavit")
        .setDescription("Nastaví dovolenou")
        .addStringOption(opt =>
          opt.setName("od")
            .setDescription("Začátek (DD.MM.RRRR nebo YYYY-MM-DD)")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName("do")
            .setDescription("Konec (DD.MM.RRRR nebo YYYY-MM-DD)")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName("ic_duvod")
            .setDescription("IC důvod (In-Character)")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName("ooc_duvod")
            .setDescription("OOC důvod (Out-of-Character)")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const sub = interaction.options.getSubcommand();
    if (sub !== "nastavit") {
      return interaction.editReply({ content: "Neznámý subcommand." });
    }

    const odRaw = interaction.options.getString("od");
    const doRaw = interaction.options.getString("do");
    const ic = interaction.options.getString("ic_duvod");
    const ooc = interaction.options.getString("ooc_duvod");

    // Podpora pro dvě formy: DD.MM.RRRR i YYYY-MM-DD
    const normalize = (s) => {
      const trimmed = s.trim();
      // DD.MM.YYYY
      if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(trimmed)) return trimmed;
      // YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return formatDateCZ(trimmed);
      return null;
    };

    const od = normalize(odRaw);
    const do_ = normalize(doRaw);

    if (!od || !do_) {
      return interaction.editReply({
        content: "❌ Špatný formát data. Použij **DD.MM.RRRR** (např. 02.02.2026) nebo **YYYY-MM-DD** (2026-02-02)."
      });
    }

    const memberLabel = interaction.member?.nickname
      ? `${interaction.member.nickname}`
      : interaction.user.username;

    // Uložení
    setVacation(interaction.user.id, {
      from: od,
      to: do_,
      icReason: ic,
      oocReason: ooc,
      status: "Dovolená aktivní",
      memberLabel
    });

    // Embed jako na obrázku (styl)
    const embed = new EmbedBuilder()
      .setColor(0x57F287) // zelená
      .setTitle("✅ Dovolená nastavena")
      .setDescription(
        `**Člen:** ${memberLabel}\n` +
        `**Status:** Dovolená aktivní\n` +
        `**ID:** ${interaction.user.id}`
      )
      .addFields(
        {
          name: "📅 Období dovolené",
          value: `**Od:** ${od}\n**Do:** ${do_}`,
          inline: false
        },
        {
          name: "🛡️ IC Důvod (In-Character)",
          value: ic,
          inline: false
        },
        {
          name: "📝 OOC Důvod (Out-of-Character)",
          value: ooc,
          inline: false
        }
      );

    return interaction.editReply({ embeds: [embed] });
  }
};
