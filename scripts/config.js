export const config = {
    command: {
        /**
        * Prefix of the tpa command
        */
        prefix: "!",
        /**
         * Text that will show when typed "!tpa help"
         */
        helpText: [
            `- §6!tpa §c<@player>§f - Send a teleportation request to a player`,
            `- §6!tpa accept§f - Accept the teleportation request`,
            `- §6!tpa deny§f - Deny the teleportation request`,
            `- §6!tpa help§f - Show available commands for TPA`,
            `- §6!blocktpa§f - Block incoming TPA requests`,
            `- §6!unblocktpa§f - Unblock incoming TPA requests`
        ]
    },
    /**
     * The time after the TPA request will expire
     */
    settings: {
        expiryTime: 300 * 20 // 300 seconds = 5 minutes
    }
}
