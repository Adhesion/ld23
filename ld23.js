/*
 * ld23.js
 * 
 * Main file for LD23 entry.
 *
 * Author: Andrew Ford
 */

var jsApp =
{
    onload: function()
    {
        if ( !me.video.init( 'game', 640, 480 ) )
        {
            alert( "Sorry, it appears your browser does not support HTML5 canvas." );
            return;
        }

        me.audio.init( "mp3,ogg" );

        me.loader.onload = this.loaded.bind( this );

        me.loader.preload( gameResources );

        me.state.change( me.state.LOADING );
    },
    
    loaded: function()
    {

        me.state.set( me.state.PLAY, new PlayScreen() );
        
        me.entityPool.add( "player", Player );
        me.entityPool.add( "enemy", Enemy );
        
        me.debug.renderHitBox = true;
        
        me.state.change( me.state.PLAY );
    }
}

var LevelChanger = me.LevelEntity.extend({
    init: function( x, y, settings ) {
        console.log("Level changer");
        this.parent( x, y, settings );
    },
    goTo: function ( level ) {
        this.parent( level );
        me.state.current().changeLevel( this.gotolevel );
    }
});

var PlayScreen = me.ScreenObject.extend(
{

    init: function () {
        me.entityPool.add("LevelChanger", LevelChanger);
        this.levelDisplay = new LevelDisplay();
    },


    changeLevel: function( l ) {
        this.levelDisplay.reset();
    },

    getLevel: function() {
        var level = me.levelDirector.getCurrentLevelId();
        var re = /level(\d+)/;
        var results = re.exec(level);
        console.log( results );
        return results[1];
    },

    onResetEvent: function()
    {
        // stuff to reset on state change
        me.game.addHUD( 0, 0, me.video.getWidth(), me.video.getHeight() );
        me.game.HUD.addItem( "hp", new HPDisplay( 620, 0 ) );
        me.game.HUD.addItem( "levelTitle", this.levelDisplay );
        this.restartLevel();
    },

    restartLevel: function() {
        this.levelDisplay.reset();
        var level = me.levelDirector.getCurrentLevelId();
        me.levelDirector.loadLevel( level );
        me.game.sort();
    },

    onDestroyEvent: function()
    {
        
    }
});

window.onReady( function()
{
    jsApp.onload();
});
