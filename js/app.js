$(document).ready(function(){
    var tiles = []; /* creating the basic tile array */
    var idx;
    for (idx = 3; idx <= 122; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.png'
        });
    }

    console.log(tiles);
    var shuffledTiles = _.shuffle(tiles);
    console.log(shuffledTiles);

    var selectedTiles = shuffledTiles.slice(0,8); /* non-inclusive so that's why 8 instead of 7 */
    console.log(selectedTiles);

    var tilePairs = []; /* clone our object tiwce and put both clones into tilepairs */
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });

    tilePairs = _.shuffle(tilePairs);

    console.log(tilePairs);

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
        if (elemIndex > 0 && 0 == elemIndex % 4) { /* this is how you chunk it up into 4 */
            gameBoard.append(row); /* its 0 == elemIndex % 4 so that it throws error if you assign value with '=' */
            row = $(document.createElement('div'));
        }

        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'image of tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);

    $('#game-board img').click(function() { /* need further elaboration */
        var img = $(this);
        var tile = img.data('tile');
        img.fadeOut(100, function() { /* need to add a second function */
            if (tile.flipped) {
                img.attr('src', 'img/tile-back.png');
            }
            else {
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.fadeIn(100);
        }); // after fadeOut
    }); // on click of gameboard images

    var startTime = _.now();
    var timer = window.setInterval(function() {
        var elapsedSeconds = Math.floor((_.now() - startTime) / 1000); /* math floor rounds interval */
        $('#elapsed-seconds').text(elapsedSeconds);
        if (elapsedSeconds >= 10) {
            window.clearInterval(timer);
        }
    }, 1000);

}); //jQuery Ready Function