const constants = {};

// DESIGN
constants.gutter = {
    small  : 10,
    medium : 20,
    large  : 30
};

constants.navigation = {
    height : 46
};

constants.player = {
    height : 100
};

constants.sidebar = {
    offset : {
        top    : constants.navigation.height + constants.gutter.small,
        bottom : constants.player.height + constants.gutter.small
    }
};

// CONFIGURATION
constants.pagination = {
    resultsPerPage : 20
};

constants.comments = {
    offset : 5
};

export default constants;
