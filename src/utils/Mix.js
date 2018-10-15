import { extractFirstElement, extractTermsByTaxonomy } from './extract';
import {
      toTermNames
    , toPublishDate
    , toNumber
    , toDuration
    , toKbps
    , toMegabytes
} from './format';

/**
 * Convert WordPress post response into Tjoonz mix data.
 * @param {Object} mix Post JSON with mix data.
 */
export const extractMixData = mix => {
    const artists = extractTermsByTaxonomy( mix._embedded[ 'wp:term' ], 'artist' );
    return {
        id            : mix.id,
        slug          : mix.slug,
        content       : mix.content.rendered,
        description   : mix.meta._yoast_wpseo_metadesc,
        title         : mix.title.rendered,
        artists       : toTermNames( artists ),
        genres        : extractTermsByTaxonomy( mix._embedded[ 'wp:term' ], 'genre' ),
        tags          : extractTermsByTaxonomy( mix._embedded[ 'wp:term' ], 'post_tag' ),
        publishDate   : toPublishDate( mix.date_gmt ),
        featuredImage : extractFirstElement( mix._embedded[ 'wp:featuredmedia' ]),
        plays         : toNumber( mix.meta._tjnz_plays ),
        downloads     : toNumber( mix.meta._tjnz_downloads ),
        duration      : toDuration( mix.meta._tjnz_duration ),
        quality       : toKbps( mix.meta._tjnz_bitrate ),
        fileSize      : toMegabytes( mix.meta._tjnz_filesize )
    };
};