/**
 * @author finnafinest_
 * @helpers Alone, Remember M9, Cennac
 */

import { world, Player } from "@minecraft/server";
import { config } from "./config.js";
import * as fn from "./functions.js";

/**
 *  @type {WeakSet<Player>}
 */
export const blockedTpas = new WeakSet();

world.beforeEvents.chatSend.subscribe(async chat => {
    const { sender, message } = chat;
    if (!message.startsWith(config.command.prefix)) return;
    const args = message.slice(config.command.prefix.length).trim().split(/\s+/);
    const command = args.shift();

    if (!command) return;
    chat.cancel = true;

    switch (command) {
        case "tpa": {
            switch (args[0]) {
                case "help": {
                    sender.sendMessage(config.command.helpText.join('\n'));
                    break;
                }
                case "accept": {
                    if (sender.sentFrom == undefined) return sender.sendMessage(`§cYou have no pending tpa requests!§r`);
                    fn.acceptTPARequest(sender.sentFrom, sender);
                    break;
                }

                case "deny": {
                    if (sender.sentFrom == undefined) return sender.sendMessage(`§cYou have no pending tpa requests!§r`);
                    fn.denyTPARequest(sender);
                    break;
                }

                default: {
                    const targetName = fn.getFirstMention(args.join(' '));
                    if (!targetName) {
                        sender.sendMessage("§cYou must mention a target player '@PlayerName'§r");
                        sender.sendMessage(config.command.helpText[0]);
                        return;
                    }
                    const playerToTpTo = fn.getPlayerByName(targetName);
                    if (playerToTpTo == undefined || !playerToTpTo.isValid) return sender.sendMessage(`§cSyntax Error: Player ${targetName} was not found!§r`);
                    fn.sendTPARequest(sender, playerToTpTo);
                    break;
                }
            }
            break;
        }

        case "blocktpa": {
            if (blockedTpas.has(sender)) return sender.sendMessage(`§6You are already blocking incoming TPA requests§r`);
            blockedTpas.add(sender);
            sender.sendMessage(`§6You blocked incoming tpa requests!§r`);
            break;
        }
        case "unblocktpa": {
            if (!blockedTpas.has(sender)) return sender.sendMessage(`§6You already have incoming TPA requests unblocked§r`);
            blockedTpas.delete(sender);
            sender.sendMessage(`§6You unblocked incoming TPA requests!§r`);
            break;
        }
    }
});
