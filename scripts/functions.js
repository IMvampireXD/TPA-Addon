import { system, world, Player } from "@minecraft/server";
import { config } from './config.js'
import { blockedTpas } from './main.js'

/**
 * @param {string} playerName
 * @returns {Player}
 */
export function getPlayerByName(playerName) {
    return world.getPlayers({ name: playerName })[0];
};

export function getFirstMention(message = '@') {
    let name = message.split('@')[1];
    if (!name) return '';
    if (name.startsWith('"')) return name.split('"')[1];
    if (name.includes(' ')) return name.split(' ')[0];
    return name;
};

/**
 * 
 * @param {Player} sender 
 * @param {Player} targetPlayer 
 */
export function sendTPARequest(sender, targetPlayer) {
    const senderName = sender.name;
    const targetPlayerName = targetPlayer.name;
    if (senderName === targetPlayerName) return sender.sendMessage(`§eYou can't send a TPA request to yourself!§r`);
    if (sender.sentTo) return sender.sendMessage(`§eYou already have an outgoing TPA request`);
    if (blockedTpas.has(targetPlayer)) return sender.sendMessage(`§eThis player is currently not accepting TPA requests`);

    sender.sentTo = targetPlayer;
    targetPlayer.sentFrom = sender;

    targetPlayer.sendMessage(`§aYou recieved a tpa request from ${senderName}!  Accept it with "§l!tpa accept§r§a".`);
    sender.sendMessage(`§aSuccessfully sent tpa request to ${targetPlayerName}, it will expire in 5 minutes.`);
    system.waitTicks(config.settings.expiryTime).then(() => {
        if (sender.sentTo == undefined && targetPlayer.sentFrom == undefined) return;
        if (sender.isValid) {
            sender.sendMessage(`§eYour teleport request to ${targetPlayerName} has expired.`);
            system.run(() => sender.playSound(`mob.agent.spawn`));
        }
        if (targetPlayer.isValid) {
            targetPlayer.sendMessage(`§eThe teleport request from ${senderName} has expired.`);
            system.run(() => targetPlayer.playSound(`mob.agent.spawn`));
        }
        requester.sentTo = undefined;
        acceptor.sentFrom = undefined;
    });
}

/**
 * @param {Player} requester 
 * @param {Player} acceptor 
 */
export function acceptTPARequest(requester, acceptor) {
    if (!requester || !requester.isValid) {
        acceptor.sendMessage(`§cCouldn't find the player, did they leave?`);
        acceptor.sentFrom = undefined;
        return;
    }
    acceptor.sendMessage(`§aYou have accepted the teleport request from ${requester.name}! §a${requester.name} has been teleported to your location.`);
    requester.sendMessage(`§a${acceptor.name} has accepted your tpa request! §aYou have been teleported to ${acceptor.name}.`);
    system.run(() => {
        requester.teleport(acceptor.location, { dimension: acceptor.dimension })
        requester.playSound(`mob.endermen.portal`);
        acceptor.playSound(`mob.endermen.portal`);
    });
    requester.sentTo = undefined;
    acceptor.sentFrom = undefined;
}

/**
 * @param {Player} denier
 * @param {Player} denier.sentFrom
 * @author cennac2
 */
export function denyTPARequest(denier) {
    denier.sendMessage(`§aYou denied the teleport request from ${denier.sentFrom.name}.`);
    system.run(() => denier.playSound(`mob.agent.spawn`));
    if (denier.sentFrom?.isValid) {
        denier.sentFrom.sendMessage(`§cYour teleport request to ${denier.name} was denied.`);
        system.run(() => denier.sentFrom.playSound(`mob.agent.spawn`));
    }
    sentFrom.sentTo = undefined;
    denier.sentFrom = undefined;
}
