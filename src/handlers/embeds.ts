'use strict';

const config = require('../../src/config.json');
import { PokemonEvents } from '../models/events';
import { getPokemonName } from '../services/locale';
import { get, stripIds, } from '../services/utils';
import { ActiveEvent, EventBonus, EventSpawn } from '../types/events';

const pogoIconUrl = 'https://www.creativefreedom.co.uk/wp-content/uploads/2016/07/pokemon1.png';
const embedSettings = {
    username: 'Pokemon Go Event Watcher',
    title: '**New Event Found**',
};

/**
 * Create Discord webhook payload embed from event object
 * @param {*} event 
 */
export const createEmbedFromNewEvent = async (event: ActiveEvent) => {
    let content = config.mention ? `<${config.mention}>` : null;
    const payload = {
        username: embedSettings.username,
        avatar_url: pogoIconUrl,
        content: content,
        embeds: [
            await createActiveEventEmbed(event)
        ]
    };
    return payload;
}

/**
 * Create Discord embed from event object
 * @param {*} event 
 */
export const createActiveEventEmbed = async (event: ActiveEvent) => {
    // TODO: Get nests
    const raids = await PokemonEvents.getAvailableRaidBosses();
    const availableRaids = Object.keys(raids)
                                 .map(x => `Level ${x}: ` + raids[x].map(y => getPokemonName(y.id))
                                 .join(', '));
    //const availableNests = await PokemonEvents.getAvailableNestPokemon();
    let description = `**Name:** ${event.name}\n`;
    if (event.start) {
        description += `**Starts:** ${event.start}\n`;
    }
    description += `**Ends:** ${event.end}\n`;
    const spawns = event.spawns || [];
    const eggs = event.eggs || [];
    const bonuses = event.bonuses || [];
    const features = event.features || [];
    const embed = {
        title: embedSettings.title,
        //url: "",
        description: description,
        color: 0x0099ff,
        fields: [{
            name: 'Event Bonuses',
            value: bonuses.length === 0
                ? `- ${(bonuses.map((x: EventBonus) => x.text) || []).join('\n- ')}`
                : 'N/A',
            inline: false,
        },{
            name: 'Event Features',
            value: features.length === 0
                ? 'N/A'
                : `- ${(features).join('\n- ')}`,
            inline: false,
        },{
            name: 'Last Nest Migration',
            value: 'N/A',// TODO: event.lastNestMigration,
            inline: true,
        },/*{
            name: 'Nesting Pokemon Species',
            value: event.nests.sort((a: number, b: number) => a - b).map((x: number) => getPokemonName(x)).join(', '),
            inline: false,
        },*/{
            name: 'Event Pokemon Spawns',
            value: spawns.length === 0
                ? spawns.map((x: EventSpawn) => x.id)
                        .sort((a: number, b: number) => a - b)
                        .map((x: number) => getPokemonName(x))
                        .join(', ')
                : 'N/A',
            inline: true,
        },{
            name: 'Event Hatchable Eggs',
            value: eggs.length === 0
                ? eggs.map(x => x.id)
                      .sort((a: number, b: number) => a - b)
                      .map((x: number) => getPokemonName(x))
                      .join(', ')
                : 'N/A',
            inline: true,
        },{
            name: 'Event Raids',
            value: availableRaids.length === 0
                ? availableRaids.join('\n')
                : 'N/A',
            inline: false,
        }],
        /*
        thumbnail: {
            url: ""
        },
        image: {
            url: ""
        },
        */
        footer: {
            text: new Date().toLocaleString(),
            icon_url: pogoIconUrl,
        }
    };
    return embed;
}