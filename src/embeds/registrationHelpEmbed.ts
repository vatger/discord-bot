import { EmbedBuilder } from 'discord.js';

export const registrationHelpEmbed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setTitle('Registration Help')
    .addFields([
        {
            name: '**Why do I see this channel?**',
            value: `As soon as you enter the server you immediately get the VATSIM Member role because you have a VATSIM ID.\nAs a member of VATSIM Germany you are able to see even more channels on this server.\nYou see this channel because you were not given the VATGER Member role in the beginning.\nThis can be either because you are not a member of VATSIM Germany or there was an error in the assignment of roles.\n\n`,
        },
        {
            name: '**How to get the VATGER-Member role?**',
            value: `If there was an error in assigning the role or you joined VATSIM Germany at a later time, just use the \`/register\` command to apply for the role again.`,
        },
        
    ]);