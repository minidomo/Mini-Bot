import Discord from 'discord.js';
import Hex from '../../util/Hex';

const embed = new Discord.RichEmbed().setTitle(`Frequently Asked Questions`);

export default {
    name: 'faq',
    description: 'Frequently Asked Questions.',
    usage: 'faq',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        embed.setColor(Hex.generateNumber());
        msg.channel.send(embed);
    }
};

embed.addField(
    `General | What are those things encased in the <> when I use the help command?`,
    `Those are called [parameters](https://www.google.com/search?q=parameter+computer+science) `
    + `and provide information on what is to be included when using the command.`
);

embed.addField(
    `General | What do those question marks in the parameters mean when I use the help command?`,
    `Those indicate that the parameter is optional, and the command can be run without `
    + `using that parameter.`
);

embed.addField(
    `General | Why is the command not working correctly?`,
    `You either used the command wrong or the code is just bad.\n`
    + `When using commands, the information is separated by spaces and/or quotation marks. `
    + `In other words, things encased by quotation marks will be counted as one and considered together; `
    + `however, using quotation marks within quotation marks will not work and could mess up the `
    + `bot's ability of [parsing](https://www.google.com/search?q=parse) the input.`
);

embed.addField(
    `plview | Why is only part of the title shown?`,
    `Due to the limited amount of characters able to send in this message, `
    + `only the first ${13} characters are shown.`
);

embed.addField(
    'plview | What are those characters at the end of each song?',
    `Those represent the youtube ID for the video of the corresponding song. `
    + `You can use them to access the original video by copying/pasting them onto this link: `
    + `\`https://www.youtube.com/watch?v=\`\n`
    + `So if the ID was \`123asd\`, then the url would be:\n\`https://www.youtube.com/watch?v=123asd\`.`
);