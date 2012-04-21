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
    onResetEvent: function()
    {
        // stuff to reset on state change
        me.levelDirector.loadLevel("level0");
    },

    onDestroyEvent: function()
    {
        
    }
});

window.onReady( function()
{
    jsApp.onload();
});