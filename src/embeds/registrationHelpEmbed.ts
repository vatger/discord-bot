import { EmbedBuilder } from 'discord.js';

export const registrationHelpEmbed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setTitle('Registration Help')
    .addFields([
        {
            name: '**Why I see this channel?**',
            value: `When you join the server you usually get the VATSIM Member role without any delay, because you own a VATSIM ID.
                    We created some more channels for our user who are also members of VATSIM Germany. If you either don't be a member of VATSIM Germany or something was broken during your intiial role assignment, you will see this channel.`,
        },
        {
            name: '**How to get the VATGER-Member role?**',
            value: `If you think you didn't get the VATGER Member role by mistake or you registered your VATSIM Account with the Germany Divsion afterwards, simply type \`/register\` in the chatbox to start the role assignment flow manually.`,
        },
        
    ]);