import {
    ButtonInteraction,
    GuildMember,
    GuildMemberRoleManager,
    Role,
  } from "discord.js";
  
  export const addRoles = async (
    interaction: ButtonInteraction,
    holder: number,
    staker: number
  ) => {
    const user = await (<GuildMember>interaction.member);
    if (user === null) return;
  
    const userRoles = <GuildMemberRoleManager>user.roles;
  
    const isHolder = userRoles.cache.some(
      (role) => role.name === "HeadDAO Holder"
    );
    const isStaker = userRoles.cache.some(
      (role) => role.name === "HeadDAO Staker"
    );
  
    const headDAOHolder = <Role>(
      user.guild.roles.cache.find((role) => role.name === "HeadDAO Holder")
    );
  
    const headDAOStaker = <Role>(
      user.guild.roles.cache.find((role) => role.name === "HeadDAO Staker")
    );
  
    switch (discordRoleStrategy(holder, staker, isHolder, isStaker)) {
      case "ADD_HOLDER":
        user.roles.add(headDAOHolder);
        interaction.followUp({
          content: "You are HeadDAO holder now",
          ephemeral: true,
        });
        break;
      case "ADD_STAKER":
        user.roles.add(headDAOStaker);
        interaction.followUp({
          content: "You are HeadDAO staker now",
          ephemeral: true,
        });
        break;
      case "ADD_HOLDER_AND_STAKER":
        user.roles.add(headDAOHolder);
        user.roles.add(headDAOStaker);
        interaction.followUp({
          content: "You are HeadDAO staker & holder now",
          ephemeral: true,
        });
        break;
      case "ALREADY_VERIFIED":
        interaction.followUp({
          content: "You are already verified",
          ephemeral: true,
        });
        break;
      case "REMOVE_STAKER_AND_ADD_HOLDER":
        user.roles.remove(headDAOStaker);
        user.roles.add(headDAOHolder);
        interaction.followUp({
          content: "You are HeadDAO holder now",
          ephemeral: true,
        });
        break;
      case "REMOVE_HOLDER_AND_ADD_STAKER":
        user.roles.remove(headDAOHolder);
        user.roles.add(headDAOStaker);
        interaction.followUp({
          content: "You are HeadDAO staker now",
          ephemeral: true,
        });
        break;
      default:
        interaction.followUp({
          content: "You are not HeadDAO staker & holder yet",
          ephemeral: true,
        });
        break;
    }
  };
  
  export const discordRoleStrategy = (
    holder: number,
    staker: number,
    isHolder: boolean,
    isStaker: boolean
  ) => {
    if (holder > 0 && staker == 0) {
      if (isHolder) {
        return "ALREADY_VERIFIED";
      } else if (isStaker) {
        return "REMOVE_STAKER_AND_ADD_HOLDER";
      }
      return "ADD_HOLDER";
    }
  
    if (staker > 0 && holder == 0) {
      if (isStaker) {
        return "ALREADY_VERIFIED";
      } else if (isHolder) {
        return "REMOVE_HOLDER_AND_ADD_STAKER";
      }
      return "ADD_STAKER";
    }
  
    if (holder > 0 && staker > 0) {
      if (!isHolder && isStaker) {
        return "ADD_HOLDER";
      } else if (isHolder && !isStaker) {
        return "ADD_STAKER";
      } else if (!isHolder && !isStaker) {
        return "ADD_HOLDER_AND_STAKER";
      } else {
        return "ALREADY_VERIFIED";
      }
    }
  };
  