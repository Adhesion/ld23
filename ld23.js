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

var PlayScreen = me.ScreenObject.extend(
{

    init: function () {
        this.levelDisplay = new LevelDisplay();
        this.setLevel( 0 );
    },

    setLevel: function( l ) {
        this.levelName = "level" + l;
        this.currentLevel = l;
        this.levelDisplay.set( l );
    },

    onResetEvent: function()
    {
        // stuff to reset on state change
        me.game.addHUD( 0, 0, me.video.getWidth(), me.video.getHeight() );
        me.game.HUD.addItem( "hp", new HPDisplay( 620, 0 ) );
        me.game.HUD.addItem( "levelTitle", this.levelDisplay );
//        me.game.HUD.setItemValue( "hp", me.game.player.hp );
        this.restartLevel();
    },

    restartLevel: function() {
        this.levelDisplay.reset();
        me.levelDirector.loadLevel( this.levelName );
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
