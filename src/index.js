const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const moment = require("moment");
const { spawn } = require('child_process');
const wait = require('util').promisify(setTimeout);
require('dotenv').config();

client.once("ready", async () => {
  if (!client.application?.owner) await client.application?.fetch();
  // get(guildId)?.commands.fetch(commandId);
  const command = await client.guilds.cache
    .get(process.env.GUILD_ID)
    ?.commands.fetch("912871983488839720");

  const permissions = [
      // Feature testing role ID
    {
      id: "895602909390209034",
      type: "ROLE",
      permission: true,
    },
      // PCSoc exec role ID
    {
      id: process.env.ROLE_ID,
      type: "ROLE",
      permission: true,
    },
  ];

  await command.permissions.set({ permissions });
  console.log("Command permissions set");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "form") {
    let string = interaction.options.getString("input");
    let date = moment().format("L");
    date = date.replaceAll("/", "-");

    await interaction.reply('Generating link...');
    let link;
    // spawn new child process to call the python script
    const python = spawn('python', ['script.py', date, string]);
    // collect data from script
    await python.stdout.on('data', function (data) {
      link = data.toString();
      console.log(link);
    });
    await wait(8000);
    await interaction.editReply(String(link));
  }
});

client.login(process.env.DISCORD_TOKEN);
