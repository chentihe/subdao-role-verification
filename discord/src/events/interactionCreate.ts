import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
} from "discord.js";
import { Discord, On, ArgsOf } from "discordx";
import { addRoles } from "../utils/index.js";

@Discord()
abstract class InteractionCreate {
  @On({ event: "interactionCreate" })
  onInteraction(
    [interaction]: ArgsOf<"interactionCreate">,
    client: Client
  ): void {
    if (!interaction.isButton()) return;
    const reply = async () => {
      const user = interaction.user.id;
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Connect Wallet")
          .setStyle(ButtonStyle.Link)
          .setURL(`${process.env.FRONTEND_URL}?member=${user}`)
      ) as any;
      await interaction.reply({
        content: `member: ${user}`,
        components: [row],
        ephemeral: true,
      });
      client.once(
        "resultsOfHeadDAO",
        async (holder: number, staker: number) => {
          const embeds = new EmbedBuilder()
            .setTitle("Verification Result")
            .addFields([
              {
                name: "Total Amount of HeadDAO Holding",
                value: "" + holder,
              },
              {
                name: "Total Amount of HeadDAO Staking",
                value: "" + staker,
              },
            ]);

          console.log(embeds.toJSON());
          console.log(interaction.token);
          await interaction.followUp({ embeds: [embeds], ephemeral: true });
          addRoles(interaction, holder, staker);
        }
      );
    };
    reply();
  }
}
