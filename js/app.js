$(document).ready(function() {
    var tileSound = document.getElementById('tile-flip');
    var ringSound = document.getElementById('ring');
    var themeSound = document.getElementById('theme');

    var missed;
    var matches;
    var remaining;
    var activeCards = 0;
    themeSound.play();

    function createGame() {
        $('#game-board').empty();
        var tiles = createTileSet();
        var tilePairs = cloneTiles(tiles);
        tilePairs = _.shuffle(tilePairs);
        initiateBoard(tilePairs);
        missed = 0;
        matches = 0;
        remaining = 8;
        displayTimer();

        $('#successful-matches span').text(matches);
        $('#matches-left span').text(remaining);
        $('#missed-attempts span').text(missed);
    }

    createGame();


    $('#new-game').click(function() {
        createGame();
    });

    $('#canvas').click(function() {
        $('#canvas').css('visibility', 'hidden');
    });

    var $prevTile = null; // if null, no tiles have been flipped. If not null, one tile has been flipped

    $('#game-board img').click(function() { /* clicks a tile */
        //img.addClass('switch'); // need to add class
        if (activeCards < 2) {
            tileSound.play();
            var $currTile = $(this); // this is the img that got clicked
            // var currTile = $currTile.data('tile'); // this is the tile object associated w/ the image that got clicked

            if (!$currTile.data('tile').flipped) { // not clicking on same tile twice

                console.log('Did not click on the same thing 2x');
                flipTile($currTile);

                if ($prevTile != null) { // if previously tile is flipped, do a comparison

                    if ($currTile.data('tile').src === $prevTile.data('tile').src) { // if matched
                        console.log("Comparing Matched Pair");
                        activeCards = 0;
                        setTimeout(function () {
                            ringSound.play();
                        }, 750);

                        matches++;
                        remaining--;

                        $('#successful-matches span').text(matches);
                        $('#matches-left span').text(remaining);

                        $currTile.addClass('flipped');
                        $prevTile.addClass('flipped');

                        $prevTile = null;


                    } else { // they don't match
                        missed++;
                        $('#missed-attempts span').text(missed);
                        setTimeout(function () {
                            flipTile($currTile);
                            flipTile($prevTile);
                            activeCards = 0;
                            console.log('flip both back to backtile');
                            console.log('your tiles dont match');
                            $prevTile = null;
                        }, 1000);
                    }
                } else { // no tile is flipped, designate this tile to previous tile
                    console.log("No tile is flipped");
                    $prevTile = $currTile;

                } // on click of gameboard images

            } else {
                console.log('clicked on the same thing twice');
            }
        }
    });


    // initiates the board
    function initiateBoard(tilePairs) {
        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));

        var img;
        _.forEach(tilePairs, function (tile, elemIndex) {
            if (elemIndex > 0 && 0 == elemIndex % 4) { /* this is how you chunk it up into 4 */
                gameBoard.append(row);
                /* its 0 == elemIndex % 4 so that it throws error if you assign value with '=' */
                row = $(document.createElement('div'));
            }

            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'image of tile ' + tile.tileNum
            });
            img.data('tile', tile);
            img.addClass('');
            row.append(img);
        });
        gameBoard.append(row);
    } // end initiateBoard

    function createTileSet() {
        var tiles = []; /* creating the basic tile array */
        var idx;
        for (idx = 3; idx <= 122; ++idx) {
            tiles.push({
                tileNum: idx,
                src: 'img/tile' + idx + '.png'
            });
        }
        return tiles;
    } // end createTileSet

    // clone the initial set of tiles
    function cloneTiles (tiles) {
        var shuffledTiles = _.shuffle(tiles);
        var selectedTiles = shuffledTiles.slice(0,8); /* non-inclusive so that's why 8 instead of 7 */

        var tilePairs = []; /* clone our object twice and put both clones into tilepairs */
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });

        return tilePairs;
    } // end cloneTiles

    // displays the timer
    function displayTimer() {
        var startTime = _.now();
        clearTimeout(startTime);
        var timer = window.setInterval(function () {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            /* math floor rounds interval */
            $('#elapsed-seconds span').text(elapsedSeconds);
            /* if (elapsedSeconds >= 500) {
             window.clearInterval(timer);
             } */
        }, 1000);
    } // end displayTimer

    // flips a tile over
    function flipTile(img) {
        activeCards++;
        var tile = img.data('tile');
        img.fadeOut(150, function() { /* need to add a second function */
            if (tile.flipped) {
                img.attr('src', 'img/tile-back.png');
            }
            else {
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.fadeIn(100);
        });
    } // end flipTile




}); //jQuery Ready Function

/* need to create function
1. How to save information into click method so that it knows not to flip same thing over .flipped
2. Start new game
3. Celebration if game is over
4. CSS Button Creator ok?
5. Is flipped status stored in .data of object or just object.flipped?
n */
