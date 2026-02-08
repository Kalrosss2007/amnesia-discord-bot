require("dotenv").config();

const http = require("http");

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok");
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("running");
}).listen(PORT, () => {
  console.log("🌐 health server listening on", PORT);
});

const http = require("http");

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok");
  }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("running");
}).listen(PORT, () => {
  console.log("🌐 Web ping port listening on", PORT);
});

const fs = require("fs");
const path = require("path");
const {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

// ---------- ENV CHECK ----------
if (!process.env.DISCORD_TOKEN) {
  console.log("❌ Chybí DISCORD_TOKEN v .env");
  process.exit(1);
}

// ---------- CLIENT ----------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers // nutné pro guildMemberAdd
  ],
});

client.commands = new Collection();

// ---------- LOAD COMMANDS ----------
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.existsSync(commandsPath)
  ? fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))
  : [];

console.log("📦 Načítám příkazy:", commandFiles);

for (const file of commandFiles) {
  try {
    const cmd = require(path.join(commandsPath, file));

    if (!cmd?.data?.name || typeof cmd.execute !== "function") {
      console.log("❌ Neplatný command soubor:", file);
      continue;
    }

    client.commands.set(cmd.data.name, cmd);
  } catch (e) {
    console.log("❌ Chyba při načítání commandu:", file);
    console.error(e);
  }
}

// ---------- READY ----------
client.once("ready", () => {
  console.log(`✅ ONLINE jako ${client.user.tag}`);
});

// ---------- WELCOME (JOIN) EMBED ----------
client.on("guildMemberAdd", async (member) => {
  try {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    if (!channelId) return; // když není nastaveno, nic se neposílá

    const channel = await member.guild.channels.fetch(channelId).catch(() => null);
    if (!channel) {
      console.log("⚠️ WELCOME_CHANNEL_ID je špatně nebo bot nevidí kanál.");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("👋 Nový člen")
      .setDescription(
        `Vítej na serveru **${member.guild.name}**!\n\n` +
        `**Uživatel:** ${member.user}\n` +
        `**ID:** ${member.user.id}`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields({
        name: "📅 Připojil se",
        value: `<t:${Math.floor(Date.now() / 1000)}:f>`,
        inline: false
      })
      .setFooter({ text: "Amnesia RP" });

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("❌ guildMemberAdd error:", err);
  }
});

// ---------- INTERACTIONS (SLASH COMMANDS) ----------
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    // kdyby se někdy stalo, že Discord má command registrovaný, ale bot ho nemá
    try {
      return await interaction.reply({ content: "Tenhle příkaz v botu nemám.", ephemeral: true });
    } catch {
      return;
    }
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error("❌ Chyba v příkazu:", interaction.commandName, err);

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "Nastala chyba při vykonání příkazu.", ephemeral: true });
      } else {
        await interaction.reply({ content: "Nastala chyba při vykonání příkazu.", ephemeral: true });
      }
    } catch {
      // nic
    }
  }
});

// ---------- LOGIN ----------
client.login(process.env.DISCORD_TOKEN);


