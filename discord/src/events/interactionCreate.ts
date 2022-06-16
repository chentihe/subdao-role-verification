import { Client, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { addRoles } from "../utils/index.js";

@Discord()
export class InteractionCreate {
  @On("interactionCreate")
  onInteraction(
    [interaction]: ArgsOf<"interactionCreate">, client: Client
  ): void {
    if (!interaction.isButton()) return;
    const user = interaction.user.id;
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Connect Wallet")
        .setStyle("LINK")
        .setURL(`${process.env.FRONTEND_URL}?member=${user}`)
    );
    interaction.reply({
      content: `member: ${user}`,
      components: [row],
      ephemeral: true,
    });

    client.once("resultsOfHeadDAO", async (holder: number, staker: number) => {
      const embeds = new MessageEmbed()
        .setTitle("Verification Result")
        .addField("Total Amount of HeadDAO Holding", "" + holder)
        .addField("Total Amount of HeadDAO Staking", "" + staker);
      await interaction.followUp({ embeds: [embeds], ephemeral: true });
      addRoles(interaction, holder, staker);
    });
  }
}