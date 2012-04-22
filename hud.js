/*
 * hud.js
 * 
 * Defines various HUD classes.
 *
 * Author: Andrew Ford
 */

var HPDisplay = me.HUD_Item.extend(
{
    init: function( x, y )
    {
        this.parent( x, y );
        this.font = new me.BitmapFont( "32x32_font", 32 );
    },
    
    draw: function( context, x, y )
    {
        this.font.draw( context, "HP: " + this.value, this.pos.x + x, this.pos.y + y );
    }
});

var LevelDisplay = me.HUD_Item.extend(
{
    init: function( )
    {
        var defaultLevel = 0;
        var x = me.video.getWidth() / 2;
        var y = me.video.getHeight() / 2;
        this.parent( x, y, defaultLevel );
        this.font = new me.BitmapFont( "32x32_font", 32 );
        this.reset();
    },

    /** Resets the level value to default value and the timer to 0 */
    reset: function() {
        this.parent();
        this.start = false;
        this.ping = me.timer.getTime();
    },

    /** Draws the level display if the timer hasn't expired.
     * TODO: Possible performance tweak would be to cache timer expire. */
    draw: function( context, x, y )
    {
        if( ! this.start ) {
            this.start = me.timer.getTime();
        }

        if( me.timer.getTime() - this.start < 2000 ) {
            this.font.draw( context, "LEVEL " + this.value, this.pos.x + x, this.pos.y + y );
        }
    }
});
